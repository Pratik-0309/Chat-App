import express from "express";
import {getAllUsers, getMessages, markMessagesAsSeen, sendMessage} from "../controller/message.controller.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/users", verifyAuth, getAllUsers);
router.get("/:id", verifyAuth, getMessages);
router.put("/seen/:id", verifyAuth, markMessagesAsSeen);
router.post("/send/:id", verifyAuth, sendMessage);

export default router;
