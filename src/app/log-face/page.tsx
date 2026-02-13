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
            lastUpdate: new Date().toISOString()
          })
        });
        if (res.ok) setStatus('Signal Sent! ✅');
      } catch (e) {
        setStatus('Retry');
        setError('Check connection');
      }
    }, (err) => setError('Please enable GPS'));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: 'white', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Lifeline</h1>
      <p style={{ color: error ? '#f87171' : '#94a3b8', marginBottom: '30px' }}>{error || 'Tap to update Dad'}</p>
      <button 
        onClick={sendLocation}
        style={{ padding: '30px 60px', fontSize: '1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)' }}
      >
        {status}
      </button>
    </div>
  );
}
