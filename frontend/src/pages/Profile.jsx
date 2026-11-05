import { useState } from "react";
import { LogOut, User } from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/auth/logout");

    // Notify Navbar that the user has logged out.
    window.dispatchEvent(new Event("authChanged"));


      toast.success(
        res.data.message || "Logged out"
      );
      setOpen(false);
      navigate("/login");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center font-bold text-white"
      >
        {user?.username?.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-lg font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold">
                  {user?.username}
                </h3>

                <p className="text-sm text-zinc-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 transition-all"
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;