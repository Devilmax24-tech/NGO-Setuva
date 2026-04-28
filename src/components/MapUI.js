"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Dynamically import react-leaflet components to prevent SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

export default function MapUI({ reports, volunteers, tasks }) {
  const [liveVolunteers, setLiveVolunteers] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fix default marker icon issues in NextJS
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Live GPS Simulation Hook
  useEffect(() => {
    if (!volunteers || !tasks || !reports) return;

    let currentVols = volunteers.map(v => ({ ...v }));

    const animateInterval = setInterval(() => {
      setLiveVolunteers(prev => {
        let newVols = currentVols;
        if (prev.length > 0) newVols = [ ...prev ]; // Retain smooth positions

        return newVols.map(vol => {
          // Find if volunteer has an active task
          const task = tasks.find(t => t.volunteer_id === vol.id && t.status !== 'Completed');
          if (task) {
            const dest = reports.find(r => r.id === task.report_id);
            if (dest) {
              // Interpolate volunteer location towards destination (Simulating Driving)
              const speed = 0.0005; // speed of moving
              const latDiff = dest.lat - vol.lat;
              const lngDiff = dest.lng - vol.lng;
              
              if (Math.abs(latDiff) > 0.001 || Math.abs(lngDiff) > 0.001) {
                return {
                  ...vol,
                  lat: vol.lat + (latDiff * speed * 20),
                  lng: vol.lng + (lngDiff * speed * 20)
                };
              }
            }
          }
          return vol;
        });
      });
    }, 100);

    return () => clearInterval(animateInterval);
  }, [volunteers, tasks, reports]);

  const getMarkerColor = (priorityScore) => {
    if (priorityScore > 0.75) return 'red'; // Critical
    if (priorityScore > 0.5) return 'orange'; // Urgent
    return 'green'; // Monitored
  };

  const volunteerActiveIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: blue; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px blue, 0 0 20px blue; animation: pulse 1s infinite;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const volunteerIdleIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: gray; width:12px; height:12px; border-radius:50%; border:2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e9edef' }}>
      {!isMounted ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="text-gray-600 font-semibold mb-2">Loading Map Engine...</div>
            <div className="h-2 w-32 bg-gray-300 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      ) : (
        <MapContainer center={[28.6139, 77.2090]} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {/* Draw tracking lines for active tasks */}
          {tasks?.map(task => {
             if (task.status === 'Completed') return null;
             const vol = liveVolunteers.find(v => v.id === task.volunteer_id);
             const rep = reports.find(r => r.id === task.report_id);
             if (!vol || !rep) return null;
             return <Polyline key={`poly-${task.id}`} positions={[[vol.lat, vol.lng], [rep.lat, rep.lng]]} color="blue" dashArray="5, 10"  weight={2} opacity={0.6}/>
          })}
          
          {reports?.map(report => (
            <CircleMarker 
              key={report.id} 
              center={[report.lat, report.lng]} 
              pathOptions={{ 
                 color: getMarkerColor(report.priority_score), 
                 fillColor: getMarkerColor(report.priority_score), 
                 fillOpacity: 0.6 
              }} 
              radius={15}
            >
              <Popup>
                <strong>{report.need_type}</strong><br/>
                Loc: {report.location_text}<br/>
                Priority Score: {report.priority_score.toFixed(2)}<br/>
                Trust Score: {report.trust_score}%
              </Popup>
            </CircleMarker>
          ))}

          {liveVolunteers.map(vol => {
             const isActive = tasks?.some(t => t.volunteer_id === vol.id && t.status !== 'Completed');
             return (
               <Marker key={vol.id} position={[vol.lat, vol.lng]} icon={isActive ? volunteerActiveIcon : volunteerIdleIcon}>
                 <Popup>
                   <strong>🧑‍🤝‍🧑 {vol.name} | Tracking</strong><br/>
                   GPS: {vol.lat.toFixed(4)}, {vol.lng.toFixed(4)}<br/>
                   Status: {isActive ? '🔵 En Route' : vol.availability}
                 </Popup>
               </Marker>
             );
          })}
        </MapContainer>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 0, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 0, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 0, 255, 0); }
        }
      `}</style>
    </div>
  );
}
