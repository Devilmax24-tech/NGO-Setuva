'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TrackReport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('reportId'); // reportId or phone
  const [report, setReport] = useState(null);
  const [task, setTask] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [allData, setAllData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setAllData(data);
      return data;
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !allData) return;

    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setReport(null);
    setTask(null);
    setVolunteer(null);

    try {
      let foundReport = null;

      if (searchType === 'reportId') {
        // Search by report ID
        foundReport = allData.reports.find(r => r.id === searchQuery.trim() || r.id.includes(searchQuery.trim()));
      } else {
        // Search by phone number - check in reports or tasks
        foundReport = allData.reports.find(r => r.phone_number === searchQuery.trim());
      }

      if (foundReport) {
        setReport(foundReport);

        // Find associated task
        const foundTask = allData.tasks.find(t => t.report_id === foundReport.id);
        setTask(foundTask || null);

        // Find assigned volunteer
        if (foundTask) {
          const foundVolunteer = allData.volunteers.find(v => v.id === foundTask.volunteer_id);
          setVolunteer(foundVolunteer || null);
        }
      } else {
        setNotFound(true);
        setReport(null);
      }
    } catch (err) {
      console.error('Search error:', err);
      setNotFound(true);
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 hover:gap-3 transition-all">
          <ArrowLeft size={20} /> Back Home
        </Link>

        {/* Main Search */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Track Your Report</h1>
          <p className="text-lg text-gray-600 font-medium">Find your report using ID or phone number</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6 mb-12">
          {/* Tabs */}
          <div className="flex gap-4 border-b-2 border-gray-200 mb-8">
            <button
              type="button"
              onClick={() => setSearchType('reportId')}
              className={`px-6 py-3 font-bold text-lg border-b-3 transition-all ${
                searchType === 'reportId'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Report ID
            </button>
            <button
              type="button"
              onClick={() => setSearchType('phone')}
              className={`px-6 py-3 font-bold text-lg border-b-3 transition-all ${
                searchType === 'phone'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📱 Phone Number
            </button>
          </div>

          {/* Input & Button */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'reportId' ? 'e.g., r1704123456' : 'e.g., 9876543210'}
              className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-lg font-medium"
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search size={20} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <>
            {notFound ? (
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-2xl p-12 text-center shadow-md">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-red-900 mb-2">Report Not Found</h2>
                <p className="text-red-800 mb-8 text-lg">No report found with this {searchType === 'reportId' ? 'ID' : 'phone number'}</p>
                <button onClick={() => { setSearched(false); setSearchQuery(''); }} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
                  Try Again
                </button>
              </div>
            ) : report ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Report ID</p>
                      <p className="text-2xl font-bold text-blue-600 font-mono mt-2">{report.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Current Status</p>
                      <p className={`text-2xl font-bold mt-2 ${
                        report.status === 'assigned' ? 'text-blue-600' :
                        report.status === 'completed' ? 'text-green-600' :
                        'text-amber-600'
                      }`}>
                        {report.status === 'pending' ? '⏳ Under Review' :
                         report.status === 'assigned' ? '🎯 Assigned' :
                         '✅ Completed'}
                      </p>
                    </div>
                  </div>

                  <hr className="my-6 bg-gray-200" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-700 font-bold uppercase tracking-wide mb-2">Issue Type</p>
                      <p className="text-xl font-bold text-blue-900">{report.need_type}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-green-700 font-bold uppercase tracking-wide mb-2">Urgency</p>
                      <span className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${
                        report.urgency === 'High' ? 'bg-red-200 text-red-800' :
                        report.urgency === 'Medium' ? 'bg-amber-200 text-amber-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {report.urgency}
                      </span>
                    </div>
                    <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl">
                      <p className="text-sm text-purple-700 font-bold uppercase tracking-wide mb-2">📍 Location</p>
                      <p className="text-lg font-bold text-purple-900">{report.location_text}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-md">
                  <p className="text-sm text-gray-600 font-bold uppercase tracking-wide mb-4">Your Report Details</p>
                  <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-600">
                    <p className="text-gray-800 leading-relaxed text-lg">{report.message_raw}</p>
                  </div>
                </div>

                {/* Volunteer Info */}
                {volunteer && task ? (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-2xl p-8 shadow-md">
                    <p className="text-sm text-blue-700 font-bold uppercase tracking-wide mb-3">✨ Assigned Volunteer</p>
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">{volunteer.name}</h3>
                    <div className="space-y-2">
                      <p className="text-lg text-blue-800 font-semibold">📞 {volunteer.phone}</p>
                      <p className="text-lg text-blue-800 font-semibold">🎯 {volunteer.skills.join(', ')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 rounded-2xl p-8 text-center shadow-md shadow-amber-200">
                    <p className="text-amber-900 font-bold text-lg">⏳ Searching for available volunteer...</p>
                  </div>
                )}

                {/* Progress Timeline */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-md">
                  <p className="text-sm text-gray-600 font-bold uppercase tracking-wide mb-6">Progress Timeline</p>
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md">✓</div>
                      <div className="flex-1 pt-1">
                        <p className="font-bold text-gray-900 text-lg">Report Received</p>
                        <p className="text-sm text-gray-600 mt-1">{new Date(report.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${report.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {report.status !== 'pending' ? '✓' : '2'}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-bold text-gray-900 text-lg">Under Review</p>
                        <p className="text-sm text-gray-600 mt-1">{report.status !== 'pending' ? '✓ Reviewed' : '⏳ In Progress'}</p>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${task ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {task ? '✓' : '3'}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-bold text-gray-900 text-lg">Volunteer Assigned</p>
                        <p className="text-sm text-gray-600 mt-1">{task ? '✓ Assigned' : '⏳ Waiting'}</p>
                      </div>
                    </div>
                    {/* Step 4 */}
                    <div className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${report.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {report.status === 'completed' ? '✓' : '4'}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-bold text-gray-900 text-lg">Completed</p>
                        <p className="text-sm text-gray-600 mt-1">{report.status === 'completed' ? '✓ Done' : '⏳ In Progress'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
