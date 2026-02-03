import { Children, createContext, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";
import axiosInstance from "../lib/axiosInstance.js";
import toast from "react-hot-toast";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (UserId) => {
    try {
      const { data } = await axiosInstance.get(`/api/messages/${UserId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/messages/send/${selectedUser?._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to subscribe messages for selected user
  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axiosInstance.put(`/api/messages/seen/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // function to subscribe messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    getUsers,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
