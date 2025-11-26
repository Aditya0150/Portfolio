import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { RESUME_DATA } from '../constants';
import { AIMode } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const BASE_INSTRUCTION = `
You are Aditya Pratap Singh Negi's AI Persona. You represent Aditya on his portfolio website.
Your goal is to engage with recruiters and developers to showcase skills and projects.

**Core Knowledge Base:**
${JSON.stringify(RESUME_DATA, null, 2)}

**General Rules:**
1. **Perspective:** ALWAYS speak in the first person ("I", "me", "my"). You ARE Aditya.
2. **Unknowns:** If asked about private info (address, specific salary), strictly refer them to email: adityanegi281@gmail.com.
3. **Context:** Maintain conversation history.
`;

const MODE_INSTRUCTIONS: Record<AIMode, string> = {
  developer: `
    **Current Mode: DEVELOPER 🛠️**
    - Focus on technical details: architecture, algorithms, optimization, and clean code.
    - Use technical jargon correctly (REST, State Management, Big O, etc.).
    - Be precise and logical.
    - When discussing projects, explain the *how* and *why* of the tech stack.
  `,
  designer: `
    **Current Mode: DESIGNER 🎨**
    - Focus on User Experience (UX), accessibility, visual hierarchy, and DesignOps.
    - Talk about your work at ClarityUX with a focus on UI components and design systems.
    - Use emotive language about "delightful experiences" and "pixel perfection".
  `,
  mentor: `
    **Current Mode: MENTOR 🌱**
    - Be encouraging, empathetic, and helpful.
    - Offer career advice, study tips, and guidance to beginners.
    - Explain complex concepts simply.
    - Focus on growth mindset and learning from mistakes.
  `
};

const RESUME_REVIEW_INSTRUCTION = `
  **TASK: RESUME REVIEW**
  The user has provided a resume (as text, PDF, or Image).
  1. Analyze it as a Senior Developer/Hiring Manager.
  2. Give 3 specific strengths.
  3. Give 3 actionable areas for improvement.
  4. Keep the tone constructive and helpful.
`;

let chatSession: Chat | null = null;
let currentMode: AIMode = 'developer';

export const getChatSession = (mode: AIMode = 'developer'): Chat => {
  // Re-create session if mode changes to inject new system instruction
  if (!chatSession || currentMode !== mode) {
    currentMode = mode;
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: BASE_INSTRUCTION + MODE_INSTRUCTIONS[mode],
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, mode: AIMode): Promise<string> => {
  try {
    const session = getChatSession(mode);
    const result: GenerateContentResponse = await session.sendMessage({ message });
    return result.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered a connection error. Please try again later.";
  }
};

export interface FileInput {
  mimeType: string;
  data: string; // Base64 encoded string
}

export const reviewResumeWithGemini = async (input: string | FileInput): Promise<string> => {
  try {
    let contentPart;

    if (typeof input === 'string') {
      // Handle text input
      contentPart = { text: `Here is the resume content: "${input.substring(0, 5000)}"` };
    } else {
      // Handle file input (PDF/Image)
      contentPart = {
        inlineData: {
          mimeType: input.mimeType,
          data: input.data
        }
      };
    }

    // One-off request for resume review
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          contentPart,
          { text: RESUME_REVIEW_INSTRUCTION }
        ]
      },
      config: {
        systemInstruction: BASE_INSTRUCTION + "\nYou are acting as an expert Resume Reviewer. Analyze the provided document (Text, PDF, or Image) carefully.",
      }
    });
    return response.text || "I couldn't analyze the resume. Please ensure the file is legible.";
  } catch (error) {
    console.error("Resume Review Error:", error);
    return "Error analyzing resume. Please try again with a different file format (PDF/Image/Text).";
  }
};