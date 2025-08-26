import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String }, // only if using email/password
    authProvider: {
      type: String,
      enum: ["google", "github", "email"],
      required: true,
    },
    githubProfileLink: { type: String },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    techStack: [{ type: String }],
    // projects: [{type: String}],
    status: {
      type: String,
      enum: ["open_to_collaborate", "unavailable"],
      default: "open_to_collaborate",
    },
    role: {
      type: String, // this role is the profession of the user
    },
    badges: [
      {
        name: { type: String },
        awardedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
