import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
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

      const res = await api.post("/api/auth/login", formData, {
        withCredentials: true,
      });

      // Notify Navbar that authentication has changed.
      window.dispatchEvent(new Event("authChanged"));

      toast.success(res.data.message || "Login successful");

      if (res.data.user.role == "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-red-500">
          MovieMart
        </h1>

        <p className="text-zinc-400 text-center mb-8">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="text-white! w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block mb-2 text-sm text-zinc-300">Password</label>

            <div className="relative">
              <input
                type={hide ? "password" : "text"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 pr-12 text-white outline-none focus:border-red-500"
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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 font-semibold hover:opacity-90 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* forgot password */}
          <p className="text-red-500">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
