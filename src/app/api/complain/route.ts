"use server";

import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";
import { Complaint } from "../../../lib/model";

import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");

export const GET = async (req: Request) => {
  try {
    connectToDb();
    const complaints = await Complaint.find();
    return NextResponse.json(complaints);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    await connectToDb(); // Ensure the database is connected

    const body = await req.json(); // Extract data from the request body
    const {
      complainantId,
      complainantName,
      complainantEmail,
      complaintMessage,
      reportId,
    } = body;

    const newComplaint = new Complaint({
      id: uuidv4(),
      message: complaintMessage,
      reportId: reportId,
      complainantId: complainantId,
    });

    await newComplaint.save(); // Save the new report to the database
    console.log("Complain saved to DB");

    // Creating a config object for nodemailer
    let configuration = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(configuration);

    let message = {
      from: process.env.EMAIL,
      to: complainantEmail,
      subject: "Complain Aknowledgement",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>HTTP SERVER</title>
          
              <style>
                  .email{
                      padding: 1rem;
                      background-color:rgb(128, 128, 128); ; 
                  }
                  h1{  
                      color: white;
                      font-style: italic;
                  }
          
                  a{
                      text-decoration: none;
                      color:rgb(233, 216, 214) ;
                  }
          
                  .button{
                      background-color: rgb(63, 4, 50); 
                      padding: 0.2rem 1rem;
                      margin-left: auto;
                      margin-right: auto;
                      left: 0;
                      right: 0;
                      text-align: center;
                      border-radius: 50px;
                  }
          
                  .greetings{
                      display: grid;
                      gap: 0.5rem;
                  }
              </style>
          </head>
          <body>
              <div class="email">
                  <h1>Neighbourhood Watch</h1>
                  <h2>Complaint Submission</h2>
                  <h4>Dear ${complainantName}</h4>
                  <p>
                  Thank you for submitting the complaint after 10 days of no status change. We have received your submission and are currently reviewing the details
                  </p>
                 
                  
                  <p>We will get back to you as soon as a resolution is made.</p>
                  <p class="greetings">
                      <p>Best of Regards,</p>
                      <p>The Neighbourhood Watch Team</p>
                  </p>
              </div>
          </body>
          </html>
      `,
    };

    await transporter.sendMail(message);
    return NextResponse.json({
      message: "Report saved successfully and email sent",
      complaint: newComplaint,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
