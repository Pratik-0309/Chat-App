import User from "../models/User.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
  path: "/",
};

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error("Token generation failed");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Token generation error: " + error.message);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Access token refreshed successfully",
        accessToken,
        success: true,
      });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error refreshing access token" });
  }
};


