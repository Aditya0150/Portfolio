import { AIMode } from '../types';

// Use the backend URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('Gemini Service using API_URL:', API_URL);

export interface FileInput {
  mimeType: string;
  data: string; // Base64 encoded string
}

export const sendMessageToGemini = async (message: string, mode: AIMode): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, mode }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered a connection error. Please try again later.";
  }
};

export const reviewResumeWithGemini = async (input: string | FileInput): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/resume-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "I couldn't analyze the resume. Please ensure the file is legible.";
  } catch (error) {
    console.error("Resume Review Error:", error);
    return "Error analyzing resume. Please try again with a different file format (PDF/Image/Text).";
  }
};