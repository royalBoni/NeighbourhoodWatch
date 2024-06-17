"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../lib/utils";
import { Vote } from "../../../lib/model";
import { v4 as uuidv4 } from "uuid";

export const GET = async (req) => {
  try {
    connectToDb();
    const votes = await Vote.find();
    return NextResponse.json(votes);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch votes");
  }
};

export const POST = async (req) => {
  try {
    await connectToDb(); // Ensure the database is connected

    const body = await req.json(); // Extract data from the request body
    const { userId, reportId } = body;

    const newVote = new Vote({
      id: uuidv4(),
      userId,
      reportId,
    });

    await newVote.save(); // Save the new recipe to the database
    console.log("Vote Saved to DB");

    return NextResponse.json({ message: "vote registered successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
