"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";
import { Campaign, EmailStatus } from "../../../lib/model";
import { cloudinary } from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = async (req) => {
  try {
    connectToDb();
    const campaigns = await Campaign.find();
    return NextResponse.json(campaigns);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    await connectToDb(); // Ensure the database is connected

    const body = await req.formData(); // Extract data from the request body
    const imageFile = body.get("img");

    const uploadImage = async () => {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const results = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              tags: ["nextjs-route-handlers-upload-report-images"],
            },
            function (error, result) {
              if (error) {
                reject(error);
                return;
              }
              resolve(result);
            }
          )
          .end(buffer);
      });
      return results;
    };

    const uploadResult = imageFile && (await uploadImage());

    const newCampaign = new Campaign({
      latitude: body.get("latitude"),
      longitude: body.get("longitude"),
      id: uuidv4(),
      description: body.get("description"),
      threadCategory: body.get("category"),
      creatorId: body.get("userId"),
      img: uploadResult?.secure_url,
      img_id: uploadResult?.public_id,
      skillSet: body.get("skillSet"),
      numberOfPeopleNeeded: body.get("numberOfPeopleNeeded"),
    });

    await newCampaign.save(); // Save the new report to the database
    console.log("Campaing saved to DB");

    const subscribeEmailStatus = body.get("subscribeEmailStatus");
    if (subscribeEmailStatus === "true") {
      const newStatusEmail = new EmailStatus({
        reportId: newCampaign.id,
        reporterId: body.get("userId"),
        id: uuidv4(),
      });

      await newStatusEmail.save();
    }

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
      to: body.get("email"),
      subject: "Aknowledgement of Campaign",
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
                  <h2>Campaign Submission</h2>
                  <h4>Dear ${body.get("username")}</h4>
                  <p>
                  Thank you for setting up a campaign. Your campaing has been assigned the following tracking ID:${
                    newCampaign.id
                  }
                  </p>
                  <p>You can use this ID to track the status of the campaign and any updates.</p>
                  <p>We believe in indidvidual contribution to the development of our society and we promise to be with you in every step to accomplish this campaign.</p>
                 ${
                   subscribeEmailStatus === "true"
                     ? `<p>Since you have subscribed to the status notification through email, we will promptly send you emails whenever there is an update on the campaign</p>`
                     : ""
                 }
                  
                  <p>If you have any additional information to provide or questions regarding your report, please do not hesitate to contact us using this tracking ID as a reference.</p>
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
      report: newCampaign,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
