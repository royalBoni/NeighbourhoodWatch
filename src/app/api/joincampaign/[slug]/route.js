"use server";
import { NextResponse } from "next/server";
import { connectToDb } from "../../../../lib/utils";
import { JoinCampaign } from "../../../../lib/model";

export const GET = async (req, param) => {
  const { params } = param;

  try {
    connectToDb();
    const post = await Report.find({ id: params.slug });
    return NextResponse.json(post);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch report");
  }
};

export const DELETE = async (req, params) => {
  const { slug } = params;

  try {
    connectToDb();
    await Report.JoinCampaign({ slug });
    return NextResponse.json("Unjoined");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to unjoined");
  }
};
