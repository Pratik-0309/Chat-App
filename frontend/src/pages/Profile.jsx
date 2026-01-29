import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const Profile = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("Hi Everyone, I am using SnapTalk");

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex-1 h-full flex items-center justify-center p-12">
      <div className="w-full max-w-4xl bg-[#120f23]/60 backdrop-blur-2xl text-gray-200 border border-white/10 flex flex-col md:flex-row items-center justify-between rounded-2xl shadow-2xl overflow-hidden min-h-125">
        {/* Left Side */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-8 md:p-14 flex-1 w-full"
        >
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Profile details
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              Update your display name and bio
            </p>
          </div>

          <label
            htmlFor="avatar"
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={
                  selectedImg
                    ? URL.createObjectURL(selectedImg)
                    : assets.avatar_icon
                }
                className="w-16 h-16 rounded-full object-cover border border-violet-500/50 group-hover:border-violet-400 transition-all shadow-lg"
                alt="Avatar"
              />
            </div>
            <span className="text-gray-400 text-sm group-hover:text-violet-400 transition-colors">
              upload profile image
            </span>
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpeg, .jpg"
              hidden
            />
          </label>

          <div className="flex flex-col gap-4">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="Your Name"
              className="w-full bg-[#120f23]/80 border border-white/10 rounded-lg px-4 py-3 outline-none text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
            <textarea
              required
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="Write profile bio"
              className="w-full bg-[#120f23]/80 border border-white/10 rounded-lg px-4 py-3 outline-none text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full md:w-max px-14 py-3 bg-linear-to-r from-violet-600 to-violet-500 text-white rounded-full text-md font-medium hover:brightness-110 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
          >
            Save
          </button>
        </form>

        {/* Right Side */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-black/10 h-full p-10 border-l border-white/5">
          <img
            className="w-full max-w-60 opacity-70 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            src={assets.logo_icon}
            alt="SnapTalk Logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
