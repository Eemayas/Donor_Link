/** @format */

"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Highlight } from "@/components/ui/hero-highlight";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ExternalLinkIcon,
  LocateIcon,
  UsersIcon,
  StarIcon,
  ForkliftIcon,
  Droplet,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { Input } from "@/components/ui/input";

type UserProfile = {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  followers: number;
  following: number;
  location: string;
};

type UserRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
};

export default function GitHubProfileViewer() {
  const [username, setUsername] = useState<string>("eemayas");
  //   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRepos, setUserRepos] = useState<UserRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [age, setAge] = useState<number | null>(45);

  const [bloodType, setBloodType] = useState<
    "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  >("A+");

  const [eligibility, setEligibility] = useState<string>("");

  const userProfile = {
    avatar_url: "https://avatars.githubusercontent.com/u/100434825?v=4",
    location: "Banepa",
    name: "Prashant Manandhar",
    bio: null,
    public_repos: 62,
    public_gists: 0,
    followers: 14,
    following: 20,
    isHealty: true,
    weight: 50,
    history: [
      { date: "2024-12-01", location: "Tokyo, Japan" },
      { date: "2024-11-15", location: "Kyoto, Japan" },
      { date: "2024-11-10", location: "Osaka, Japan" },
      { date: "2024-11-01", location: "Nagoya, Japan" },
      { date: "2024-10-25", location: "Fukuoka, Japan" },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <Card className="p-6 space-y-4 shadow-lg rounded-lg bg-white">
        <CardContent>
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

              <p className="text-gray-600 mt-2">{userProfile.bio}</p>
              <div className="flex items-center gap-4 text-sm mt-2">
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
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center">
              <ClipLoader size={50} color="#4A90E2" />
            </div>
          )}

          {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
