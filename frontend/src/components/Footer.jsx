import React from 'react';
import { FaFilm, FaGithub, FaLinkedin, FaDatabase, FaCode } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-netflix-black border-t border-white/5 py-12 px-6 md:px-12 mt-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Brand Information */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center space-x-2.5">
            <FaFilm className="text-netflix-red text-xl" />
            <span className="text-white font-extrabold text-lg tracking-wider uppercase">
              CineMatch
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-xs text-center md:text-left leading-relaxed">
            A premium Machine Learning recommendation engine using cosine similarity distances over vectorized textual tokens.
          </p>
        </div>

        {/* Technical stack info */}
        <div className="flex flex-col items-center md:items-center space-y-2.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5">
            <FaCode className="text-netflix-red" />
            <span>Tech Stack</span>
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {['React 18', 'Vite', 'TailwindCSS', 'Python', 'Scikit-Learn', 'NLTK', 'Pickle'].map((tech) => (
              <span 
                key={tech} 
                className="text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links & Portfolio */}
        <div className="flex flex-col items-center md:items-end space-y-2.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5">
            <FaDatabase className="text-netflix-red" />
            <span>Dataset</span>
          </span>
          <a 
            href="https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-white underline transition-colors"
          >
            TMDB 5000 Movies Dataset
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-4 sm:space-y-0">
        <div>
          &copy; {new Date().getFullYear()} CineMatch Recommender. Built for CS Portfolio & Internships.
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-white transition-colors"><FaGithub size={16} /></a>
          <a href="#" className="hover:text-white transition-colors"><FaLinkedin size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
