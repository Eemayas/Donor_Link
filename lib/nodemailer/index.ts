/** @format */

"use server";

import { EmailContent, EmailProductInfo, NotificationType } from "./type";
import nodemailer from "nodemailer";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

export async function generateEmailBody() {
  let subject = "";
  let body = "";

  subject = `Welcome to Price Tracking for `;
  body = `
        <div>
          <h2>Welcome to DarazScapper 🚀</h2>
          <p>You are now tracking .</p>
          <p>Here's an example of how you'll receive updates:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3> is back in stock!</h3>
            <p>We're excited to let you know that  is now back in stock.</p>
            <p>Don't miss out - <a href="$" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Stay tuned for more updates on $ and other products you're tracking.</p>
        </div>
      `;

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  pool: true,
  service: "gmail",
  port: 2525,
  auth: {
    user: "code.camp.2024.blood.donation@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
});

export const sendEmail = async (
  emailContent: EmailContent,
  sendTo: string[]
) => {
  const mailOptions = {
    from: "code.camp.2024.blood.donation@gmail.com",
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log("Email sent: ", info);
  });
};
