import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import VideoSection from './components/VideoSection';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './components/AdminDashboard';
import { Users, Shield, Radio } from 'lucide-react';
import { incrementVisitorCount, fetchVisitorCount } from './services/mockBackend';

type ViewMode = 'home' | 'admin';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<ViewMode>('home');
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Theme Init
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // 1. Increment on Initial Load
    incrementVisitorCount().then(count => setVisitorCount(count));

    // 2. Poll for Real-Time Updates (Every 5 seconds)
    // This allows the counter to update if other users visit the site
    const intervalId = setInterval(() => {
      fetchVisitorCount().then(count => setVisitorCount(count));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Theme Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Render Logic
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <AdminDashboard onLogout={() => setView('home')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main>
        <Hero />
        <About />
        {/* Projects will automatically remount when switching back from Admin view, triggering a fetch. 
            No explicit key is needed here, preventing flicker during visitor polling. */}
        <Projects />
        <Skills />
        <VideoSection />
        <Contact />
      </main>

      <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            © {new Date().getFullYear()} Aditya Pratap Singh Negi.
          </p>

          <div className="flex justify-center items-center gap-6 text-sm">
            {/* Live Visitor Counter */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">{visitorCount.toLocaleString()}</span>
              <span>Live Visits</span>
            </div>

            {/* Admin Link */}
            <button
              onClick={() => setView('admin')}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}

export default App;