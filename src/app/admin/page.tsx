"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// This is the magic part: it skips the map during the build process
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

export default function AdminMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // We only load the Leaflet tools once the browser is live
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      setPosition([51.505, -0.09]); // Default starting point
    });
  }, []);

  if (!position || !L) return <div style={{ padding: '20px' }}>Loading Safety Map...</div>;

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1 style={{ textAlign: 'center', padding: '10px', background: '#eee' }}>Dad's Safety Portal</h1>
      <MapContainer center={position} zoom={13} style={{ height: '90%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={icon}>
          <Popup>Sarah's Safety Ping</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
