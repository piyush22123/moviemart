const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../utilities/mailer");
const crypto = require("crypto");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utilities/tokenGenerator");

const registerUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (isUserExist) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashed,
    role,
  });

  // generate tokens and store refreshtoken in user database
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save(); // save the updated user database

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Registered sucessfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login sucessfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Invalidate the refresh token in the database
    if (refreshToken) {
      await userModel.findOneAndUpdate(
        { refreshToken },
        { $set: { refreshToken: null } },
      );
    }

    // Cookie options should match those used when setting the cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };

    // Clear authentication cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.refreshToken !== token) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    // Return the same response whether the account exists or not.
    const message =
      "If an account exists for this email, a reset link will be sent.";

    if (!user) {
      return res.status(200).json({ message });
    }

    // generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the SHA-256 hash in the database.
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes.
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // generate a resent link containing resetToken
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset Your Password",
        html: `
        
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset Your Password - MovieMart</title>
          </head>

          <body style="margin:0; padding:0; background-color:#09090b; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="background-color:#09090b; padding:40px 15px;">
              <tr>
                <td align="center">

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    style="max-width:520px; background-color:#18181b; border:1px solid #27272a; border-radius:16px; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding:32px 20px 24px;">

                        <!-- MovieMart Logo -->
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-left:12px; font-size:27px; font-weight:bold; color:#ffffff; letter-spacing:-1px;">
                              Movie<span style="color:#ef4444;">Mart</span>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:14px 0 0; color:#a1a1aa; font-size:13px; letter-spacing:1.5px; text-transform:uppercase;">
                          Your Movie Experience, Reimagined
                        </p>

                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding:0 32px;">
                        <div style="height:1px; background-color:#3f3f46;"></div>
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="padding:36px 32px 20px;">

                        <p style="margin:0 0 12px; color:#ef4444; font-size:13px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase;">
                          Account Security
                        </p>

                        <h1 style="margin:0 0 18px; color:#ffffff; font-size:29px; line-height:1.3;">
                          Reset Your Password
                        </h1>

                        <p style="margin:0 0 16px; color:#d4d4d8; font-size:15px; line-height:1.8;">
                          Hello,
                        </p>

                        <p style="margin:0 0 24px; color:#a1a1aa; font-size:15px; line-height:1.8;">
                          We received a request to reset your MovieMart account password.
                          Click the button below to create a new password and get back to enjoying your favorite movies.
                        </p>

                        <!-- Reset Button -->
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center" style="padding:8px 0 28px;">
                              <a href="${resetUrl}"
                                style="display:inline-block; background-color:#ef4444; color:#ffffff; padding:15px 35px; font-size:15px; font-weight:bold; text-decoration:none; border-radius:8px;">
                                Reset My Password &nbsp; &#8594;
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Expiry Notice -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                          style="background-color:#27272a; border-radius:10px;">
                          <tr>
                            <td style="padding:16px;">
                              <p style="margin:0 0 6px; color:#fbbf24; font-size:14px; font-weight:bold;">
                                &#9200; Link expires in 15 minutes
                              </p>

                              <p style="margin:0; color:#a1a1aa; font-size:13px; line-height:1.7;">
                                For your security, this password reset link can only be used for a limited time.
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- Security Notice -->
                        <p style="margin:26px 0 12px; color:#a1a1aa; font-size:13px; line-height:1.8;">
                          If the button doesn't work, copy and paste the following link into your browser:
                        </p>

                        <p style="margin:0 0 24px; font-size:12px; line-height:1.8; word-break:break-all;">
                          <a href="${resetUrl}" style="color:#f87171; text-decoration:underline;">
                            ${resetUrl}
                          </a>
                        </p>

                        <p style="margin:0 0 12px; color:#a1a1aa; font-size:13px; line-height:1.8;">
                          Didn't request a password reset? No worries! You can safely ignore this email. Your password will remain unchanged.
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center"
                        style="padding:24px 20px; background-color:#09090b; border-top:1px solid #27272a;">

                        <p style="margin:0 0 8px; color:#ffffff; font-size:15px; font-weight:bold;">
                          Movie<span style="color:#ef4444;">Mart</span>
                        </p>

                        <p style="margin:0 0 12px; color:#71717a; font-size:12px; line-height:1.7;">
                          Your next favorite movie is just a click away.
                        </p>

                        <p style="margin:0; color:#52525b; font-size:11px; line-height:1.7;">
                          This is an automated email. Please do not reply to this message.
                        </p>

                        <p style="margin:12px 0 0; color:#52525b; font-size:11px;">
                          &copy; ${new Date().getFullYear()} MovieMart. All rights reserved.
                        </p>

                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `,
      });
    } catch (emailError) {
      // Don't leave a valid token behind if email delivery fails.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw emailError;
    }
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Unable to process your request. Please try again.",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Both password fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // generate same hash with that token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find user which contains that hash
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if no hash token matches or reset time out then give error
    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    // Assign the new password and save the document.
    // Your existing password-hashing middleware must hash it.
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Unable to reset password. Please try again.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
};
