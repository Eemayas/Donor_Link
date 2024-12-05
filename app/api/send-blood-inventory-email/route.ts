/** @format */

// /** @format */
// import { NextResponse, NextRequest } from "next/server";

// import {
//   generateBloodDonationRequestEmail,
//   generateBloodInventoryRequestEmail,
//   sendEmail,
// } from "@/lib/nodemailer";

// export async function GET(req) {
//   try {

//     const emailData = await generateBloodInventoryRequestEmail({
//       recipientName: "John Doe",
//       organizationName: "City Blood Bank",
//       bloodGroup: "B+",
//       location: "123 Main Street, New York",
//       contactDetails: "+1-555-123-4567",
//     });

//     console.log(emailData.subject); // Logs the subject
//     console.log(emailData.body); // Logs the email body

//     await sendEmail(emailData, ["prashantmanandhar2002@gmail.com"]);

//     return NextResponse.json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Error fetching data", error },
//       { status: 500 }
//     );
//   }
// }
/** @format */
import { NextResponse, NextRequest } from "next/server";

import {
  generateBloodDonationRequestEmail,
  generateBloodInventoryRequestEmail,
  sendEmail,
} from "@/lib/nodemailer";

// Change to POST method
export async function POST(req: NextRequest) {
  try {
    // Parse JSON data from the request body
    const {
      recipientName,
      organizationName,
      bloodGroup,
      location,
      contactDetails,
      recipientEmail,
    } = await req.json();

    // Validate the required fields
    if (
      !recipientName ||
      !organizationName ||
      !bloodGroup ||
      !location ||
      !contactDetails ||
      !recipientEmail
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log({
      recipientName,
      organizationName,
      bloodGroup,
      location,
      contactDetails,
      recipientEmail,
    });

    // Generate the email data
    const emailData = await generateBloodInventoryRequestEmail({
      recipientName,
      organizationName,
      bloodGroup,
      location,
      contactDetails,
    });

    console.log(emailData.subject); // Logs the subject
    console.log(emailData.body); // Logs the email body

    // Send the email
    await sendEmail(emailData, recipientEmail);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error processing request", error },
      { status: 500 }
    );
  }
}
