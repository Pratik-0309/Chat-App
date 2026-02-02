import User from "../models/User.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../config/cloudinary.js";

const options = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
  path: "/",
};

const generateAccessAndRefreshToken = async (userId) => {
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
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

const userRegister = async (req, res) => {
  try {
    const { email, fullName, password, bio } = req.body;

    if (!email || !fullName || !password || !bio) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const user = await User.create({
      email,
      fullName,
      password,
      bio,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User registered successfully",
        accessToken,
        user,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      success: false,
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in successfully",
        accessToken,
        user: loggedInUser,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
      error: error.message,
    });
  }
};

const authUser = async(req,res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password -refreshToken");
    return res.status(200).json({
      success: true,
      message: "User authenticated",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error authenticating user",
      error: error.message,
    });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;
    const profilePic = req.file;
    const userId = req.user._id;

    if (!fullName && !bio && !profilePic) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update profile" });
    }

    const updatedData = {};
    if (fullName) updatedData.fullName = fullName;
    if (bio) updatedData.bio = bio;

    if (profilePic) {
      const uploadResult = await uploadOnCloudinary(profilePic.path);
      if (!uploadResult) {
        return res
          .status(400)
          .json({ message: "Failed to upload profile picture" });
      }
      updatedData.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    return res.status(200).json({
      user: updatedUser,
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Error Upadating Profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userLogout = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { userLogin, userRegister, refreshAccessToken,authUser, updateProfile, userLogout };
