import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 404;

    return next(error);
  }
  try {
    const user = await User.create(req.body);

    return res.status(201).json({
      message: "Sign up successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Incorrect credentials");
      error.statusCode = 401;
      return next(error);
    }

    // Compare password with existing password in db
    const isMatched = await user.comparePassword(user.password, password);

    if (!isMatched) {
      const error = new Error("Incorrect credentials");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
      httpOnly: true, // avoid client side tempering
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      message: "success",
      statusCode: 200,
      token,
      user,
    });
  } catch (error) {
    next(error)
  }
};
