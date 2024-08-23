import { z } from "zod";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import User from "@/modals/Users";
import { UpdateUserType, type ParamsType } from "../utils/dataTypes";
import { userValidation } from "../utils/helper";

export async function PUT(req: Request, { params }: ParamsType) {
  try {
    const body = await req.json();
    const id = params.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid item ID" }, { status: 400 });
    }

    const user: UpdateUserType = body;
    const isValid = userValidation(user) as boolean;

    if (!id) {
      return NextResponse.json(
        { message: "User Id is Required" },
        { status: 400 }
      );
    }
    if (isValid) {
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
      if (!updatedUser) {
        return NextResponse.json(
          { id, message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "User updated successfully",
        data: updatedUser,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);
      return NextResponse.json(
        {
          message: "Invaid Input",
          error: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "Invaid Input",
        error: error,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, { params }: ParamsType) {
  try {
    const id: string = params.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "User Id is Required" },
        { status: 400 }
      );
    }
    const deletedUser = await User.findByIdAndDelete(id);
    console.log("deletedUser", deletedUser);
    if (!deletedUser) {
      return NextResponse.json(
        { id, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User Deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);
      return NextResponse.json({
        status: 400,
        message: "Invaid Input",
        error: error.errors,
      });
    }
    return NextResponse.json({
      status: 400,
      message: "Invaid Input",
      error: error,
    });
  }
}
