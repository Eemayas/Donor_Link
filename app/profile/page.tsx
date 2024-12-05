/** @format */
"use client";
/** @format */

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UsersIcon,
  LocateIcon,
  Droplet,
  MapPinIcon,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function ProfileViewer() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    if (loginStatus !== "true") {
      router.push("/auth");
    }
  }, []);

  const [userProfile, setUserProfile] = useState({
    avatar_url: "https://avatars.githubusercontent.com/u/100434825?v=4",
    location: "Banepa, Nepal",
    name: "Prashant Manandhar",
    bio: null,
    public_repos: 62,
    public_gists: 0,
    followers: 14,
    following: 20,
    age: 22,
    isHealthy: true,
    weight: 50,
    history: [
      { date: "2024-12-01", location: "Kathmandu, Nepal" },
      { date: "2024-6-15", location: "Pokhara, Nepal" },
      { date: "2023-11-10", location: "Lalitpur, Nepal" },
      { date: "2022-11-01", location: "Bhaktapur, Nepal" },
      { date: "2021-10-25", location: "Chitwan, Nepal" },
    ],
  });

  const [bloodType, setBloodType] = useState("A+");
  const [newHistory, setNewHistory] = useState({ date: "", location: "" });

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Save updated details logic here
  };

  const handleChange = (key: string, value: any) => {
    setUserProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddHistory = () => {
    if (newHistory.date && newHistory.location) {
      setUserProfile((prev) => ({
        ...prev,
        history: [...prev.history, newHistory],
      }));
      setNewHistory({ date: "", location: "" }); // Reset input fields
      setIsAddingHistory(false); // Close history form
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pt-28 ">
      <Card className="p-6 space-y-4 shadow-lg rounded-lg bg-white max-w-2xl">
        <CardContent>
          {!isEditing ? (
            <>
              {/* User Profile Details */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="size-44 border">
                  <AvatarImage src={userProfile.avatar_url} />
                  <AvatarFallback>
                    {userProfile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-center">
                    {userProfile.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {userProfile.bio || "No bio available"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      <span>{userProfile.followers} Followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      <span>{userProfile.following} Following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LocateIcon className="w-4 h-4" />
                      <span>{userProfile.location || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplet className="w-4 h-4" />
                      <span>{bloodType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Weight:</span>
                      <span>{userProfile.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Age:</span>
                      <span>{userProfile.age} </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Healthy:</span>
                      <span>{userProfile.isHealthy ? "Yes" : "No"}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span>Safe to Donate:</span>
                      <input
                        type="checkbox"
                        checked={userProfile.isHealthy}
                        onChange={(e) =>
                          handleChange("isHealthy", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* User History */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">History:</h3>
                <ul className="space-y-2">
                  {userProfile.history.map((entry, index) => (
                    <Card
                      key={index}
                      className="p-4 border flex flex-row justify-between"
                    >
                      <div className="flex flex-row justify-between items-center gap-3">
                        <MapPinIcon className="w-4 h-4" />
                        <h4 className="font-bold">{entry.location}</h4>
                      </div>
                      <div className="flex flex-row justify-between items-center gap-3">
                        <Calendar className="w-4 h-4" />
                        <p className="text-gray-600">{entry.date}</p>
                      </div>
                    </Card>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Edit Form */}
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Name"
                  value={userProfile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={userProfile.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
                <Input
                  placeholder="Bio"
                  value={userProfile.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
                <Input
                  placeholder="Blood Type"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                />
                <Input
                  placeholder="Weight"
                  type="number"
                  value={userProfile.weight}
                  onChange={(e) =>
                    handleChange("weight", Number(e.target.value))
                  }
                />
                <Input
                  placeholder="Age"
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => handleChange("age", Number(e.target.value))}
                />
              </div>
            </>
          )}

          {/* Add History Form */}
          {isAddingHistory && (
            <div className="mt-4 space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newHistory.date}
                  onChange={(e) =>
                    setNewHistory({ ...newHistory, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newHistory.location}
                  onChange={(e) =>
                    setNewHistory({ ...newHistory, location: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddHistory} className="bg-green-500">
                Save History
              </Button>
              <Button
                onClick={() => setIsAddingHistory(false)}
                className="bg-red-500"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-7">
          {!isAddingHistory && (
            <Button
              onClick={() => setIsAddingHistory(true)}
              className="bg-blue-500"
            >
              Add History
            </Button>
          )}
          {isEditing ? (
            <Button onClick={handleSaveChanges} className="bg-green-500">
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500">
              Change Detail
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
