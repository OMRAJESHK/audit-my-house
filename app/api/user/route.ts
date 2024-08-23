import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import User from "@/modals/Users";
import { type QueryType, type UserType } from "./utils/dataTypes";
import {
  getUpdatedUser,
  insertUser,
  newUserValidation,
  sendResponse,
  paginationValidation,
  getUsers,
  getPagination,
} from "./utils/helper";
import { PaginationValidator } from "./utils/validation";
import { connectToDB } from "@/lib/db";
import { UserEnums } from "./utils/enums";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams) as QueryType;
    const validation = PaginationValidator.safeParse(query);

    const isValid = paginationValidation(validation) as boolean;

    if (isValid) {
      const { limit = "10", page = "1" } = validation.data as QueryType;

      const users: UserType[] = await getUsers(limit, page);
      const totalUsers: number = await User.countDocuments();
      const pagination = getPagination(limit, page, totalUsers);

      return sendResponse({ pagination: pagination, data: users }, 200);
    }
  } catch (err) {
    console.error(err);
    const error = err as { message: string };
    return sendResponse({ error, message: error.message }, 500);
  }
}

export async function POST(req: NextRequest) {
  const body: UserType = await req.json();

  try {
    const user = await getUpdatedUser(body);
    const isValid = newUserValidation(user) as boolean;

    if (isValid) {
      const response = await insertUser(user);
      return sendResponse(
        {
          message: UserEnums.USER_SAVE_SUCCESS,
          data: response,
        },
        201
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);
    }
    return sendResponse(
      { message: UserEnums.USER_SAVE_FAIL, error: error },
      500
    );
  }
}
