export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  date: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ProfileData {
  name: string;
  role: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
}

export type AIMode = 'developer' | 'designer' | 'mentor';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  mode?: AIMode; // Track which mode generated the response
}