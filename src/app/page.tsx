'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

export default function AdminPage() {
  const [data, setData] = useState<any>(null);

  const checkPulse = async () => {
    const res = await fetch('/api/pulse');
    const json = await res.json();
    if (!json.error) setData(json);
  };

  useEffect(() => {
    checkPulse();
    const interval = setInterval(checkPulse, 10000);
    return () => clearInterval(interval);
  }, []);

  const runTest = async () => {
    await fetch('/api/pulse', {
      method: 'POST',
      body: JSON.stringify({ lat: 40.7128, lng: -74.0060, batt: 99 })
    });
    checkPulse();
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#020617' }}>
      <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <span>Admin Dashboard (v6.1)</span>
        <button onClick={runTest} style={{ backgroundColor: '#dc2626', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none' }}>
          Run NY Test
        </button>
      </div>
      
      <div style={{ flex: 1 }}>
        {typeof window !== 'undefined' && (
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {data && <Marker position={[data.lat, data.lng]} />}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
