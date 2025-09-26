import { sendMail } from "../config/sendMail.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "user logged out",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("The user with this email does not exist");
      error.statusCode = 400;
      return next(error);
    }

    const resetToken = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;

    const subject = "Password Reset Link";
    const html = `<p>Click on the following link below or copy the link and open in a new tab in your browser to reset your password.</p>
    <a href = "${resetUrl}" target="_blank">Click here to reset your password</a>
    <p>"${resetUrl}"</p>
    <p>Note that the link expires after 7 minutes.</p>`;

    try {
      sendMail({
        to: user.email,
        subject,
        html,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      user.save({validateBeforeSave: true});
      next(error);
    }

    res.status(200).json({
      success: true,
      message: "Password reset link to to email successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const {resetPasswordToken} = req.params;
  const {password} = req.body;

  if(!password) {
    return res.status(400).json({
      message: 'password is required'
    })
  }

  try {
    // use crypto to hash the reset password token
    const hashedResetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedResetPasswordToken,
      resetPasswordTokenExpiry: {$gt: Date.now()}
    });

    if(!user) {
      const error = new Error("The password reset token/link has expired");
      error.statusCode = 400;
      return next(error);
    };

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!userId) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
};


export const loadUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        
        if(!token){
            const error = new Error('You are not logged in');
            error.statusCode = 401;
            return next(error)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            const error = new Error('token invalid');
            error.statusCode = 401;
            return next(error)
        }
        // console.log('user logged in',req.loggedInUser)


        const user = await User.findById(decoded.id).select('-password'); //{_id: '36uwgiu', firstName: }

        if(!user) {
            const error = new Error('The user with this token does not exist');
            error.statusCode = 401;
            return next(error)
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            user
        })
        

    } catch (error) {
        next(error)
    }
}

export const profileUpload = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.profilePic = `uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "file uploaded successfully"
    })
  } catch (error) {
    next(error)
  }
}
