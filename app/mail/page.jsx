/** @format */

"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Contact() {
  async function handleSubmit() {
    try {
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
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
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
