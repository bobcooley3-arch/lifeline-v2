'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);

  const sync = async () => {
    try {
      const res = await fetch('/api/pulse');
      const json = await res.json();
      if (json.lat) setData(json);
    } catch (e) { console.log('Syncing...'); }
  };

  useEffect(() => {
    const timer = setInterval(sync, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: '#020617', color: 'white', padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
        <h1 style={{ margin: 0 }}>Lifeline Admin</h1>
        <button onClick={() => fetch('/api/pulse', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({lat: 40.7128, lng: -74.0060, time: 'TEST'})})} style={{ backgroundColor: '#dc2626', color: 'white', padding: '10px 15px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          TEST NEW YORK
        </button>
      </div>
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        {data ? (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>📍</div>
            <div style={{ fontSize: '2.5rem', color: '#60a5fa', fontWeight: 'bold' }}>
              {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Last Signal: {data.time}</p>
          </div>
        ) : (
          <p style={{ color: '#475569', fontSize: '1.2rem' }}>Waiting for Sarah's first signal...</p>
        )}
      </div>
    </div>
  );
}
