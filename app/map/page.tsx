/** @format */

"use client";
import React from "react";
import Map from "./components/Map"; // Ensure you have a Map component in the same directory

const LocationPage = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        Blood Donor Locations
      </h1>
      <Map />
    </div>
  );
};

export default LocationPage;
