import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Mic, Volume2, Upload, Code, PenTool, Heart, RotateCcw, Minus } from 'lucide-react';
import { sendMessageToGemini, reviewResumeWithGemini, FileInput } from '../services/gemini';
import { ChatMessage, AIMode } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('developer');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Dynamic Greeting Logic
  const getInitialGreeting = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    
    return `${timeOfDay}! ☀️ I'm Aditya's AI Persona.

I'm here to give you the inside scoop on my development journey. We can discuss:
• My Full Stack projects (React, Node, Java) 💻
• My experience at ClarityUX 🧠
• Why I'm the perfect fit for your team! 🚀

What's on your mind?`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: getInitialGreeting(),
      timestamp: new Date(),
      mode: 'developer'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // --- Voice Output ---
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || voices[0];
      utterance.voice = preferredVoice;
      utterance.pitch = 1;
      utterance.rate = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Voice Input ---
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };

  // --- Resume Upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const isBinary = file.type.startsWith('image/') || file.type === 'application/pdf';
    const reader = new FileReader();

    reader.onload = async (ev) => {
      const result = ev.target?.result as string;
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: `[Uploaded ${file.name}] Please review this resume.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);

      try {
        let review;
        if (isBinary) {
          const base64Data = result.split(',')[1];
          const fileInput: FileInput = { mimeType: file.type, data: base64Data };
          review = await reviewResumeWithGemini(fileInput);
        } else {
          review = await reviewResumeWithGemini(result);
        }

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: review,
          timestamp: new Date(),
          mode: 'mentor'
        };
        setMessages(prev => [...prev, botMsg]);
        setMode('mentor');
      } catch (err) {
        console.error(err);
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "I encountered an error reading that file. Please try a different format (PDF or Image preferred).",
          timestamp: new Date(),
          mode: 'mentor'
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    if (isBinary) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text, mode);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        mode: mode
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: 'welcome-reset',
      role: 'model',
      text: getInitialGreeting(),
      timestamp: new Date(),
      mode: 'developer'
    }]);
    setMode('developer');
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[380px] h-[550px] max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up origin-bottom-left transition-all duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                     <Bot size={24} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Aditya (AI Persona)</h3>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1 opacity-90">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    Online | Gemini 2.5
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleReset}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-blue-100 hover:text-white"
                  title="Reset Chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-blue-100 hover:text-white"
                  title="Close / Minimize"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex gap-2 mt-4 bg-white/10 p-1 rounded-lg backdrop-blur-sm border border-white/10">
              <button
                onClick={() => setMode('developer')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${mode === 'developer' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <Code size={12} /> Dev
              </button>
              <button
                onClick={() => setMode('designer')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${mode === 'designer' ? 'bg-white text-purple-600 shadow-sm' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <PenTool size={12} /> Design
              </button>
              <button
                onClick={() => setMode('mentor')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${mode === 'mentor' ? 'bg-white text-green-600 shadow-sm' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <Heart size={12} /> Mentor
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                 {/* Mode Badge for Model messages */}
                 {msg.role === 'model' && msg.mode && (
                   <span className={`text-[9px] mb-1 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold opacity-70 ${
                     msg.mode === 'developer' ? 'bg-blue-100 text-blue-700' :
                     msg.mode === 'designer' ? 'bg-purple-100 text-purple-700' :
                     'bg-green-100 text-green-700'
                   }`}>
                     {msg.mode}
                   </span>
                 )}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                
                {msg.role === 'model' && msg.id === messages[messages.length - 1].id && (
                  <button 
                    onClick={() => speakText(msg.text)}
                    className={`mt-1 ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isSpeaking ? 'text-blue-600' : 'text-gray-400'}`}
                    title="Read Aloud"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-sm">
                   <Loader2 size={18} className="animate-spin text-blue-600" />
                   <span className="text-xs text-gray-500 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {/* Toolbar */}
            <div className="flex gap-3 mb-2 px-2">
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors font-medium group"
                title="Upload Resume (PDF, Images, Text)"
               >
                 <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                    <Upload size={12} />
                 </div>
                 Resume Review
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".txt,.md,.pdf,.jpg,.jpeg,.png,.webp"
                 onChange={handleFileUpload}
               />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${mode} Aditya...`}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all border border-transparent focus:bg-white dark:focus:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={startListening}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  title="Voice Input"
                >
                  <Mic size={16} />
                </button>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 relative group border-4 border-white dark:border-gray-800`}
        aria-label="Open Chatbot"
      >
        <MessageCircle size={32} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
        
        {/* Tooltip */}
        <span className="absolute left-full ml-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg arrow-left">
          Chat with AI Aditya
        </span>
      </button>

       {/* Re-open button small when open (optional, usually hidden but good for UX if window obscures toggle area) 
           Actually, we hide the main toggle when open, but the window itself is the interaction point. 
           We can leave it hidden as standard chatbot behavior. 
       */}
    </div>
  );
};

export default ChatWidget;