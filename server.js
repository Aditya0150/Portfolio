const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'database.json');

// --- Data Initialization ---

// Default Data
const DEFAULT_DATA = {
  visitorCount: 1025,
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
  ]
};

// Load or Create Database File
let dbData = { ...DEFAULT_DATA };

if (fs.existsSync(DB_FILE)) {
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    dbData = JSON.parse(fileContent);
    // Ensure structure integrity
    if (!dbData.projects) dbData.projects = DEFAULT_DATA.projects;
    if (!dbData.visitorCount) dbData.visitorCount = DEFAULT_DATA.visitorCount;
  } catch (error) {
    console.error("Error reading database file, using defaults:", error);
  }
} else {
  saveData();
}

function saveData() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
  } catch (error) {
    console.error("Error saving to database file:", error);
  }
}

// Static Resume Data (Read-only for now)
const RESUME_DATA = {
  name: "Aditya Pratap Singh Negi",
  role: "Full Stack Developer & AI Engineer",
  contact: {
    email: "adityanegi281@gmail.com",
    phone: "+91 7456961296",
    location: "Uttrakhand, India",
    linkedin: "Aditya Pratap Singh Negi",
    github: "AdityaNegi",
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
  skills: [
    { name: "Languages", skills: ["Java", "JavaScript", "HTML", "CSS"] },
    { name: "Frameworks/Libraries", skills: ["React", "Node.js", "Express"] },
    { name: "Concepts", skills: ["Data Structures & Algorithms", "REST API", "Full Stack Development"] }
  ]
};

// --- Routes ---

// 1. Projects & Data Endpoints
app.get('/api/projects', (req, res) => {
  res.json(dbData.projects);
});

app.get('/api/experience', (req, res) => {
  res.json(RESUME_DATA.experience);
});

app.get('/api/skills', (req, res) => {
  res.json(RESUME_DATA.skills);
});

app.get('/api/profile', (req, res) => {
  res.json(RESUME_DATA);
});

// 2. Visitor Counter
app.get('/api/visitors', (req, res) => {
  res.json({ count: dbData.visitorCount });
});

app.post('/api/visitors', (req, res) => {
  dbData.visitorCount++;
  saveData(); // Persist to file
  res.json({ count: dbData.visitorCount });
});

// 3. Contact Form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Simulate email sending
  console.log('New Contact Form Submission:', { name, email, message });

  res.json({ 
    success: true, 
    message: 'Thank you for reaching out! I will get back to you soon.' 
  });
});

// 4. Admin & CRUD
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // Simple hardcoded password for demo
  if (password === 'admin123') {
    res.json({ success: true, token: 'mock-jwt-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: Date.now().toString(),
    ...req.body
  };
  dbData.projects.unshift(newProject);
  saveData();
  res.json({ success: true, project: newProject });
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const index = dbData.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    dbData.projects[index] = { ...dbData.projects[index], ...req.body };
    saveData();
    res.json({ success: true, project: dbData.projects[index] });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  dbData.projects = dbData.projects.filter(p => p.id !== id);
  saveData();
  res.json({ success: true, message: 'Project deleted' });
});

// Health check
app.get('/', (req, res) => {
  res.send('Aditya Negi Portfolio Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});