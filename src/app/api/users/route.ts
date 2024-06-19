"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";
import { ReportUser } from "../../../lib/model";
import { v4 as uuidv4 } from "uuid";

export const GET = async (req: Request) => {
  try {
    await connectToDb(); // Ensure the database is connected
    const processedUsers = [];
    const users = await ReportUser.find();

    await users.map((item) =>
      processedUsers.push({
        name: item.username,
        id: item.id,
        badge: item.badge,
      })
    );

    return NextResponse.json(processedUsers);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    await connectToDb(); // Ensure the database is connected

    const body = await req.json(); // Extract data from the request body
    const { username, email, password, userType, userId } = body;

    if (password === "googleauth") {
      const findUser = await ReportUser.find({ email: email });

      if (findUser.length > 0) {
        return NextResponse.json({
          message: "Account successfully authenticated",
        });
      } else {
        const newUser = new ReportUser({
          username,
          email,
          password,
          userBadge: "Associate",
          userType,
          id: userId,
        });

        await newUser.save(); // Save the new chef to the database
        console.log("Saved to DB");

        return NextResponse.json({ message: "Account created successfully" });
      }
    }
    const newUser = new ReportUser({
      username,
      email,
      password,
      userBadge: "Associate",
      userType,
      id: uuidv4(),
    });

    await newUser.save(); // Save the new chef to the database
    console.log("Saved to DB");

    return NextResponse.json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

/* export const PATCH = async (req: Request) => {
  try {
    connectToDb();

    const body = await req.formData(); // Extract data from the request body
    const imageFile = body.get("image") as File;


    await ReportUser.findOneAndUpdate(
      { id: body.get("user_id") },
      {
        username: body.get("username"),
        country: body.get("country"),
        bio: body.get("bio"),
      
      },
      {
        new: true,
      }
    );
    return NextResponse.json("Post Updated");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update profile");
  }
};
 */
