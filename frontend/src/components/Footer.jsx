import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-red-500/10 text-white">

      <div className=" px-6 md:px-10 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo + Description */}
          <div>
            <Link to="/">
              <img src="/moviemart.png" alt="moviemart" className="w-25"/>
            </Link>

            <p className="text-zinc-400 mt-3 max-w-md text-sm leading-relaxed">
              Discover trending movies, explore categories,
              and download movies with MovieMart.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 text-sm text-zinc-300">

            <a
              href="/"
              className="hover:text-red-500 transition"
            >
              Home
            </a>

            <a
              href="/login"
              className="hover:text-red-500 transition"
            >
              Login
            </a>

            <a
              href="/register"
              className="hover:text-red-500 transition"
            >
              Register
            </a>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">

          <p>
            © {new Date().getFullYear()} MovieMart. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Made with
            <span className="text-red-500 text-base">♥</span>
            by
            <span className="text-red-500 font-medium">
              Piyush
            </span>
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;