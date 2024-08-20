import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

type ResponseData = {
  message: string;
};

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("audit_my_house_db");
    const assets: any = await db
      .collection("assets")
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray();
    return NextResponse.json({ status: 200, data: assets });
  } catch (e) {
    console.error(e);
  }
}
