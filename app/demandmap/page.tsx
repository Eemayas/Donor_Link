/** @format */

"use client";

import React, { useState, ChangeEvent } from "react";

import Map from "./components/Map"; // Ensure you have a Map component in the same directory
// Destructure the query parameter
const LocationPage: React.FC = () => {



  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store the search query
 
  // Handle the search input change (type ChangeEvent<HTMLInputElement>)
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Handle the search button click (you can use this to trigger the search logic)
  const handleSearch = (): void => {
    console.log("Searching for:", searchQuery); // This can be replaced with your map search logic
  };

  return (
    <div className="pt-32">
      <div className="flex justify-center items-center my-3 px-4">
        <h1 className="text-center text-xl font-semibold">Notification is sent to following people</h1>

       
      </div>
      {/* Pass searchQuery to Map component as a prop */}
      <Map searchQuery={searchQuery}/>
    </div>
  );
};

export default LocationPage;
