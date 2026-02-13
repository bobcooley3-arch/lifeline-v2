"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Visual Components (Dynamic is fine here)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// This component handles the map movement safely
function MapController({ center }: { center: [number, number] }) {
  // We import the hook only when the component is running in the browser
  const [map, setMap] = useState<any>(null);
  
  // Get the map instance safely
  const MapHookLoader = require('react-leaflet').useMap;
  const currentMap = MapHookLoader();

  useEffect(() => {
    if (currentMap && center) {
      currentMap.setView(center, 15);
    }
  }, [center, currentMap]);

  return null;
}

export default function AdminMap() {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [L, setL] = useState<any>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("Waiting for signal...");
  const [battery, setBattery] = useState<number | null>(null);

  async function fetchLocation() {
    try {
      const response = await fetch('/api/pulse');
      const data = await response.json();
      const loc = data.location || data.lastKnownLocation;
      
      if (loc && loc.lat && loc.lng) {
        setPosition([loc.lat, loc.lng]);
        setBattery(data.batteryLevel || null);
        setLastCheckIn(new Date(data.lastCheckIn || data.timestamp || Date.now()).toLocaleTimeString());
      }
    } catch (error) {
      console.error("Map fetch error:", error);
    }
  }

  useEffect(() => {
    // Load Leaflet library for icons
    import('leaflet').then((leaflet) => setL(leaflet));
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!L) return <div className="p-10 text-center text-white bg-slate-950 h-screen font-sans">INITIALIZING SAFETY PORTAL...</div>;

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
          <h1 className="font-black text-xl tracking-tighter uppercase italic">Lifeline: Admin</h1>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]">Monitoring Sarah</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-black tabular-nums">{lastCheckIn}</div>
          {battery !== null && (
            <div className={`text-[10px] font-bold ${battery < 20 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
              BATTERY: {battery}%
            </div>
          )}
        </div>
      </div>
      
      <MapContainer center={position} zoom={13} style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={icon}>
          <Popup>Sarah is here.</Popup>
        </Marker>
        <MapController center={position} />
      </MapContainer>
    </div>
  );
}
