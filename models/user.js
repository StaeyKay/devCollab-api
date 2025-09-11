import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      validate: {
        validator: function(value){
          return value.includes('@')
        },
        message: (props) => `${props.value} is not a valid email`
      }
     },
    password: { type: String }, // only if using email/password
    authProvider: {
      type: String,
      enum: ["google", "github", "email"],
      required: true,
    },
    githubProfileLink: { type: String },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    techStack: [{ type: String }],
    projects: [{type: Schema.Types.ObjectId
    }],
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

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (
  passwordFromDb,
  passwordFromUser
) {
  return bcrypt.compare(passwordFromUser, passwordFromDb);
};

const User = model("User", userSchema);

export default User;
