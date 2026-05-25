import categories from "../api/categories";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex sticky top-20 w-64 h-[calc(100vh-80px)] bg-zinc-950 border-r border-white/10 flex-col p-5">
      <h2 className="text-xl font-semibold mb-6 text-zinc-300">
        Categories
      </h2>

      <div className="flex flex-col gap-3">
        {categories.map((item, index) => (
          <Link to={`/movie/category/${item.name.toLowerCase()}`} 
            key={index}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-red-500 transition-all duration-300"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;