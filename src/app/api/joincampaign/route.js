"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";
import { JoinCampaign } from "../../../lib/model";
import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");

export const GET = async (req) => {
  try {
    connectToDb();
    const campaigns = await JoinCampaign.find();
    return NextResponse.json(campaigns);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch joined campaigns" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const body = await req.json(); // Extract data from the request body
  const { campaignFanId, campaignId } = body;
  try {
    connectToDb();
    await JoinCampaign.findOneAndDelete({
      campaignFanId: campaignFanId,
      campaignId: campaignId,
    });
    return NextResponse.json("Unjoined");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to unjoined");
  }
};

export const POST = async (req) => {
  try {
    await connectToDb(); // Ensure the database is connected

    const body = await req.json(); // Extract data from the request body
    const { campaignFanId, email, campaignOwnerId, campaignId, userName } =
      body;

    const newJoinCampaign = new JoinCampaign({
      id: uuidv4(),
      campaignId,
      campaignOwnerId,
      campaignFanId,
    });

    await newJoinCampaign.save(); // Save the new report to the database
    console.log("NewJoinCampaign saved to DB");

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
      to: email,
      subject: "Aknowledgement of Joining a Campaign",
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
                  <h2>Joining a Campaign</h2>
                  <h4>Dear ${userName}</h4>
                  <p>
                  Thank you for joining a campaign to make our community a better place. 
                  
                  </p>
                  
                  <p>We believe in indidviduals contribution to the development of our society and we promise to be with you in every step to accomplish this campaign.</p>
                
                  
                  <p>We will provide you with details of how the campaign will be carried out once the number of people need for the project is met</p>
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
      message: "Join saved successfully and email sent",
      report: newJoinCampaign,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
