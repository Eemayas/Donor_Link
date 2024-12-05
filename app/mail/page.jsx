/** @format */

"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Contact() {
  async function handleSubmit() {
    try {
      // Construct the URL with query parameters
      const url = new URL("/api/your-endpoint", window.location.origin);
      url.searchParams.append("recipientName", "John Doe");
      url.searchParams.append("patientName", "Jane Smith");
      url.searchParams.append("bloodGroup", "O+");
      url.searchParams.append("hospitalName", "City General Hospital");
      url.searchParams.append("location", "Downtown, New York");
      url.searchParams.append("contactDetails", "+1-555-555-5555");

      // Use fetch to call the API
      fetch(url, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Handle the response data
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Error: ${err.message || "Please try again later"}`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="relative flex place-items-center p-5 bg-white text-black">
        <Link href="/">Home</Link>
      </div>

      <Button onClick={handleSubmit}>Submit</Button>
    </main>
  );
}
