import jwt from "jsonwebtoken";
import  User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
        const error = new Error()
        error.message = "Not authorized";
        error.statusCode = 401
      return next(error)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded) {
      const error = new Error('Invalid token');
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.id).select("-password");
    req.user = user

    if (!req.user) {
      const error = new Error()
        error.message = "User not found";
        error.statusCode = 401
      return next(error)
    }

    next();
  } catch (error) {
    next(error)
  }
};
