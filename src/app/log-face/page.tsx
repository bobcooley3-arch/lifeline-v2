'use client';
import { useState } from 'react';

export default function SarahPage() {
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);

  const sendLocation = async () => {
    setStatus('Sending...');
    if (!navigator.geolocation) {
      setError('GPS not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch('/api/pulse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            time: new Date().toLocaleTimeString()
          })
        });
        if (res.ok) setStatus('Signal Sent! ✅');
      } catch (e) {
        setStatus('Retry');
        setError('Check connection');
      }
    }, (err) => setError('Enable GPS in browser settings'));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: 'white', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>LIFELINE</h1>
      <p style={{ color: error ? '#f87171' : '#94a3b8', marginBottom: '40px' }}>{error || 'Tap to update Dad'}</p>
      <button 
        onClick={sendLocation}
        style={{ padding: '40px 60px', fontSize: '1.8rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)' }}
      >
        {status}
      </button>
    </div>
  );
}
