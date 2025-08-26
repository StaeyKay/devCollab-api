import { Schema, model, Types } from "mongoose";

const joinRequestSchema = new Schema(
  {
    projectId: { type: Types.ObjectId, ref: "Project", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    requestedRole: { type: String, required: true },
    message: { type: String, maxlength: 300 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    reviewedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


export const JoinRequest = model("JoinRequest", joinRequestSchema);