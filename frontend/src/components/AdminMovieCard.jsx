import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const AdminMovieCard = ({ movie, onDelete }) => {

  return (
    <div className="bg-[#111111] rounded-[28px] p-3 border border-white/5 overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-red-500/20">

      {/* Poster */}
      <div className="overflow-hidden rounded-2xl">

        <img
          src={movie.posterLink}
          alt={movie.movieName}
          className="w-full h-72 object-cover"
        />

      </div>

      {/* Content */}
      <div className="pt-4">

        <h2 className="text-xl font-bold uppercase truncate mb-2">
          {movie.movieName}
        </h2>

        <p className="text-zinc-400 text-sm line-clamp-2 mb-5">
          {movie.storyline}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">

          <Link
            to={`/admin/update/${movie._id}`}
            className="flex-1"
          >

            <button className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2">

              <Pencil size={18} />

              Edit

            </button>

          </Link>

          <button
            onClick={() => onDelete(movie._id)}
            className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 transition-all font-semibold flex items-center justify-center gap-2"
          >

            <Trash2 size={18} />

            Delete

          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminMovieCard;