import { NextRequest, NextResponse } from "next/server";
import User from "@/modals/Users";
import { type UserType } from "./utils/dataTypes";
import {
  getFormatedUser,
  insertUser,
  sendResponse,
  getUsers,
  getPagination,
  getPaginationValidation,
} from "./utils/helper";
import { UserValidator } from "./utils/validation";
import { connectToDB } from "@/lib/db";
import { UserEnums } from "./utils/enums";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectToDB();
    const validation = getPaginationValidation(req.url);
    if (!validation.success) {
      return sendResponse(
        { error: validation.error.errors, message: "Invalid Paginaton Query" },
        400
      );
    } else {
      const { limit = "10", page = "1" } = validation.data;

      const users: UserType[] = await getUsers(limit, page);
      const totalUsers: number = await User.countDocuments();

      const pagination = getPagination(limit, page, totalUsers);

      return sendResponse({ pagination: pagination, data: users }, 200);
    }
  } catch (err) {
    console.error(err);
    const error = err as { message: string };
    return sendResponse({ message: error.message }, 500);
  }
}

export async function POST(req: NextRequest) {
  const body: UserType = await req.json();

  try {
    await connectToDB();
    const user = await getFormatedUser(body);
    const validation = UserValidator.safeParse(user);
    if (!validation.success) {
      return sendResponse(
        {
          message: validation.error.message,
          error: validation.error,
        },
        400
      );
    } else {
      const response = await insertUser(user);
      return sendResponse(
        {
          message: UserEnums.USER_SAVE_SUCCESS,
          data: response,
        },
        201
      );
    }
  } catch (err) {
    const error = err as { message: string; MongooseError: object };
    return sendResponse({ message: error.message }, 500);
  }
}
