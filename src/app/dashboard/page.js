"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Layers, ListChecks, Users, BarChart3, Settings, Bell, CheckCircle, XCircle, LogOut, AlertCircle, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

// Dynamically import Map to prevent Next.js SSR window errors
const MapUI = dynamic(() => import('@/components/MapUI'), { ssr: false, loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map Engine...</div> });

export default function Dashboard() {
  const [data, setData] = useState({ reports: [], volunteers: [], tasks: [] });
  const [activeTab, setActiveTab] = useState('heatmap');
  const [locationFilter, setLocationFilter] = useState('All');
  const [isAuthed, setIsAuthed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const db = await res.json();
      setData(db);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Check admin auth
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAuthed(false);
      window.location.href = '/auth/login';
      return;
    }
    
    setIsAuthed(true);
    setIsLoading(false);
    fetchData();
    // Auto refresh every 5 seconds to get new WhatsApp reports
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    window.location.href = '/auth/login';
  };

  const pendingApprovals = data.tasks.filter(t => !t.admin_approved).length;
  const criticalIssues = data.reports.filter(r => r.urgency === 'High').length;
  const totalReports = data.reports.length;
  const resolvedIssues = data.tasks.filter(t => t.status === 'Completed').length;
  
  // Location-based analytics
  const locations = [...new Set(data.reports.map(r => r.location_text))];
  const getReportsByLocation = (loc) => data.reports.filter(r => r.location_text === loc).length;
  const getIssueTypeCount = (type) => data.reports.filter(r => r.need_type === type).length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-gray-600 text-lg">Loading...</div></div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-blue-700 via-blue-700 to-blue-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 border-b border-blue-600/50 backdrop-blur-sm">
          <div className="font-bold text-3xl tracking-tight flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-md mr-1">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span>Setuva</span>
          </div>
          <p className="text-blue-200 text-sm font-medium">Admin Control Panel v1.0</p>
        </div>
        
        <div className="flex-1 px-4 space-y-2 mt-8">
          <button onClick={() => setActiveTab('heatmap')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 font-semibold ${activeTab === 'heatmap' ? 'bg-white/25 border-l-4 border-white shadow-lg' : 'hover:bg-white/10'}`}>
            <Layers size={22} /> Live Heatmap
          </button>
          <button onClick={() => setActiveTab('tasks')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 font-semibold ${activeTab === 'tasks' ? 'bg-white/25 border-l-4 border-white shadow-lg' : 'hover:bg-white/10'}`}>
            <ListChecks size={22} /> Active Tasks
          </button>
          <button onClick={() => setActiveTab('vols')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 font-semibold ${activeTab === 'vols' ? 'bg-white/25 border-l-4 border-white shadow-lg' : 'hover:bg-white/10'}`}>
            <Users size={22} /> Volunteers
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 font-semibold ${activeTab === 'analytics' ? 'bg-white/25 border-l-4 border-white shadow-lg' : 'hover:bg-white/10'}`}>
            <BarChart3 size={22} /> Analytics
          </button>
          <button onClick={() => setActiveTab('locations')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 font-semibold ${activeTab === 'locations' ? 'bg-white/25 border-l-4 border-white shadow-lg' : 'hover:bg-white/10'}`}>
            <MapPin size={22} /> Locations
          </button>
          <button onClick={() => setActiveTab('whatsapp')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 font-semibold ${activeTab === 'whatsapp' ? 'bg-white/25 border-l-4 border-white shadow-lg' : 'hover:bg-white/10'}`}>
            <Bell size={22} /> WhatsApp Reports
          </button>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-t border-blue-600/50 space-y-3">
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Active Tasks</p>
            <p className="text-3xl font-bold text-white mt-2">{data.tasks.filter(t => t.status === 'In Progress').length}</p>
          </div>
          <div className="p-4 bg-red-500/20 rounded-xl backdrop-blur-sm border border-red-400/30">
            <p className="text-red-200 text-xs font-bold uppercase tracking-wider">🔴 Critical Issues</p>
            <p className="text-3xl font-bold text-red-100 mt-2">{criticalIssues}</p>
          </div>
        </div>

        <div className="p-4 border-t border-blue-600/50 space-y-2">
           <button className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold text-blue-100">
             <Settings size={20} /> Settings
           </button>
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 font-semibold text-red-100">
             <LogOut size={20} /> Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white h-16 shadow-md flex justify-between items-center px-8 z-10 border-b">
           <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab === 'heatmap' ? '📍 Live Heatmap' : activeTab === 'tasks' ? '✅ Active Tasks' : activeTab === 'vols' ? '👥 Volunteer Network' : activeTab === 'locations' ? '🗺️ Location Analytics' : activeTab === 'whatsapp' ? '💬 WhatsApp Reports' : '📊 Analytics'}</h2>
           <div className="flex items-center gap-6">
              <div className="relative cursor-pointer group">
                <Bell size={20} className="text-gray-600" />
                {pendingApprovals > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">{pendingApprovals}</span>}
                <div className="absolute right-0 top-8 bg-gray-900 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {pendingApprovals} approval(s) pending
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">AD</div>
                <span className="text-sm font-semibold text-gray-700">Admin</span>
              </div>
           </div>
        </div>

        {/* Dynamic Panel */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          
          {activeTab === 'heatmap' && (
            <div className="flex flex-col gap-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                 <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                   <div className="text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                     <AlertCircle size={16} className="text-red-500" /> Critical Zones
                   </div>
                   <div className="text-3xl font-bold text-red-600">{criticalIssues}</div>
                   <p className="text-xs text-gray-500 mt-1">High priority issues</p>
                 </div>
                 
                 <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                   <div className="text-gray-600 text-sm font-medium mb-2">Total Reports</div>
                   <div className="text-3xl font-bold text-blue-600">{totalReports}</div>
                   <p className="text-xs text-gray-500 mt-1">All time reports</p>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                   <div className="text-gray-600 text-sm font-medium mb-2">Resolved</div>
                   <div className="text-3xl font-bold text-green-600">{resolvedIssues}</div>
                   <p className="text-xs text-gray-500 mt-1">Completed tasks</p>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-violet-500">
                   <div className="text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                     <Zap size={16} className="text-violet-500" /> Volunteers Active
                   </div>
                   <div className="text-3xl font-bold text-violet-600">{data.volunteers.filter(v => v.availability === 'On Task').length}</div>
                   <p className="text-xs text-gray-500 mt-1">On task now</p>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                   <div className="text-gray-600 text-sm font-medium mb-2">Pending</div>
                   <div className="text-3xl font-bold text-yellow-600">{pendingApprovals}</div>
                   <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                 </div>
               </div>
               
               <div className="bg-white p-6 rounded-xl shadow-md border">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Live Location Map</h3>
                 <MapUI reports={data.reports} volunteers={data.volunteers} tasks={data.tasks} />
               </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-100 text-gray-700 text-sm border-b font-semibold">
                     <th className="py-4 px-6">Task ID</th>
                     <th className="py-4 px-6">Location</th>
                     <th className="py-4 px-6">Issue Type</th>
                     <th className="py-4 px-6">Assigned To</th>
                     <th className="py-4 px-6">Status</th>
                     <th className="py-4 px-6">Urgency</th>
                     <th className="py-4 px-6">Action</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm">
                   {data.tasks.map(task => {
                     const report = data.reports.find(r => r.id === task.report_id);
                     const vol = data.volunteers.find(v => v.id === task.volunteer_id);
                     return (
                       <tr key={task.id} className="border-b hover:bg-gray-50 transition">
                         <td className="py-4 px-6 font-mono text-xs text-gray-500">{task.id.substring(0, 8)}</td>
                         <td className="py-4 px-6 font-medium text-gray-900">{report?.location_text}</td>
                         <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{report?.need_type}</span>
                         </td>
                         <td className="py-4 px-6 text-gray-700">{vol?.name || <span className="text-gray-400">Unassigned</span>}</td>
                         <td className="py-4 px-6">
                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                             task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                             task.status === 'Escalated' ? 'bg-red-100 text-red-700' :
                             'bg-yellow-100 text-yellow-700'
                           }`}>
                             {task.status}
                           </span>
                         </td>
                         <td className="py-4 px-6">
                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                             report?.urgency === 'High' ? 'bg-red-100 text-red-700' :
                             report?.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-green-100 text-green-700'
                           }`}>
                             {report?.urgency}
                           </span>
                         </td>
                         <td className="py-4 px-6">
                           {!task.admin_approved && (
                             <div className="flex gap-2">
                               <button className="p-1 text-green-600 hover:bg-green-100 rounded transition" title="Approve">
                                 <CheckCircle size={18}/>
                               </button>
                               <button className="p-1 text-red-600 hover:bg-red-100 rounded transition" title="Reject">
                                 <XCircle size={18}/>
                               </button>
                             </div>
                           )}
                         </td>
                       </tr>
                     )
                   })}
                   {data.tasks.length === 0 && <tr><td colSpan="7" className="py-12 text-center text-gray-500">No active tasks</td></tr>}
                 </tbody>
               </table>
            </div>
          )}

          {activeTab === 'vols' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {data.volunteers.map(vol => (
                 <div key={vol.id} className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="font-bold text-lg text-gray-900">{vol.name}</h3>
                         <p className="text-gray-500 text-sm mt-1">📱 {vol.phone}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         vol.availability === 'Available' ? 'bg-green-100 text-green-700' : 
                         vol.availability === 'On Task' ? 'bg-blue-100 text-blue-700' : 
                         'bg-gray-100 text-gray-600'
                       }`}>
                         {vol.availability}
                       </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-semibold mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {vol.skills.map(s => <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{s}</span>)}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reliability</span>
                        <span className="font-bold text-blue-600">{vol.reliability_score}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{width: `${vol.reliability_score}%`}}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-3">
                        <span>Tasks: {vol.tasks_this_week}</span>
                        <span>Fatigue: {vol.tasks_this_week > 5 ? '🔴 High' : vol.tasks_this_week > 2 ? '🟡 Medium' : '🟢 Low'}</span>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {locations.slice(0, 6).map(loc => (
                  <div key={loc} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600" />{loc}
                    </h3>
                    <div>
                      <p className="text-3xl font-bold text-blue-600 mb-2">{getReportsByLocation(loc)}</p>
                      <p className="text-sm text-gray-600">Total reports</p>
                    </div>
                    <div className="mt-4 pt-4 border-t space-y-1 text-xs text-gray-600">
                      <div>Food: {data.reports.filter(r => r.location_text === loc && r.need_type === 'Food').length}</div>
                      <div>Medical: {data.reports.filter(r => r.location_text === loc && r.need_type === 'Medical').length}</div>
                      <div>Other: {data.reports.filter(r => r.location_text === loc && r.need_type === 'Other').length}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-6">Issue Type Distribution</h3>
                <div className="space-y-4">
                  {['Medical', 'Food', 'Education', 'Shelter', 'Safety', 'Other'].map(type => {
                    const count = getIssueTypeCount(type);
                    const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-800">{type}</span>
                          <span className="text-sm font-bold text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              type === 'Medical' ? 'bg-red-500' :
                              type === 'Food' ? 'bg-yellow-500' :
                              type === 'Education' ? 'bg-blue-500' :
                              type === 'Shelter' ? 'bg-purple-500' :
                              type === 'Safety' ? 'bg-orange-500' : 'bg-gray-500'
                            }`}
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">Detailed reports coming in next version!</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-4xl font-bold text-blue-600 mb-2">{data.reports.length}</p>
                  <p className="text-gray-700 font-semibold">Total Reports Received</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-4xl font-bold text-green-600 mb-2">{resolvedIssues}</p>
                  <p className="text-gray-700 font-semibold">Issues Resolved</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-4xl font-bold text-purple-600 mb-2">{data.volunteers.length}</p>
                  <p className="text-gray-700 font-semibold">Active Volunteers</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="text-gray-600 text-sm font-medium mb-2">WhatsApp Reports</div>
                  <div className="text-3xl font-bold text-green-600">{data.reports.filter(r => r.source === 'WhatsApp').length}</div>
                  <p className="text-xs text-gray-500 mt-1">Total from WhatsApp</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="text-gray-600 text-sm font-medium mb-2">Pending</div>
                  <div className="text-3xl font-bold text-yellow-600">{data.reports.filter(r => r.source === 'WhatsApp' && r.status === 'pending').length}</div>
                  <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="text-gray-600 text-sm font-medium mb-2">Assigned</div>
                  <div className="text-3xl font-bold text-blue-600">{data.reports.filter(r => r.source === 'WhatsApp' && r.status === 'assigned').length}</div>
                  <p className="text-xs text-gray-500 mt-1">With volunteers</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                  <div className="text-gray-600 text-sm font-medium mb-2">High Priority</div>
                  <div className="text-3xl font-bold text-red-600">{data.reports.filter(r => r.source === 'WhatsApp' && r.urgency === 'High').length}</div>
                  <p className="text-xs text-gray-500 mt-1">Urgent issues</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="font-bold text-lg text-gray-900">📱 WhatsApp Submitted Reports</h3>
                  <p className="text-sm text-gray-600 mt-1">All reports received via WhatsApp messages and the WhatsApp web interface</p>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm border-b font-semibold">
                      <th className="py-4 px-6">Report ID</th>
                      <th className="py-4 px-6">Phone / Source</th>
                      <th className="py-4 px-6">Issue Type</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Received</th>
                      <th className="py-4 px-6">Urgency</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Message</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.reports.filter(r => r.source === 'WhatsApp').map(report => {
                      const timeAgo = Math.floor((Date.now() - report.created_at) / 1000);
                      const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : timeAgo < 3600 ? `${Math.floor(timeAgo/60)}m ago` : `${Math.floor(timeAgo/3600)}h ago`;
                      return (
                        <tr key={report.id} className="border-b hover:bg-gray-50 transition">
                          <td className="py-4 px-6 font-mono text-xs text-gray-500 font-bold">{report.id.substring(0, 10)}</td>
                          <td className="py-4 px-6 text-gray-700">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-mono">{report.phone_number || 'Web'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{report.need_type}</span>
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-900">{report.location_text}</td>
                          <td className="py-4 px-6 text-gray-600 text-xs font-mono">{timeStr}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.urgency === 'High' ? 'bg-red-100 text-red-700' :
                              report.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {report.urgency}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-xs max-w-xs truncate" title={report.message_raw}>{report.message_raw?.substring(0, 30)}...</td>
                        </tr>
                      );
                    })}
                    {data.reports.filter(r => r.source === 'WhatsApp').length === 0 && (
                      <tr><td colSpan="8" className="py-12 text-center text-gray-500">No WhatsApp reports yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
