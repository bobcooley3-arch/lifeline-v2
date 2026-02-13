"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

function MapController({ center }: { center: [number, number] }) {
  const MapHookLoader = require('react-leaflet').useMap;
  const currentMap = MapHookLoader();
  useEffect(() => { if (currentMap && center) { currentMap.setView(center, 15); } }, [center, currentMap]);
  return null;
}

export default function AdminMap() {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [L, setL] = useState<any>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("Waiting (v6)...");
  const [battery, setBattery] = useState<number | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  async function fetchLocation() {
    setIsPulsing(true);
    try {
      const response = await fetch('/api/pulse');
      const data = await response.json();
      const loc = data.location || data.lastKnownLocation || data;
      if (loc && loc.lat && loc.lng) {
        setPosition([loc.lat, loc.lng]);
        setBattery(data.batteryLevel || data.level || null);
        setLastCheckIn(new Date(data.lastCheckIn || data.timestamp || Date.now()).toLocaleTimeString());
      }
    } catch (error) { console.error("Map fetch error:", error); }
    setTimeout(() => setIsPulsing(false), 1000);
  }

  // --- TEST RIG FUNCTION ---
  async function triggerTestPing() {
    const testData = { location: { lat: 40.7128, lng: -74.0060 }, lastCheckIn: Date.now(), batteryLevel: 99 };
    await fetch('/api/pulse', { method: 'POST', body: JSON.stringify(testData) });
    alert("Test Ping Sent! Map should move to New York in 5 seconds.");
  }

  useEffect(() => {
    import('leaflet').then((leaflet) => setL(leaflet));
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!L) return <div className="p-10 text-center text-white bg-slate-950 h-screen font-sans">INITIALIZING v6...</div>;

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div style={{ height: '100vh', width: '100%' }} className="bg-slate-950 font-sans">
      <div className="p-4 bg-blue-900 text-white flex justify-between items-center border-b border-blue-800 shadow-2xl">
        <div>
          <h1 className="font-black text-xl tracking-tighter uppercase italic">Lifeline: Admin (v6)</h1>
          <button onClick={triggerTestPing} className="text-[9px] bg-red-600 px-2 py-0.5 rounded mt-1 hover:bg-red-500 font-bold uppercase">Run Connection Test</button>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full ${isPulsing ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-600'}`} />
          <div>
            <div className="text-sm font-black tabular-nums">{lastCheckIn}</div>
            {battery !== null && <div className="text-[10px] font-bold text-emerald-500">BATTERY: {Math.round(battery)}%</div>}
          </div>
        </div>
      </div>
      <MapContainer center={position} zoom={13} style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={icon}><Popup>Sarah v6 is here.</Popup></Marker>
        <MapController center={position} />
      </MapContainer>
    </div>
  );
}
