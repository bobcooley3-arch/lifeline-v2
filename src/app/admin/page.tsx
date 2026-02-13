"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the missing marker icon in Leaflet
const icon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });

export default function AdminMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // This is where the map "listens" for Sarah's location
    // For now, it will show a default spot until we link your database
    setPosition([51.505, -0.09]); 
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1 style={{ textAlign: 'center', padding: '10px' }}>Dad's Safety Portal</h1>
      {position && (
        <MapContainer center={position} zoom={13} style={{ height: '90%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={icon}>
            <Popup>Sarah's Last Known Location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}
