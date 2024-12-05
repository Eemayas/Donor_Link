/** @format */

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { userData } from "../constant.js";

// Fix Leaflet's default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Types for the fetched data
interface Person {
  id: number;
  first_name: string;
  last_name: string;
  location: keyof typeof cityCoordinates;
  blood_group: string;
  email: string;
}

// City coordinates type
const cityCoordinates: Record<string, LatLngExpression> = {
  Kathmandu: [27.7172, 85.324],
  Pokhara: [28.2096, 83.9856],
  Lalitpur: [27.6644, 85.3188],
  Biratnagar: [26.4525, 87.2718],
  Bharatpur: [27.6766, 84.4322],
};

// Send email function
const sendEmail = (email: string, subject: string, body: string): void => {
  fetch("/api/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

const Map: React.FC = () => {
  const [data, setData] = useState<Person[]>(userData);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null
  );

  // Fetch data from the public folder
  useEffect(() => {
    // fetch("/dummy_data.json")
    //   .then((response) => response.json())
    //   .then((jsonData: Person[]) => {
    //     setData(jsonData);
    //   })
    //   .catch((error) => {
    //     console.error("Error loading the data:", error);
    //   });

    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Red Marker Style for other locations
  const redIcon = new L.Icon({
    iconUrl: "/image.png",
    iconSize: [65, 40], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon (where the icon points to)
    popupAnchor: [1, -34], // Popup position when opened
  });

  // Marker Icon for User Location (can be customized)
  const userIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // You can use a custom icon URL for the user
    iconSize: [30, 42], // Slightly bigger icon for user location
    iconAnchor: [15, 42], // Adjust anchor point to be centered on the icon
    popupAnchor: [0, -40], // Popup position
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41], // Size of the shadow
  });

  // Function to calculate distance between two locations using Leaflet's latLng.distanceTo method
  const getDistance = (
    loc1: LatLngExpression,
    loc2: LatLngExpression
  ): number => {
    const latLng1 = L.latLng(loc1);
    const latLng2 = L.latLng(loc2);
    return latLng1.distanceTo(latLng2); // Returns distance in meters
  };

  // Filter the data to only show locations within 60 km (60000 meters) of the user location
  const filteredData = userLocation
    ? data.filter((person) => {
        const personCoordinates = cityCoordinates[person.location];
        if (personCoordinates) {
          const distance = getDistance(userLocation, personCoordinates);
          return distance <= 60000; // Only include data within 60 km
        }
        return false;
      })
    : [];

  return (
    <MapContainer
      center={userLocation || [27.7172, 85.324]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Add the User Marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <strong>You are here mate!</strong>
          </Popup>
        </Marker>
      )}

      {/* Add markers for filtered locations */}
      {filteredData.map((person) => {
        const position = cityCoordinates[person.location];
        return (
          position && (
            <Marker key={person.id} position={position} icon={redIcon}>
              <Popup>
                <strong>
                  {person.first_name} {person.last_name}
                </strong>
                <br />
                Blood Group: {person.blood_group}
                <br />
                Email:{" "}
                <a
                  href="#"
                  onClick={() =>
                    sendEmail(
                      person.email,
                      "Blood Donation Request",
                      "Hi, do you have blood for donation?"
                    )
                  }
                >
                  {person.email}
                </a>
              </Popup>
            </Marker>
          )
        );
      })}
    </MapContainer>
  );
};

export default Map;
