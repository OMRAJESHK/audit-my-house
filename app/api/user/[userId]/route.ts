import { Types } from "mongoose";
import User from "@/modals/Users";
import { UpdateUserType, type ParamsType } from "../utils/dataTypes";
import { sendResponse } from "../utils/helper";
import { UpdatedUserValidator } from "../utils/validation";
import { connectToDB } from "@/lib/db";

export async function PUT(req: Request, { params }: ParamsType) {
  try {
    await connectToDB();
    const body = await req.json();

    const id = params.userId;
    if (!Types.ObjectId.isValid(id)) {
      return sendResponse({ message: "Invalid User ID" }, 400);
    }

    const user: UpdateUserType = body;
    const validation = UpdatedUserValidator.safeParse(user);
    if (!validation.success) {
      const errResponse = validation.error.issues[0];
      return sendResponse({ error: errResponse }, 400);
    } else {
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
      if (!updatedUser) {
        return sendResponse({ data: { id }, message: "User not found" }, 404);
      }
      return sendResponse(
        {
          message: "User updated successfully",
          data: updatedUser,
        },
        200
      );
    }
  } catch (err) {
    const error = err as { message: string; MongooseError: object };
    return sendResponse({ message: error.message }, 500);
  }
}

export async function DELETE(_: Request, { params }: ParamsType) {
  try {
    await connectToDB();
    const id: string = params.userId;
    if (!Types.ObjectId.isValid(id)) {
      return sendResponse({ message: "Invalid User ID" }, 400);
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return sendResponse({ data: { id }, message: "User not found" }, 404);
    }
    return sendResponse(
      { data: { deletedUser }, message: "User Deleted successfully" },
      200
    );
  } catch (err) {
    const error = err as { message: string; MongooseError: object };
    return sendResponse({ error, message: error.message }, 500);
  }
}
