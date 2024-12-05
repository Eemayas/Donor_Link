// pages/location/page.js
"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import Map from '../../components/Maps';
// // Dynamically import the Map component with ssr: false to prevent SSR issues
// const Map = dynamic(() => import('../components/Maps'), { ssr: false });

const LocationPage = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Blood Donor Locations</h1>
      <Map />
    </div>
  );
};

export default LocationPage;
