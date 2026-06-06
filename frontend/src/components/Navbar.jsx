import React, { useState } from 'react';
import { FaFilm, FaKey, FaTimes, FaCog } from 'react-icons/fa';

export default function Navbar({ apiKey, setApiKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(tempKey);
    localStorage.setItem('tmdb_api_key', tempKey);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-gradient-to-b from-black/95 to-transparent backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center space-x-3 cursor-pointer">
          <FaFilm className="text-netflix-red text-3xl animate-pulse" />
          <span className="text-netflix-red font-black text-2xl tracking-wider uppercase font-sans">
            CineMatch
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="hidden md:inline text-sm text-gray-300 font-medium hover:text-white transition-colors duration-200 cursor-pointer">
            Home
          </span>
          <span 
            onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden md:inline text-sm text-gray-300 font-medium hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Trending
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-white/10 hover:bg-netflix-red text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/10 hover:border-transparent transition-all duration-300 shadow-md cursor-pointer"
          >
            <FaCog className="animate-spin-slow" />
            <span>TMDB Key</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-netflix-dark border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-fadeIn">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-netflix-red/15 text-netflix-red">
                <FaKey size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">TMDB API Settings</h3>
                <p className="text-xs text-gray-400">Configure key for official movie posters</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  TMDB API Key (v3)
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Enter your 32-character hex key"
                  className="w-full bg-netflix-black border border-white/15 focus:border-netflix-red text-white text-sm px-4 py-3 rounded-lg outline-none transition-colors duration-200"
                />
              </div>

              <div className="text-xs text-gray-400 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-netflix-red font-semibold">Tip:</span> If you don't have a key, you can register for one free at <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-netflix-red">themoviedb.org</a>. When left blank, CineMatch uses dynamic high-fidelity gradient covers as posters!
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-netflix-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-red-900/40 transition-all cursor-pointer"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
