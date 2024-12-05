// /** @format */
// import { NextResponse, NextRequest } from "next/server";

// import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

// export async function GET(req) {
//   try {
//     const emailContent = await generateEmailBody();

//     await sendEmail(emailContent, ["prashantmanandhar2002@gmail.com"]);

//     return NextResponse.json({ hello: "hello" } || {});
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Error fetching data", error },
//       { status: 500 }
//     );
//   }
// }



import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, subject, body } = await req.json();

    // Validate inputs
    if (!to || !subject || !body) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Replace with your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to, // Recipient email
      subject, // Email subject
      text: body, // Email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email", error }, { status: 500 });
  }
}
