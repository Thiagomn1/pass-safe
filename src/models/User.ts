import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  site: {
    type: String,
    required: [true, "Site is required"],
    trim: true, // Removes extra spaces
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPasswords: { type: [PasswordSchema], default: [] },
});

export default mongoose.model("User", UserSchema);
