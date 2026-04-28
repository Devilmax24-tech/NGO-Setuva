'use client';

import Link from 'next/link';
import { LogIn, Menu, X } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-blue-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">Setuva</div>
              <p className="text-xs text-gray-600 font-semibold hidden sm:block">Community Service</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/query/new" className="text-gray-700 hover:text-blue-600 font-medium transition">Report</Link>
            <Link href="/report/track" className="text-gray-700 hover:text-blue-600 font-medium transition">Track</Link>
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <LogIn size={18} /> Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md text-sm font-semibold"
            >
              <LogIn size={16} /> Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
