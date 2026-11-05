import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {

  const [imdb, setImdb] = useState(null);

  const fetchIMDB = async () => {

    try {

      const imdbres = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbId}&apikey=${import.meta.env.VITE_OMDB_KEY}`
      );

      const imdbData = await imdbres.json();

      setImdb(imdbData);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchIMDB();
  }, [movie.imdbId]);

  return (

    <div className="bg-[#111111] rounded-[28px] p-3 border border-white/5 overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-red-500/20">

      {/* Poster */}
      <div className="relative overflow-hidden rounded-2xl">

        <img
          src={movie.posterLink}
          alt={movie.movieName}
          className="w-full h-72 object-cover"
        />

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg">

          <Star
            size={14}
            fill="#facc15"
            className="text-yellow-400"
          />

          <span className="text-yellow-400 text-xs font-semibold">
            {imdb?.imdbRating}
          </span>

        </div>
      </div>

      {/* Content */}
      <div className="pt-4">

        {/* Title */}
        <h2 className="text-white font-bold text-xl uppercase leading-tight truncate">
          {movie.movieName}
        </h2>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mt-2 mb-5">

          {imdb?.Genre
            ?.split(",")
            .slice(0, 3)
            .map((genre, index) => (

              <span
                key={index}
                className="text-zinc-400 text-sm"
              >
                {genre.trim()}
              </span>

            ))}

        </div>

        {/* Button */}
        <Link to={`/movie/${movie._id}`}>

          <button className="w-full py-3 rounded-4xl bg-gradient-to-r from-zinc-800 to-zinc-700 border border-white hover:border-red-600 transition-all duration-300 font-semibold text-white">

            View Details

          </button>

        </Link>
      </div>
    </div>
  );
};

export default MovieCard;