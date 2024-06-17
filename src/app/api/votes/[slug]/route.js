"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../../lib/utils";
import { Vote } from "../../../../lib/model";

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

export const DELETE = async (req, { params }) => {
  const { slug } = params;
  const body = await req.json(); // Extract data from the request body
  const { userId } = body;

  try {
    connectToDb();
    await Vote.deleteOne({ reportId: slug, userId: userId });
    return NextResponse.json("Vote Deleted");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete Vote");
  }
};
