/** @format */

"use client";

import React, { useState, ChangeEvent } from "react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
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
      <div className="flex justify-between items-center my-4 px-4">
        <h1 className="text-xl px-4 md:text-3xl lg:text-4xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto flex flex-col items-center">
          <Highlight className="text-black dark:text-white w-fit ">
            Blood Donor Locations
          </Highlight>
        </h1>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery} // Bind input value to searchQuery state
            onChange={handleSearchChange} // Update the state when input changes
            placeholder="Search for the blood group"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch} // Trigger search logic when clicked
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </div>
      {/* Pass searchQuery to Map component as a prop */}
      <Map searchQuery={searchQuery} />
    </div>
  );
};

export default LocationPage;
