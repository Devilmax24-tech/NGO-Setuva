'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl w-full text-center mb-12 sm:mb-16">
          <div className="inline-block mb-5 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold">
            Empowering Communities Together
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Help Your Community <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Thrive</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-700 mb-8 sm:mb-10 leading-relaxed font-medium px-2 sm:px-0">
            Report issues, track progress, and connect with dedicated volunteers ready to make a real difference in your community
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center flex-wrap">
            <Link 
              href="/query/new" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-center"
            >
              Report Now
            </Link>
            <Link 
              href="/report/track" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-center"
            >
              Track Report
            </Link>
          </div>
        </div>

        {/* Main Services Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 px-0 sm:px-2">
          <Link 
            href="/query/new" 
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border border-blue-200 rounded-3xl hover:border-blue-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-200/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-5xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">📝</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 relative z-10">Report Issue</h3>
            <p className="text-sm sm:text-base text-blue-700 mt-3 font-semibold relative z-10 text-center">Describe your problem instantly</p>
          </Link>

          <Link 
            href="/report/track" 
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 bg-gradient-to-br from-green-50 via-green-50 to-green-100 border border-green-200 rounded-3xl hover:border-green-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-200/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-5xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">📊</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-900 relative z-10">Track Progress</h3>
            <p className="text-sm sm:text-base text-green-700 mt-3 font-semibold relative z-10 text-center">Check status in real-time</p>
          </Link>

          <Link 
            href="/whatsapp" 
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 border border-emerald-200 rounded-3xl hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-200/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-5xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">💬</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-900 relative z-10">WhatsApp Chat</h3>
            <p className="text-sm sm:text-base text-emerald-700 mt-3 font-semibold relative z-10 text-center">Connect instantly</p>
          </Link>

          <Link 
            href="/volunteer" 
            className="group relative flex flex-col items-center justify-center p-7 sm:p-10 bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 border border-purple-200 rounded-3xl hover:border-purple-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-200/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-5xl sm:text-7xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">🤝</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 relative z-10">Join Volunteers</h3>
            <p className="text-sm sm:text-base text-purple-700 mt-3 font-semibold relative z-10 text-center">Make real impact</p>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
