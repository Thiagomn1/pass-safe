import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  site: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPasswords: [PasswordSchema],
});

export default mongoose.model("User", UserSchema);
