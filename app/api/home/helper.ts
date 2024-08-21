import { type ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { UserSchema, type UserType } from "@/modals/user";
import bcrypt from "bcryptjs";

export async function getUpdatedUser(body: UserType) {
  const user = { ...body, created_date: new Date() };

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  return user;
}

export async function insertUser(user: UserType) {
  const db = clientPromise.db(process.env.DB_NAME);
  const collection = db.collection("users");
  const response = await collection.insertOne(user);
  return response;
}

export async function updateUser(id: ObjectId, user: UserType) {
  const db = clientPromise.db(process.env.DB_NAME);
  const collection = db.collection("users");
  const response = await collection.updateOne(
    { _id: id },
    { $set: { ...user } }
  );
  return response;
}
