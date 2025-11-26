import React, { useEffect, useState } from 'react';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { fetchExperience } from '../services/mockBackend';
import { Experience, ProfileData } from '../types';
import { RESUME_DATA } from '../constants';

const About: React.FC = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience().then(data => {
      setExperience(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="about" className="py-20 bg-white dark:bg-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A passionate developer bridging the gap between complex backend logic and intuitive frontend design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Timeline / Experience */}
          <div>
            <div className="flex items-center mb-8">
              <Briefcase className="text-blue-600 mr-3" size={24} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h3>
            </div>
            
            <div className="space-y-8 border-l-2 border-gray-200 dark:border-gray-700 ml-3 pl-8 relative">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : (
                experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-dark bg-blue-600"></span>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.role}</h4>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.period}</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                      {exp.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Education & Bio */}
          <div>
            <div className="flex items-center mb-8">
              <GraduationCap className="text-purple-600 mr-3" size={24} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
              {RESUME_DATA.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{edu.institution}</h4>
                  <p className="text-gray-700 dark:text-gray-200">{edu.degree}</p>
                  <p className="text-sm text-gray-500 mt-1">{edu.year}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center mb-4">
              <Code className="text-green-600 mr-3" size={24} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Summary</h3>
            </div>
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
              <p>
                I am a recent Computer Science graduate with a strong foundation in Full Stack Development and AI integration. 
                My journey involves hands-on experience with modern web technologies like React, Node.js, and Java. 
                I thrive in environments where I can innovate, such as my time at ClarityUX where I optimized DesignOps platforms using AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
