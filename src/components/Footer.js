'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-wide text-white">Setuva</h3>
                <p className="text-sm text-slate-400">Community Service Platform</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-300">
              A simple and professional way to report issues, track progress, and connect with volunteers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Quick Links
            </h4>
            <nav className="mt-4 grid gap-3 text-sm font-medium text-slate-300">
              <Link href="/query/new" className="transition hover:text-white">
                Report an Issue
              </Link>
              <Link href="/report/track" className="transition hover:text-white">
                Track a Report
              </Link>
              <Link href="/volunteer" className="transition hover:text-white">
                Volunteer Portal
              </Link>
              <Link href="/whatsapp" className="transition hover:text-white">
                WhatsApp Support
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Support
            </h4>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Fast help, wherever you are.</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Open the app on Android for a clean, responsive experience built for reporting on the go.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Setuva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
