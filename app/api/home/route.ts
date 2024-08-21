import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { UpdatedUserSchema, UserSchema, type UserType } from "@/modals/user";
import { z } from "zod";
import { getUpdatedUser, insertUser, updateUser } from "./helper";
import { type ObjectId } from "mongodb";

type ResponseData = { message: string };

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const db = clientPromise.db("audit_my_house_db");
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

export async function POST(req: NextRequest) {
  await clientPromise.connect();
  const body: UserType = await req.json();

  try {
    const user = await getUpdatedUser(body);

    const validation = UserSchema.safeParse(user);
    if (!validation.success) {
      return NextResponse.json(validation.error.format());
    }
    const response = await insertUser(user);

    return NextResponse.json({
      status: 201,
      message: "User Added Successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);
    }
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: ObjectId } }
) {
  console.log("params=>", params);
  await clientPromise.connect();
  const body = await req.json();
  const id = params.userId;

  try {
    const user = body;

    const validation = UpdatedUserSchema.safeParse(user);
    if (!validation.success) {
      return NextResponse.json(validation.error.format());
    }
    const response = await updateUser(id, user);

    return NextResponse.json({
      status: 200,
      message: "User Updated Successfully",
      data: response,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);
    }
  }
}
