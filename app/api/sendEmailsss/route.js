/** @format */
import { NextResponse, NextRequest } from "next/server";

import {
  generateBloodDonationRequestEmail,
  generateBloodInventoryRequestEmail,
  sendEmail,
} from "@/lib/nodemailer";

export async function GET(req) {
  try {
    // const emailContent = await generateBloodDonationRequestEmail({
    //   recipientName: "John Doe",
    //   patientName: "Jane Smith",
    //   bloodGroup: "O+",
    //   hospitalName: "City General Hospital",
    //   location: "Downtown, New York",
    //   contactDetails: "+1-555-555-5555",
    // });

    // console.log(emailContent.subject); // Logs the subject
    // console.log(emailContent.body); // Logs the email body

    // await sendEmail(emailContent, ["prashantmanandhar2002@gmail.com"]);

    const emailData = await generateBloodInventoryRequestEmail({
      recipientName: "John Doe",
      organizationName: "City Blood Bank",
      bloodGroup: "B+",
      location: "123 Main Street, New York",
      contactDetails: "+1-555-123-4567",
    });

    console.log(emailData.subject); // Logs the subject
    console.log(emailData.body); // Logs the email body

    await sendEmail(emailData, ["prashantmanandhar2002@gmail.com"]);

    return NextResponse.json({ hello: "hello" } || {});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 }
    );
  }
}
