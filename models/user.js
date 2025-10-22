import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    profilePic: String,
    authProvider: {
      type: String,
      enum: ["google", "github", "email"],
      required: true,
      default: "email"
    },
    githubProfileLink: { type: String },
    portfolioLink: { type: String },
    linkedIn: { type: String },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    techStack: [{ type: String }],
    projects: [{type: Schema.Types.ObjectId,
    ref: 'Project'}, ],
    country: String,
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
    resetPasswordToken: {type: String},
    resetPasswordTokenExpiry: {type: String}
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

userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(16).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordTokenExpiry = Date.now() + 7 * 6 * 1000;

  return resetToken;
}

const User = model("User", userSchema);

export default User;
