'use client';
import { useState } from 'react';

export default function Sarah() {
  const [msg, setMsg] = useState('TAP TO UPDATE DAD');
  
  const send = async () => {
    setMsg('SENDING...');
    navigator.geolocation.getCurrentPosition(async (p) => {
      await fetch('/api/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: p.coords.latitude, lng: p.coords.longitude, time: new Date().toLocaleTimeString() })
      });
      setMsg('SENT! ✅');
    }, () => setMsg('ERROR: ENABLE GPS'));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
      <button onClick={send} style={{ padding: '60px', fontSize: '2rem', borderRadius: '30px', backgroundColor: '#2563eb', color: 'white', border: 'none', fontWeight: 'bold' }}>
        {msg}
      </button>
    </div>
  );
}
