import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  display_password: { type: String, required: true },
  role_id: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true, unique: true, max: 10 },
  created_date: { type: Date, default: Date.now },
  remarks: { type: String },
});

export default mongoose.models.users || mongoose.model("users", UserSchema);
