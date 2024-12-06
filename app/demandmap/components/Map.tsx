/** @format */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { userData } from "../constant.js";
import { Droplet, Mail, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

// Fix Leaflet's default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Type the prop `searchQuery` that is passed from `LocationPage`
interface MapProps {
  searchQuery: string;
}

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
  Bhaktapur: [27.671, 85.4298],
  Birgunj: [27.0, 84.866],
  Dharan: [26.8124, 87.2838],
  Janakpur: [26.7288, 85.926],
  Butwal: [27.7006, 83.4509],
  Nepalgunj: [28.05, 81.6167],
  Dhangadhi: [28.6885, 80.5976],
  Hetauda: [27.4285, 85.0301],
  Itahari: [26.6667, 87.2833],
  Damak: [26.6588, 87.7025],
  Tansen: [27.8687, 83.5442],
  Ghorahi: [28.0419, 82.4882],
  Tikapur: [28.5171, 81.1138],
  Kalaiya: [27.0101, 84.8775],
  Rajbiraj: [26.5378, 86.7332],
  Siddharthanagar: [27.5058, 83.4578],
  Bhadrapur: [26.5453, 88.0938],
  Panauti: [27.5829, 85.5097],
  Damauli: [27.9223, 84.1468],
  Kawasoti: [27.6486, 84.1330],
  Banepa: [27.6332, 85.5277],
};

// Send email function
const sendEmail = (): void => {
  const requestBody = {
    recipientName: "John Doe",
    patientName: "Jane Doe",
    bloodGroup: "O+",
    hospitalName: "City Hospital",
    location: "123 Main St",
    contactDetails: "123-456-7890",
    sentTo: ["prashantmanandhar2002@gmail.com"],
  };

  fetch("http://localhost:3000/api/sendEmergencyMail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),

  })
    .then((response) =>{
      if (response.ok) {
              alert("Email sent successfully!");
            } else {
              alert("Failed to send email.");
            }
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
  // fetch("/api/sendEmergencyMail", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     to: email,
  //     subject: subject,
  //     body: body,
  //   }),
  // })
  //   .then((response) => {
  //     if (response.ok) {
  //       alert("Email sent successfully!");
  //     } else {
  //       alert("Failed to send email.");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error sending email:", error);
  //   });
};

const Map: React.FC<MapProps> = ({searchQuery}) => {
  console.log(searchQuery)
  const [data, setData] = useState<Person[]>(userData);
  let [userLocation, setUserLocation] = useState<LatLngExpression | null>([0, 0,]);

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
  userLocation = [27.6253, 85.5561];
  // Red Marker Style for other locations
  const redIcon = new L.Icon({
    iconUrl: "/images/image_blood.png",
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon (where the icon points to)
    popupAnchor: [1, -34], // Popup position when opened
  });

  // Marker Icon for User Location (can be customized)
  const userIcon = new L.Icon({
    iconUrl: "/images/image_man.png", // You can use a custom icon URL for the user
    iconSize: [60, 40], // Slightly bigger icon for user location
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
  
         if (personCoordinates && userLocation ) {
          const distance = getDistance(userLocation, personCoordinates);
          return distance <= 200000; // Only include data within 60 km
        }

        return false;
      })
    : [];
  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

  return (
    <MapContainer
      center={userLocation || [27.7172, 85.324]}
      zoom={9}
      style={{ height: "80vh", width: "100%" }}
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
      {filteredData.map((person, index) => {
        const position: [number, number] = [
          (cityCoordinates[person.location] as [number, number])[0] 
             , 
          (cityCoordinates[person.location] as [number, number])[1] 
        ];
        console.log(position);
        return (
          position && (
            <Marker key={person.id} position={position} icon={redIcon}>
              <Popup>
                <Card className="w-full h-full">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>
                      {" "}
                      {person.first_name} {person.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="w-4 h-4" />
                    <span>{person.blood_group}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{person.location}</span>
                  </div>
                  <Button onClick={sendEmail}>
                  <div className="flex items-center gap-1" >

                    <Mail className="w-4 h-4" />
                    
                    <span>{person.email}</span>
                  </div>
                  </Button>
                </Card>
              </Popup>
            </Marker>
          )
        );
      })}
    </MapContainer>
  );
};

export default Map;
