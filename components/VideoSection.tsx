import React from 'react';
import { Play } from 'lucide-react';

const VideoSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Should You Hire Me?</h2>
        <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
          A quick introduction to my personality, communication style, and passion for technology.
        </p>

        <div className="relative aspect-video bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex items-center justify-center group overflow-hidden">
          <video
            src="/Intro.mp4"
            controls
            className="w-full h-full object-contain rounded-2xl"
            poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="mt-6 text-sm text-gray-400">
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
