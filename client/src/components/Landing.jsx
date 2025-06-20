import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Landing() {
  // Optional: Prevent instant navigation away for a few seconds (e.g., 2.5s)
  const blockNavRef = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      blockNavRef.current = false;
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Helper to block navigation for a short time
  const handleNav = (e) => {
    if (blockNavRef.current) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center space-x-3">
          <span className="bg-white rounded-full p-2 shadow-lg animate-fadeIn">
            <img
              src="/assets/logo.jpg"
              alt="HR Portal Logo"
              className="w-9 h-9 rounded-full object-cover"
              style={{ display: 'block' }}
            />
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg animate-slideInLeft">
            HR Portal
          </span>
        </div>
        <nav className="space-x-6">
          <Link
            to="/login"
            onClick={handleNav}
            className="text-white font-semibold hover:text-indigo-200 transition-all duration-200 text-lg"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={handleNav}
            className="text-white font-semibold hover:text-indigo-200 transition-all duration-200 text-lg"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-10 md:py-0">
        {/* Left: Text */}
        <div className="max-w-xl w-full animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
            <span className="block">Modern <span className="text-yellow-300">HR Management</span></span>
            <span className="block">for Next-Gen Teams</span>
          </h1>
          <p className="text-lg md:text-2xl text-indigo-100 mb-8">
            Streamline recruitment, manage candidates, schedule interviews, and send offer letters—all in one beautiful, intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              onClick={handleNav}
              className="px-8 py-3 bg-yellow-300 text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition-all duration-200 text-lg animate-bounceIn"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              onClick={handleNav}
              className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white hover:bg-white/30 transition-all duration-200 text-lg"
            >
              Demo Login
            </Link>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="mb-12 md:mb-0 md:ml-12 flex-1 flex justify-center animate-fadeInRight">
          <Player
            src="/assets/landingImage.json"
            background="transparent"
            speed={1}
            style={{ width: "350px", height: "350px" }}
            loop
            autoplay
          />
        </div>
      </main>

      {/* Features */}
      <section className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeInUp">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 group">
          <span className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-8 0v4m8 0H5" />
            </svg>
          </span>
          <h3 className="text-xl font-bold text-indigo-700 mb-2">Smart Recruitment</h3>
          <p className="text-gray-700">Post jobs, filter candidates, and track applications with ease.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 group">
          <span className="bg-purple-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3m-8 9v6a4 4 0 004 4h4a4 4 0 004-4v-6" />
            </svg>
          </span>
          <h3 className="text-xl font-bold text-purple-700 mb-2">Interview Scheduler</h3>
          <p className="text-gray-700">Automate interview scheduling and reminders for candidates and panelists.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 group">
          <span className="bg-pink-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h3 className="text-xl font-bold text-pink-700 mb-2">Offer Letters</h3>
          <p className="text-gray-700">Generate and send beautiful, branded offer letters in one click.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-indigo-100 text-sm animate-fadeIn">
        &copy; {new Date().getFullYear()} HR Portal &mdash; Crafted with <span className="text-pink-300">♥</span> for modern teams.
      </footer>

      {/* Animations (TailwindCSS custom classes) */}
      <style>
        {`
        .animate-fadeIn { animation: fadeIn 1.2s both; }
        .animate-fadeInUp { animation: fadeInUp 1.2s both; }
        .animate-fadeInRight { animation: fadeInRight 1.2s both; }
        .animate-slideInLeft { animation: slideInLeft 1.2s both; }
        .animate-bounceIn { animation: bounceIn 1.2s both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(40px);} to { opacity: 1; transform: none; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px);} to { opacity: 1; transform: none; } }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.7);}
          60% { opacity: 1; transform: scale(1.05);}
          80% { transform: scale(0.95);}
          100% { transform: scale(1);}
        }
        `}
      </style>
    </div>
  );
}