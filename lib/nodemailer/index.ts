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

export async function generateBloodDonationRequestEmail({
  recipientName,
  patientName,
  bloodGroup,
  hospitalName,
  location,
  contactDetails,
}: {
  recipientName: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  location: string;
  contactDetails: string;
}) {
  const subject = `Urgent Blood Donation Request for ${patientName} - ${bloodGroup} Needed`;
  const body = `
          <div>
            <h2>Urgent Blood Donation Needed 🚨</h2>
            <p>Dear ${recipientName},</p>
            <p>We have an emergency case and are urgently in need of blood donations for:</p>
            <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
              <h3>Patient Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${patientName}</li>
                <li><strong>Blood Group:</strong> ${bloodGroup}</li>
                <li><strong>Hospital:</strong> ${hospitalName}</li>
                <li><strong>Location:</strong> ${location}</li>
                <li><strong>Contact:</strong> ${contactDetails}</li>
              </ul>
            </div>
            <p>If you or someone you know can help, please contact us immediately at ${contactDetails} or visit ${hospitalName} at the earliest.</p>
            <p>Every drop counts. Your support can save a life today!</p>
            <p style="margin-top: 20px;">Thank you for your kindness and generosity.</p>
            <p style="margin-top: 10px;">Stay safe,</p>
            <p>The Emergency Response Team</p>
          </div>
        `;

  return { subject, body };
}

export async function generateBloodInventoryRequestEmail({
  recipientName,
  organizationName,
  bloodGroup,
  location,
  contactDetails,
}: {
  recipientName: string;
  organizationName: string;
  bloodGroup: string;
  location: string;
  contactDetails: string;
}) {
  const subject = `Critical Blood Donation Appeal from ${organizationName} - ${bloodGroup} Urgently Needed`;
  const body = `
          <div>
            <h2>Critical Blood Donation Appeal 🚨</h2>
            <p>Dear ${recipientName},</p>
            <p>We are reaching out to you on behalf of <strong>${organizationName}</strong> due to a critical shortage of <strong>${bloodGroup}</strong> blood in our inventory.</p>
            <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
              <h3>Details:</h3>
              <ul>
                <li><strong>Blood Group Needed:</strong> ${bloodGroup}</li>
                <li><strong>Organization:</strong> ${organizationName}</li>
                <li><strong>Location:</strong> ${location}</li>
                <li><strong>Contact:</strong> ${contactDetails}</li>
              </ul>
            </div>
            <p>This shortage is impacting our ability to provide life-saving blood to patients in need. We are urging donors to help us replenish our inventory to meet the growing demand.</p>
            <p>If you or someone you know can donate, please contact us at ${contactDetails} or visit our donation center at ${location}.</p>
            <p>Your generosity could make a critical difference in saving lives.</p>
            <p style="margin-top: 20px;">Thank you for your support.</p>
            <p style="margin-top: 10px;">Sincerely,</p>
            <p><strong>The ${organizationName} Team</strong></p>
          </div>
        `;

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  //   pool: true,
  service: "gmail",
  //   port: 2525,
  auth: {
    user: "code.camp.2024.blood.donation@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  //   maxConnections: 1,
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
