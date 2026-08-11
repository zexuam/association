import bcrypt from "bcryptjs";
import mongoose from "mongoose";
mongoose.pluralize(null);
const loginSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    lowercase: true,
    trim: true,
    unique: true,
    index: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  verificationCode: String,
  verificationCodeExpiry: Date,
  verificationCodeSent: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
  agree: {
    type: Boolean,
    default: true,
  },
});

loginSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const passwordHash = await bcrypt.hash(this.password, 10);

  this.password = passwordHash;
});

export default function Auth(connection) {
  return (
    connection.models.accounts || connection.model("accounts", loginSchema)
  );
}
