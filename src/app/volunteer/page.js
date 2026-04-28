"use client";

import { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, CheckCircle2, AlertTriangle, ShieldCheck, Award, BarChart3, Users, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VolunteerPortal() {
  const [data, setData] = useState({ volunteers: [], tasks: [], reports: [] });
  const [activeTask, setActiveTask] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [volTab, setVolTab] = useState('profile'); // 'profile', 'tasks', 'stats'
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', skills: [], area: ''
  });

  const myVolunteerId = 'v2'; // Priya Sharma

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const db = await res.json();
      setData(db);
      
      const task = db.tasks.find(t => t.volunteer_id === myVolunteerId && t.status === 'In Progress');
      setActiveTask(task || null);

      if (task) {
        setActiveReport(db.reports.find(r => r.id === task.report_id));
      } else {
        setActiveReport(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const int = setInterval(fetchData, 5000);
    return () => clearInterval(int);
  }, []);

  const me = data.volunteers.find(v => v.id === myVolunteerId);

  const handleRegisterVolunteer = (e) => {
    e.preventDefault();
    // Store registration and show profile
    setRegistered(true);
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  if (!registered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold hover:gap-3 transition-all mb-10">
            <ArrowLeft size={20} /> Back to Home
          </Link>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-md">
                <Heart size={32} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Join Our Volunteers</h1>
                <p className="text-gray-600 font-medium mt-2">Help communities and make a real difference</p>
              </div>
            </div>

            <form onSubmit={handleRegisterVolunteer} className="space-y-8">
              {/* Personal Info */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <h2 className="text-xl font-bold text-blue-900 mb-8 flex items-center gap-2">
                  👤 Your Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
                <h2 className="text-xl font-bold text-purple-900 mb-8 flex items-center gap-2">
                  ⭐ Your Skills
                </h2>
                <p className="text-purple-800 font-semibold mb-6">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Medical', 'Food Supply', 'Education', 'Construction', 'Communication', 'Transportation'].map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`p-4 border-2 rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2 ${
                        formData.skills.includes(skill)
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600 shadow-lg scale-105'
                          : 'bg-white text-purple-900 border-purple-300 hover:border-purple-500 hover:shadow-md'
                      }`}
                    >
                      {formData.skills.includes(skill) ? '✓' : '+'} {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <h2 className="text-xl font-bold text-green-900 mb-8 flex items-center gap-2">
                  📍 Service Area
                </h2>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="e.g., Sector 18, Downtown Delhi"
                  className="w-full px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-medium text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!formData.name || !formData.phone || formData.skills.length === 0 || !formData.area}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                <Heart size={22} />
                Register as Volunteer
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 bg-green-600 text-white">
          <h2 className="text-xl font-bold mb-1">Hello, {formData.name} 👋</h2>
          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
             <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
             Available
          </div>
        </div>

        <div className="p-6 border-b space-y-4">
          <button
            onClick={() => setVolTab('profile')}
            className={`w-full text-left px-4 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              volTab === 'profile' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck size={18} /> Profile
          </button>
          <button
            onClick={() => setVolTab('tasks')}
            className={`w-full text-left px-4 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              volTab === 'tasks' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CheckCircle2 size={18} /> My Tasks
          </button>
          <button
            onClick={() => setVolTab('stats')}
            className={`w-full text-left px-4 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              volTab === 'stats' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={18} /> Statistics
          </button>
        </div>

        {/* Stats Summary */}
        <div className="p-6 flex-1">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">People Helped</p>
              <p className="text-2xl font-bold text-green-600 mt-1">85</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600">Reliability Score</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">96%</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-xs">
            <Award size={16} />
            <span className="font-semibold">Gold Volunteer Badge</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-12">
        {volTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Volunteer Profile</h2>
            <div className="max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Name</h3>
                <p className="text-2xl font-bold text-gray-900">{formData.name}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone</h3>
                  <p className="text-lg text-gray-700">{formData.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Service Area</h3>
                  <p className="text-lg text-gray-700 flex items-center gap-2"><MapPin size={18} /> {formData.area}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {volTab === 'tasks' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Active Mission</h2>
            {activeTask && activeReport ? (
              <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                 <div className="h-2 w-full bg-red-600"></div>
                 <div className="p-8">
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase mb-3">Urgent Priority</span>
                       <h1 className="text-2xl font-bold text-gray-900">{activeReport.need_type} Needed</h1>
                       <p className="text-gray-600 mt-2 flex items-center gap-2"><MapPin size={16}/> {activeReport.location_text}</p>
                     </div>
                   </div>

                   <div className="bg-gray-50 p-4 rounded-xl border mb-6 flex items-start gap-3">
                     <span className="text-2xl">📝</span>
                     <p className="text-gray-700 font-medium">{activeReport.message_raw}</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="p-4 border rounded-lg bg-white text-center">
                       <div className="text-3xl font-bold text-gray-800">{activeReport.people_count}</div>
                       <div className="text-xs text-gray-500 font-semibold mt-1">People Affected</div>
                     </div>
                     <a 
                       href={`https://www.google.com/maps/dir/?api=1&destination=${activeReport.lat},${activeReport.lng}`} 
                       target="_blank" 
                       rel="noreferrer"
                       className="p-4 border rounded-lg bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
                     >
                       <Navigation size={24} className="text-blue-600 mb-1"/>
                       <div className="text-xs text-blue-600 font-bold">Get Directions</div>
                     </a>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                       className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2" 
                       onClick={async () => {
                         await fetch('/api/data', {
                           method: 'PUT',
                           body: JSON.stringify({ taskId: activeTask.id, action: 'complete' }),
                           headers: { 'Content-Type': 'application/json' }
                         });
                         alert("Task Marked Complete!");
                         fetchData();
                       }}
                     >
                       <CheckCircle2 size={20}/> Mark Complete
                     </button>
                     <button 
                       className="sm:w-1/3 bg-white border-2 border-gray-300 text-gray-600 font-bold py-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2" 
                       onClick={async () => {
                         await fetch('/api/data', {
                           method: 'PUT', body: JSON.stringify({ taskId: activeTask.id, action: 'escalate' }),
                           headers: { 'Content-Type': 'application/json' }
                         });
                         alert("Issue escalated to admin.");
                         fetchData();
                       }}
                     >
                       <AlertTriangle size={18}/> Report Issue
                     </button>
                   </div>
                 </div>
              </div>
            ) : (
              <div className="max-w-2xl bg-white border-2 border-dashed rounded-2xl p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">No active tasks right now!</h3>
                <p>You will be notified via WhatsApp when a task matching your skills is available.</p>
              </div>
            )}
          </div>
        )}

        {volTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Statistics</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Tasks Completed</h3>
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">12</p>
                <p className="text-sm text-gray-600">Completed this year</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">People Helped</h3>
                  <Users size={28} className="text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">85</p>
                <p className="text-sm text-gray-600">Total lives touched</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Reliability</h3>
                  <Award size={28} className="text-yellow-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">96%</p>
                <p className="text-sm text-gray-600">Task completion rate</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Hours Served</h3>
                  <Clock size={28} className="text-purple-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">128</p>
                <p className="text-sm text-gray-600">Total volunteer hours</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
