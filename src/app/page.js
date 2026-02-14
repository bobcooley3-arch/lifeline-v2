export default function Page() {
  const testPulse = () => {
    alert("Pulse Engine Initialized. Waiting for API Route...");
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif',
      color: 'white',
      backgroundColor: '#0f172a'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>LIFELINE CORE</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Forensic Safety Engine v1.0</p>
      
      <button 
        onClick={testPulse}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        TEST NEW YORK
      </button>
    </main>
  )
}
