"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Load map parts only in the browser
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function AdminMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      setPosition([51.505, -0.09]); // Default starting point
    });
  }, []);

  if (!position || !L) return <div className="p-10 text-center">Loading Dad's Portal (v4)...</div>;

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1 className="text-center p-4 bg-blue-600 text-white font-bold">Dad's Safety Portal (v4)</h1>
      <MapContainer center={position} zoom={13} style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={icon}>
          <Popup>Sarah's Safety Ping</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
