'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, MapPin, AlertCircle, CheckCircle, ArrowLeft, Copy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewQuery() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    issue_type: 'Other',
    location: '',
    urgency: 'Medium'
  });
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData: `${formData.name} reported: ${formData.message}. Location: ${formData.location}. Issue Type: ${formData.issue_type}. Urgency: ${formData.urgency}. Contact: ${formData.phone}`,
          hasImage: false,
          source: 'Public Query',
          phone_number: formData.phone
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReportId(data.report?.id || 'r' + Date.now());
        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            name: '', phone: '', email: '', message: '', issue_type: 'Other', location: '', urgency: 'Medium'
          });
          setSubmitted(false);
        }, 10000); // Show success for 10 seconds
      }
    } catch (err) {
      console.error('Error submitting query:', err);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success! 🎉</h2>
            <p className="text-lg text-gray-700 mb-8 font-medium">
              Your report has been submitted successfully. Our team will contact you shortly.
            </p>

            {/* Report ID Display */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-2xl p-6 mb-8">
              <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-3">Your Report ID</p>
              <div className="flex items-center gap-3 justify-center mb-4">
                <p className="text-3xl font-bold text-blue-700 font-mono">{reportId}</p>
                <button
                  onClick={copyToClipboard}
                  className="p-3 hover:bg-blue-200 rounded-xl transition shadow-md"
                  title="Copy Report ID"
                >
                  <Copy size={20} className="text-blue-600" />
                </button>
              </div>
              {copied && <p className="text-sm text-green-600 font-bold">✓ Copied to clipboard!</p>}
              <p className="text-xs text-blue-600 mt-4 font-medium">Save this ID to track your report anytime</p>
            </div>

            <div className="space-y-3">
              <Link href="/report/track" className="inline-block w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold transition shadow-md hover:shadow-lg">
                📊 Track My Report
              </Link>
              <Link href="/" className="inline-block w-full px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition shadow-sm">
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-10 hover:gap-3 transition-all">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 mb-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md">
              <AlertCircle size={28} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Report an Issue</h1>
              <p className="text-gray-600 font-medium mt-1">Help us serve your community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                👤 Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <h2 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                🎯 Issue Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">Issue Type *</label>
                  <select
                    name="issue_type"
                    value={formData.issue_type}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-medium"
                  >
                    <option value="Medical">🏥 Medical Emergency</option>
                    <option value="Food">🍲 Food/Supplies Need</option>
                    <option value="Shelter">🏠 Shelter/Housing</option>
                    <option value="Education">📚 Education/Training</option>
                    <option value="Safety">🚨 Safety/Security</option>
                    <option value="Other">📌 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">Urgency Level *</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-medium"
                  >
                    <option value="Low">🟢 Low (Less than 24 hours)</option>
                    <option value="Medium">🟡 Medium (Within 12 hours)</option>
                    <option value="High">🔴 High (Immediate)</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">Location *</label>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-green-600 flex-shrink-0" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your area/location (e.g., Sector 18, Delhi)"
                    className="flex-1 px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">Describe the Issue *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details. Include number of people affected and what help is needed..."
                  rows="6"
                  className="w-full px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all resize-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              <Send size={22} />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
            <p className="text-sm text-purple-900 font-medium leading-relaxed">
              <strong className="block text-purple-950 mb-2">📋 Important Information:</strong>
              Your report will be reviewed quickly and assigned to available volunteers in your area. You'll receive updates via phone. Keep your Report ID safe to track progress anytime.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
