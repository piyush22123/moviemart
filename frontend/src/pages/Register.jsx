import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Username
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }

    // Email
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email");
      return false;
    }

    // Password
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Strong password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must contain uppercase, lowercase and number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", formData);

      toast.success(res.data.message || "Account created");

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-red-700/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-500 mb-2 tracking-wide">
            MovieMart
          </h1>

          <p className="text-zinc-400 text-sm">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="text-white! w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="text-white! w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Password</label>
            <div className="relative">
              <input
                type={hide ? "password" : "text"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="text-white! w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setHide(!hide)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                aria-label={hide ? "Show password" : "Hide password"}
              >
                {hide ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block mb-3 text-sm text-zinc-300">
              Select Role
            </label>

            <div className="flex items-center gap-6">
              {/* User */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                  className="accent-red-500"
                />

                <span className="text-zinc-300">User</span>
              </label>

              {/* Admin */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="accent-red-500"
                />

                <span className="text-zinc-300">Admin</span>
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition-all font-semibold text-white shadow-lg shadow-red-500/20"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
