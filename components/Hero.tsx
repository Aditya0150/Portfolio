import React, { useState, useEffect } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { RESUME_DATA } from '../constants';

const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "Full Stack Developer & AI Engineer";
  
  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50); // Speed of typing
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative pt-20 pb-32 flex items-center min-h-[90vh] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="text-center lg:text-left animate-slide-up">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Available for Hire
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Aditya</span>
          </h1>
          
          <div className="h-8 md:h-10 mb-6">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-mono">
              {text}<span className="animate-blink">|</span>
            </p>
          </div>
          
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            I build modern, scalable web applications with a focus on seamless user experiences and complex AI integrations. 
            Turning caffeine into code and ideas into reality.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a 
              href="#projects" 
              className="px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              View My Work <ArrowRight size={18} />
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="px-8 py-3.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              Download Resume <Download size={18} />
            </a>
          </div>
        </div>

        {/* Visual Element / Abstract Code Block */}
        <div className="relative hidden lg:block animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl rotate-3 opacity-20 blur-lg"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:rotate-1 transition-transform duration-500">
            <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-xs text-gray-500 font-mono">portfolio.tsx</div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code className="block text-gray-800 dark:text-gray-200">
                  <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-blue-600 dark:text-blue-400">developer</span> = <span className="text-yellow-600 dark:text-yellow-400">{'{'}</span>
                  {'\n'}  name: <span className="text-green-600 dark:text-green-400">'{RESUME_DATA.name}'</span>,
                  {'\n'}  role: <span className="text-green-600 dark:text-green-400">'{RESUME_DATA.role}'</span>,
                  {'\n'}  skills: [<span className="text-green-600 dark:text-green-400">'React'</span>, <span className="text-green-600 dark:text-green-400">'Node.js'</span>, <span className="text-green-600 dark:text-green-400">'GenAI'</span>],
                  {'\n'}  passion: <span className="text-green-600 dark:text-green-400">'Building the future'</span>,
                  {'\n'}  hireable: <span className="text-blue-600 dark:text-blue-400">true</span>
                  {'\n'}
                  <span className="text-yellow-600 dark:text-yellow-400">{'}'}</span>;
                  {'\n\n'}
                  <span className="text-gray-500">// Let's build something amazing together!</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;