/** @format */

import { NextResponse, NextRequest } from "next/server";
// const nodemailer = require("nodemailer");
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
export async function GET(req) {
  try {
    const emailContent = await generateEmailBody();

    await sendEmail(emailContent, ["prashantmanandhar2002@gmail.com"]);
    return NextResponse.json({ hello: "hello" } || {});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 }
    );
  }
}
