import mongoose from "mongoose";

const AssetsSchema = new mongoose.Schema({
  name: {
    type:String
  },
  email: String,
});

export default mongoose.models.Assets || mongoose.model("User", AssetsSchema);