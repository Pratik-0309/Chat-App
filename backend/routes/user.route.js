import express from "express";
import { userLogin, userRegister, refreshAccessToken, updateProfile, userLogout} from "../controller/user.controller.js";
import verifyAuth from "../middleware/verifyAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/refresh-token", refreshAccessToken);
router.put("/profile", verifyAuth, upload.single("profilePic"), updateProfile);
router.post("/logout", verifyAuth, userLogout);

export default router;