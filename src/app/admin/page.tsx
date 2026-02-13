"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// This tells Next.js to only load these pieces in the actual browser
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

export default function AdminMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [leafletRef, setLeafletRef] = useState<any>(null);

  useEffect(() => {
    // Only import the 'L' icon tool when the browser is ready
    import('leaflet').then((L) => {
      setLeafletRef(L);
      setPosition([51.505, -0.09]); // Default starting point
    });
  }, []);

  if (!position || !leafletRef) {
    return <div className="p-10 text-center">Loading Dad's Portal...</div>;
  }

  const customIcon = leafletRef.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1 className="text-center p-4 bg-gray-100 font-bold border-b">Dad's Safety Portal</h1>
      <MapContainer center={position} zoom={13} style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={customIcon}>
          <Popup>Sarah's Safety Ping</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
