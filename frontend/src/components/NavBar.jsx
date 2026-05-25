import { useEffect, useState } from "react";
import categories from "../api/categories";
import api from "../api/axios";
import Profile from "../pages/Profile.jsx";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
} from "lucide-react";

const NavBar = ({searchTerm, setSearchTerm}) => {
  const [user, setUser] = useState(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [inputValue, setInputValue] = useState("");

const fetchUser = async () => {
    try {

      const res = await api.get(
        "/api/auth/me"
      );

      setUser(res.data.user);
      console.log(res.data.user)

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <nav className="text-white fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">

        <div className=" mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setMobileMenu(!mobileMenu)
              }
              className="lg:hidden"
            >
              {mobileMenu ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

            {/* Logo */}
            <Link to="/">
              <img src="/moviemart.png" alt="moviemart" className="w-25"/>
            </Link>
          </div>

          {/* Search */}
          <div className="text-white hidden md:flex items-center bg-zinc-900 rounded-full w-[400px] border border-zinc-800">

            <Search
              size={20}
              className="ms-3 text-zinc-400"
            />

            <input
              type="text"
              placeholder="Search movies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-transparent outline-none px-3 py-2 w-full text-sm"
            />

            <button
              onClick={() => setSearchTerm(inputValue)}
              className="bg-red-500 hover:bg-red-600 p-3 rounded-4xl text-sm"
            >Search</button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <Link to="/">
              <span>Home</span>
            </Link>

            {(user &&
              user.role === "admin") && (
                <Link to="/admin/dashboard">
                  Dashboard
                </Link>
              )}

            {!user ? (
              <Link to="/login">
                <span>Login</span>
              </Link>
            ) : (
              <Profile user={user} />
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-20 left-0 h-[calc(100vh-80px)] w-72 bg-zinc-950 border-r border-white/10 z-40 transform transition-transform duration-300 lg:hidden ${
          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="p-5">
          
          {/* Categories */}
          <div>

            <h2 className="text-xl font-semibold mb-5 text-zinc-300">
              Categories
            </h2>

            <div className="flex flex-col gap-3">

              {categories.map(
                (item, index) => (

                  <Link
                    key={index}
                    to={`/movie/category/${item.name.toLowerCase()}`}
                    onClick={() =>
                      setMobileMenu(false)
                    }
                    className="text-white flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-red-500 transition-all duration-300"
                  >

                    {item.icon}

                    <span>
                      {item.name}
                    </span>

                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;