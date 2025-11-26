import { ProfileData } from './types';

export const RESUME_DATA: ProfileData = {
  name: "Aditya Pratap Singh Negi",
  role: "Full Stack Developer & AI Engineer",
  contact: {
    email: "adityanegi281@gmail.com",
    phone: "+91 7456961296",
    location: "Uttrakhand, India",
    linkedin: "Aditya Pratap Singh Negi", // Placeholder for actual URL if known
    github: "AdityaNegi", // Placeholder
  },
  education: [
    {
      institution: "Vellore Institute of Technology, Bhopal",
      degree: "B.Tech - Computer Science and Engg.",
      year: "2024"
    }
  ],
  experience: [
    {
      company: "ClarityUX",
      role: "AI Product Engineer Intern",
      period: "Jul 2025 - Sep 2025",
      description: [
        "Contributed as a full stack developer to an AI-powered DesignOps platform.",
        "Built and optimized front-end UI components while developing back-end features.",
        "Collaborated with product team to brainstorm, code, test, and debug using AI tools."
      ]
    },
    {
      company: "Outlier AI",
      role: "AI Trainer & Front-End Developer",
      period: "Oct 2024 - Oct 2024",
      description: [
        "Contributed to training AI models in Java, improving accuracy and efficiency.",
        "Assisted in training AI prompts focused on front-end development workflows."
      ]
    }
  ],
  projects: [
    {
      id: "1",
      title: "Off Beat Himalaya",
      description: "A user-friendly trekking website to simplify the process of exploring and booking trek plans.",
      tags: ["React.js", "JavaScript", "HTML/CSS"],
      date: "Apr 2025 - Jun 2025"
    },
    {
      id: "2",
      title: "Galaxy",
      description: "Full Stack Social Media Application with Google auth, CRUD operations, and real-time features.",
      tags: ["React.js", "HTML", "CSS", "JavaScript"],
      date: "Nov 2022 - Jan 2023"
    },
    {
      id: "3",
      title: "Evento",
      description: "Event Management Website with invite creation, dashboard, and guest list management.",
      tags: ["PHP", "JavaScript", "HTML", "CSS"],
      date: "Jan 2022 - Mar 2022"
    }
  ],
  skills: [
    { name: "Languages", skills: ["Java", "JavaScript", "HTML", "CSS"] },
    { name: "Frameworks/Libraries", skills: ["React", "Node.js", "Express"] },
    { name: "Concepts", skills: ["Data Structures & Algorithms", "REST API", "Full Stack Development"] }
  ]
};
