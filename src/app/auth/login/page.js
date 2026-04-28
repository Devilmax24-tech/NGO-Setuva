'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo credentials
    const ADMIN_EMAIL = 'admin@setuva.org';
    const ADMIN_PASSWORD = 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store admin token in localStorage
      localStorage.setItem('admin_token', 'admin_' + Date.now());
      localStorage.setItem('admin_email', email);
      router.push('/dashboard');
    } else {
      setError('Invalid email or password. Demo: admin@setuva.org / admin123');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 relative z-10 border border-white/20">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4 inline-block p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">🌉</div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Setuva Admin</h1>
          <p className="text-gray-600 mt-3 font-medium">Secure Admin Access Portal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-700 font-medium">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Demo Info */}
        <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl text-blue-900 space-y-2">
          <p className="font-bold text-sm uppercase tracking-wide">📝 Demo Credentials:</p>
          <div className="space-y-1 bg-white/70 p-3 rounded-lg">
            <p className="font-mono text-sm"><strong>Email:</strong> admin@setuva.org</p>
            <p className="font-mono text-sm"><strong>Password:</strong> admin123</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@setuva.org"
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            <LogIn size={22} />
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">Back to <Link href="/" className="text-blue-600 font-bold hover:underline">Home</Link></p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Back to{' '}
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
