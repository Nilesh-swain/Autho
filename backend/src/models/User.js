import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      required: function () {
        return !this.googleId; // Only required if not a Google user
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Only hash if password changed

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error("Password hashing failed: " + err.message);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export model
const User = mongoose.model("User", userSchema);
export default User;
