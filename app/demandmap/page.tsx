/** @format */

"use client";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import React, { useState, ChangeEvent } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
});

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
        <h1 className="text-xl px-4 md:text-3xl lg:text-4xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto flex flex-col items-center">
          <Highlight className="text-black dark:text-white w-fit ">
            Notification is sent to following people
          </Highlight>
        </h1>
      </div>
      {/* Pass searchQuery to Map component as a prop */}
      <Map searchQuery={searchQuery} />
    </div>
  );
};

export default LocationPage;
