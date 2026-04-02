const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[0-9]{10,15}$/, "Please enter a valid mobile number"]
    },
    role: {
      type: String,
      enum: ["customer", "barber", "owner", "admin"],
      default: "customer"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
