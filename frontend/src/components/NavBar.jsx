import { useEffect, useState } from "react";
import categories from "../api/categories";
import api from "../api/axios";
import Profile from "../pages/Profile.jsx";
import { Link, NavLink } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const NavBar = ({ searchTerm, setSearchTerm }) => {
  const [user, setUser] = useState(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
    } catch (error) {
      // If the user is not authenticated, clear the Navbar state.
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    // Check authentication when Navbar first mounts.
    fetchUser();

    // Recheck authentication whenever login/logout occurs.
    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  return (
    <>
      <nav className="text-white fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto px-4 md:px-8 py-3 md:h-20 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* TOP ROW: LOGO AND NAVIGATION */}
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            {/* LEFT: MENU AND LOGO */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden"
              >
                {mobileMenu ? <X size={28} /> : <Menu size={28} />}
              </button>

              <Link to="/">
                <img src="/moviemart.png" alt="moviemart" className="w-25" />
              </Link>
            </div>

            {/* RIGHT: NAVIGATION LINKS */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* HOME */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative py-2 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-red-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>

              {/* ADMIN DASHBOARD */}
              {user?.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `relative py-2 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>Dashboard</span>
                      <span
                        className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-red-500 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              )}

              {/* LOGIN / PROFILE */}
              {!user ? (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `relative py-2 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>Login</span>
                      <span
                        className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-red-500 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ) : (
                <Profile user={user} />
              )}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center bg-zinc-900 rounded-full w-full md:w-[400px] border border-zinc-800 text-white">
            <Search size={20} className="ms-3 text-zinc-400 shrink-0" />

            <input
              type="text"
              placeholder="Search movies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(inputValue);
                }
              }}
              className="bg-transparent outline-none px-3 py-2 w-full min-w-0 text-sm"
            />

            <button
              onClick={() => setSearchTerm(inputValue)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-20 left-0 h-[calc(100vh-80px)] w-72 bg-zinc-950 border-r border-white/10 z-40 transform transition-transform duration-300 lg:hidden ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          {/* Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-5 text-zinc-300">
              Categories
            </h2>

            <div className="flex flex-col gap-3">
              {categories.map((item, index) => (
                <Link
                  key={index}
                  to={`/movie/category/${item.name.toLowerCase()}`}
                  onClick={() => setMobileMenu(false)}
                  className="text-white flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-red-500 transition-all duration-300"
                >
                  {item.icon}

                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
