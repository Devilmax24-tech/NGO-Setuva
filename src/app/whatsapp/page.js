'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WhatsAppDashboard() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReport, setLastReport] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    
    // Create previews
    const previews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              type: 'image',
              src: event.target.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });
      } else {
        return Promise.resolve({
          type: 'file',
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB'
        });
      }
    });
    
    Promise.all(previews).then(setFilePreviews);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    setIsProcessing(true);

    const userMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      files: filePreviews
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData: newMessage,
          hasImage: false,
          source: 'WhatsApp'
        })
      });

      const data = await res.json();

      if (data.report) {
        setLastReport(data.report);
        const urgencyColor = {
          'High': 'bg-red-50 border-red-300',
          'Medium': 'bg-yellow-50 border-yellow-300',
          'Low': 'bg-green-50 border-green-300'
        }[data.report.urgency] || 'bg-blue-50 border-blue-300';
        
        const urgencyBadge = {
          'High': '🔴 High',
          'Medium': '🟡 Medium',
          'Low': '🟢 Low'
        }[data.report.urgency] || '⚪ Unknown';
        
        const typeIcon = {
          'Food': '🍲',
          'Medical': '🏥',
          'Education': '📚',
          'Shelter': '🏠',
          'Safety': '🚨'
        }[data.report.need_type] || '📋';

        const botMsg = {
          id: Date.now() + 1,
          text: `✅ Report created successfully!`,
          sender: 'bot',
          isReport: true,
          report: {
            id: data.report.id,
            type: data.report.need_type,
            location: data.report.location_text,
            urgency: data.report.urgency,
            people: data.report.people_count,
            volunteer: data.autoMatchedVol?.name || null,
            typeIcon,
            urgencyBadge,
            urgencyColor
          },
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 2,
        text: 'Error processing message. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }

    setNewMessage('');
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsProcessing(false);
  };

  return (
    <>
      <Header />
      <div className="flex h-screen flex-col md:min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold hover:gap-3 transition-all text-sm sm:text-base">
          <ArrowLeft size={20} /> Back
        </Link>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">💬 Report via WhatsApp</h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">Describe your issue and Gemini AI will process it instantly</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow flex flex-col min-h-0">
          {/* Chat Messages */}
          <div className="flex-1 space-y-4 p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-white to-slate-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-6xl mb-4 opacity-50">💬</div>
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-2 text-center px-4">Describe any issue → Gemini extracts: location, type, urgency, people count → Auto-creates report → Matches volunteer</p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.isReport ? (
                  <div className={`w-full max-w-sm rounded-xl border-2 ${msg.report.urgencyColor} p-4 shadow-sm space-y-3`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{msg.report.typeIcon} {msg.report.type}</span>
                        <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-white">{msg.report.urgencyBadge}</span>
                      </div>
                      <p className="text-sm text-gray-600">{msg.text}</p>
                    </div>
                    {msg.files && msg.files.length > 0 && (
                      <div className="pt-2 border-t border-current border-opacity-20 space-y-2">
                        {msg.files.map((file, idx) => (
                          <div key={idx} className="bg-white bg-opacity-70 rounded p-2">
                            {file.type === 'image' ? (
                              <img src={file.src} alt={file.name} className="w-full h-auto rounded max-h-40 object-cover" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <ImageIcon size={16} className="text-gray-600" />
                                <span className="text-xs text-gray-700 font-semibold">{file.name} ({file.size})</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-current border-opacity-20">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">📍 Location</p>
                        <p className="text-sm font-bold text-gray-900">{msg.report.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">👥 People</p>
                        <p className="text-sm font-bold text-gray-900">{msg.report.people}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-current border-opacity-20">
                      <p className="text-xs text-gray-600 font-semibold">🔖 Report ID</p>
                      <p className="text-xs font-mono font-bold text-gray-900">{msg.report.id}</p>
                    </div>
                    {msg.report.volunteer && (
                      <div className="pt-2 border-t border-green-400 bg-green-100 bg-opacity-50 rounded p-2">
                        <p className="text-xs text-green-900 font-semibold">✅ Assigned to</p>
                        <p className="text-sm font-bold text-green-900">{msg.report.volunteer}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`max-w-xs sm:max-w-sm rounded-xl shadow-sm space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none px-4 sm:px-6 py-3'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200 px-4 sm:px-6 py-3'
                    }`}
                  >
                    {msg.text && <p className="text-sm sm:text-base leading-relaxed font-medium">{msg.text}</p>}
                    {msg.files && msg.files.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-current border-opacity-30">
                        {msg.files.map((file, idx) => (
                          <div key={idx} className={`rounded p-2 ${msg.sender === 'user' ? 'bg-blue-700 bg-opacity-70' : 'bg-gray-200'}`}>
                            {file.type === 'image' ? (
                              <img src={file.src} alt={file.name} className="w-full h-auto rounded max-h-40 object-cover" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <ImageIcon size={14} className={msg.sender === 'user' ? 'text-blue-100' : 'text-gray-600'} />
                                <span className={`text-xs font-semibold ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-700'}`}>{file.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white p-4 sm:p-6 space-y-3">
            {/* File Previews */}
            {filePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 border-b border-gray-200">
                {filePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    {preview.type === 'image' ? (
                      <img src={preview.src} alt={preview.name} className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                        <div className="text-center">
                          <ImageIcon size={24} className="text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600 truncate px-1">{preview.name}</p>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input & File Upload */}
            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Describe the issue..."
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base font-medium"
                disabled={isProcessing}
              />
              
              <label className="flex-shrink-0">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-sm border border-gray-300"
                  disabled={isProcessing}
                >
                  <Upload size={18} />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </label>
              
              <button
                type="submit"
                disabled={isProcessing || (!newMessage.trim() && selectedFiles.length === 0)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold whitespace-nowrap text-sm sm:text-base"
              >
                <Send size={18} />
                {isProcessing ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 border border-blue-300 rounded-xl sm:rounded-2xl">
          <p className="text-sm text-blue-900 font-bold leading-relaxed">
            <strong className="block mb-2">✨ How Gemini AI Works Here:</strong>
            Send a message → AI analyzes with Gemini → Extracts location, issue type, urgency, people count → Creates report automatically → Matches nearest available volunteer → Get Report ID to track progress
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
