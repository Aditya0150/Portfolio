import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { fetchSkills } from '../services/mockBackend';
import { SkillCategory } from '../types';

const Skills: React.FC = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills().then(data => {
      setSkillCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="skills" className="py-20 bg-white dark:bg-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Technical Arsenal</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Tools and technologies I use to bring ideas to life.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 h-64 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((category) => (
              <div key={category.name} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill} className="flex items-center group">
                      <CheckCircle2 size={18} className="text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;