import User from "../models/User.js";
import Message from "../models/Message.js";

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select(
      "-password -refreshToken",
    );

    // count unseen messages
    const unSeenMessages = {};
    const promises = users.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        recieverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unSeenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      users,
      unSeenMessages,
    });
  } catch (error) {
    console.log("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: selectedUserId },
        { senderId: selectedUserId, recieverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, recieverId: myId },
      { seen: true },
    );
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

const markMessagesAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    return res.json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    console.log("Error marking message as seen:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark message as seen",
    });
  }
};

export  { getAllUsers, getMessages, markMessagesAsSeen };
