/** @format */
import { NextResponse, NextRequest } from "next/server";
import {
  generateBloodDonationRequestEmail,
  generateBloodInventoryRequestEmail,
  sendEmail,
} from "@/lib/nodemailer";
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      recipientName,
      patientName,
      bloodGroup,
      hospitalName,
      location,
      contactDetails,
      sentTo,
    } = body;

    console.log({
      recipientName,
      patientName,
      bloodGroup,
      hospitalName,
      location,
      contactDetails,
    });

    const emailContent = await generateBloodDonationRequestEmail({
      recipientName,
      patientName,
      bloodGroup,
      hospitalName,
      location,
      contactDetails,
    });

    console.log(emailContent.subject); // Logs the subject
    console.log(emailContent.body); // Logs the email body

    await sendEmail(emailContent, sentTo);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 }
    );
  }
}
