import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [ msgImages, setMsgImages ] = useState([]);

  // Get all images from messages
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return <div className="hidden lg:block w-80"></div>;

  return (
    <div className="hidden lg:flex flex-col w-80 border-l border-white/5 bg-black/10 backdrop-blur-xl h-full overflow-y-auto custom-scrollbar">
      {/* User Profile Info Section */}
      <div className="flex flex-col items-center p-8 text-center border-b border-white/5">
        <div className="relative mb-4">
          <img
            src={selectedUser.profilePic}
            alt={selectedUser.fullName}
            className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/30 p-1"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-4 border-[#121212] rounded-full"></span>
          )}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {selectedUser.fullName}
        </h2>
        <p className="text-sm text-gray-400 mt-1 px-4 leading-relaxed">
          {selectedUser.bio || "Hi Everyone, I am Using SnapTalk"}
        </p>
      </div>

      {/* Shared Media Gallery Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/80">Shared Media</h3>
        </div>

        {/* Grid layout matching the theme style */}
        <div className="grid grid-cols-3 gap-2">
          {msgImages.map((img, index) => (
            <div
              onClick={() => window.open(img)}
              key={index}
              className="aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-violet-500/50 transition-all cursor-pointer group"
            >
              <img
                src={img}
                alt={`media-${index}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=> logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2
          bg-linear-to-r from-purple-400 to-violet-600 text-white border-none
          text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
