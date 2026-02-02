import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("bio", bio);
    if (selectedImg) {
      formData.append("profilePic", selectedImg);
    }
    await updateProfile(formData);
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
        {/* Right Side */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-black/10 h-full p-10 border-l border-white/5">
          <div className="relative w-60 h-60">
            {" "}
            <img
              className={`w-full h-full object-cover transition-all shadow-2xl ${
                selectedImg || user.profilePic
                  ? "rounded-full object-cover border-2 border-violet-300/30 p-1"
                  : "opacity-70"
              }`}
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : user.profilePic || assets.logo_icon
              }
              alt="Profile Preview"
            />
            {/* Optional: Glow effect for the circular profile */}
            {(selectedImg || user.profilePic) && (
              <div className="absolute inset-0 rounded-full blur-xl bg-violet-500/10 -z-10"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
