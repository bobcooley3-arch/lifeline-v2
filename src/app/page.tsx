'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [loc, setLoc] = useState<any>(null);

  const fetchLoc = async () => {
    const res = await fetch('/api/pulse');
    const data = await res.json();
    if (data.lat) setLoc(data);
  };

  useEffect(() => {
    const i = setInterval(fetchLoc, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: '#020617', color: 'white', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Lifeline Status</h1>
      {loc ? (
        <div style={{ fontSize: '2rem', color: '#60a5fa' }}>
          📍 Lat: {loc.lat.toFixed(4)} <br/>
          📍 Lng: {loc.lng.toFixed(4)}
        </div>
      ) : (
        <p>Waiting for Sarah's phone...</p>
      )}
      <button onClick={() => fetch('/api/pulse', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({lat: 40.7128, lng: -74.0060})})} style={{ marginTop: '20px' }}>
        Test NY
      </button>
    </div>
  );
}
