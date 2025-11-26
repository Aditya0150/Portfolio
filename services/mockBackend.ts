import { RESUME_DATA } from '../constants';
import { Project, Experience, SkillCategory } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Keys for LocalStorage Persistence (Fallback Mode)
const STORAGE_KEYS = {
  PROJECTS: 'portfolio_projects',
  VISITORS: 'portfolio_visitors',
};

/**
 * Helper: Simulate network delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper: Safe JSON parse from localStorage
 */
const getFromStorage = <T>(key: string, defaultData: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch {
    return defaultData;
  }
};

/**
 * Helper: Save to localStorage
 */
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- DATA FETCHING ---

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const response = await fetch(`${API_BASE_URL}/projects`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    // Fallback: Use LocalStorage or Default Constants
    // If we have nothing in storage, save the default RESUME_DATA there so we can edit it later
    let storedProjects = getFromStorage(STORAGE_KEYS.PROJECTS, null);
    if (!storedProjects) {
      storedProjects = RESUME_DATA.projects;
      saveToStorage(STORAGE_KEYS.PROJECTS, storedProjects);
    }
    return storedProjects as Project[];
  }
};

export const fetchExperience = async (): Promise<Experience[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/experience`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    await delay(200);
    return RESUME_DATA.experience;
  }
};

export const fetchSkills = async (): Promise<SkillCategory[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    await delay(200);
    return RESUME_DATA.skills;
  }
};

// --- VISITOR ANALYTICS ---

export const fetchVisitorCount = async (): Promise<number> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500); // Fast timeout for polling
    const response = await fetch(`${API_BASE_URL}/visitors`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.count;
  } catch (error) {
    // Fallback: Read from LocalStorage directly (supports polling in preview mode)
    return getFromStorage(STORAGE_KEYS.VISITORS, 1025);
  }
};

export const incrementVisitorCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/visitors`, { method: 'POST' });
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.count;
  } catch (error) {
    // Fallback
    const current = getFromStorage(STORAGE_KEYS.VISITORS, 1025);
    const newVal = current + 1;
    saveToStorage(STORAGE_KEYS.VISITORS, newVal);
    return newVal;
  }
};

// --- CONTACT FORM ---

export const submitContactForm = async (data: { name: string; email: string; message: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  } catch (error) {
    console.warn("Backend API unreachable for contact form. Simulating success.");
    await delay(1000);
    return { success: true, message: "Message sent (simulated)! Backend not detected." };
  }
};

// --- ADMIN & CRUD ---

export const loginAdmin = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    await delay(800);
    // Hardcoded fallback logic
    return password === 'admin123';
  }
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create');
    const data = await response.json();
    return data.project;
  } catch (error) {
    // Fallback
    const newProject = { id: Date.now().toString(), ...project };
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, RESUME_DATA.projects) as Project[];
    const updated = [newProject, ...projects];
    saveToStorage(STORAGE_KEYS.PROJECTS, updated);
    await delay(500);
    return newProject as Project;
  }
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update');
    const data = await response.json();
    return data.project;
  } catch (error) {
    // Fallback
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, RESUME_DATA.projects) as Project[];
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Project not found");
    
    const updatedProject = { ...projects[index], ...updates };
    projects[index] = updatedProject;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    await delay(500);
    return updatedProject;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    // Fallback
    const projects = getFromStorage(STORAGE_KEYS.PROJECTS, RESUME_DATA.projects) as Project[];
    const filtered = projects.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PROJECTS, filtered);
    await delay(500);
    return true;
  }
};