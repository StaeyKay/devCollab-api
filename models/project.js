import { Schema, model, Types } from "mongoose";

const projectSchema = new Schema({
    ownerId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    difficultyLevel: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"] },
    role: {type: String, enum: ["Owner", "Contributor"], default: "Owner"},
    rolesNeeded: [{ type: String }], // e.g. ["frontend", "backend"]
    status: {
      type: String,
      enum: ["idea", "in_progress", "completed"],
      default: "idea",
    },
    githubRepo: { type: String },
    contributors: [
      {
        userId: { type: Types.ObjectId, ref: "User" },
        role: { type: String },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


 const Project = model("Project", projectSchema);
 export default Project;