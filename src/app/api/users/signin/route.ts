"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../../lib/utils";
import { ReportUser } from "../../../../lib/model";
/* import bcrypt from "bcrypt"; */

export const POST = async (req: Request) => {
  try {
    await connectToDb(); // Ensure the database is connected

    const body = await req.json(); // Extract data from the request body
    const { email, password } = body;

    // Find the chef by email
    const user = await ReportUser.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hashed password
    //const isMatch = await bcrypt.compare(password, chef.password_hash);

    if (!password === user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set the chef's online attribute to true
    user.online = true;
    await user.save();

    // Return the chef's details to the frontend
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
