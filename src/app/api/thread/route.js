"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";
import { Thread } from "../../../lib/model";
import { cloudinary } from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";

export const GET = async (req) => {
  try {
    connectToDb();
    const reports = await Thread.find();
    return NextResponse.json(reports);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
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

    const newThread = new Thread({
      latitude: body.get("latitude"),
      longitude: body.get("longitude"),
      id: uuidv4(),
      description: body.get("description"),
      threadCategory: body.get("category"),
      creatorId: body.get("userId"),
      img: uploadResult?.secure_url,
      img_id: uploadResult?.public_id,
    });

    await newThread.save(); // Save the new report to the database
    console.log("Thread saved to DB");
    return NextResponse.json({
      message: "Thread saved successfully",
      report: newThread,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
