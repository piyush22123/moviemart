import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Download } from "lucide-react";

import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const MovieDetails = () => {
  const { movieId } = useParams();

  const [movie, setMovie] = useState(null);
  const [imdb, setImdb] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/api/movie/${movieId}`);

      const movieData = res.data.movie;
      setMovie(res.data.movie);

      const imdbres = await fetch(
        `https://www.omdbapi.com/?i=${movieData.imdbId}&apikey=${import.meta.env.VITE_OMDB_KEY}`,
      );

      const imdbData = await imdbres.json();
      console.log(imdbData);
      setImdb(imdbData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return <Loader />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-red-500 text-2xl">
        Movie not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="pt-20 max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={movie.posterLink}
              alt={movie.movieName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Movie Data */}
          <div className="mt-8">
            <h3 className="text-zinc-400 text-lg mb-4">Data</h3>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-zinc-900 rounded-full text-sm">
                {imdb.Year}
              </span>

              <span className="px-4 py-2 bg-zinc-900 rounded-full text-sm">
                {imdb.Type}
              </span>

              <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                {imdb.imdbRating} IMDb
              </span>
            </div>
          </div>

          {/* Genres */}
          <div className="mt-8">
            <h3 className="text-zinc-400 text-lg mb-4">Genre</h3>

            <div className="flex flex-wrap gap-3">
              {imdb.Genre?.split(",").map((genre, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-zinc-900 text-sm border border-white/10"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-3">
            {imdb.Title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-zinc-400">{imdb.Year}</span>

            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={18} fill="yellow" />
              <span className="font-semibold">{imdb.imdbRating} IMDb</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-3 mb-8">
            {imdb.Genre?.split(",").map((genre, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-zinc-900 text-sm border border-white/10"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Storyline */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Storyline</h2>

            <p className="text-zinc-400 leading-relaxed">{movie.storyline}</p>
          </div>

          {/* Screenshots */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {movie.screenshots.map((item, idx) => (
              <img
                key={idx}
                src={item}
                className="rounded-2xl h-32 w-full object-cover"
              />
            ))}
          </div>

          {/* Download Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <a
              href={movie.downloadLinks[0]}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all text-center p-4 rounded-2xl font-bold"
            >
              <Download />
              <span>DOWNLOAD 480p</span>
            </a>

            <a
              href={movie.downloadLinks[1]}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all text-center p-4 rounded-2xl font-bold"
            >
              <Download />
              <span>DOWNLOAD 720p</span>
            </a>

            <a
              href={movie.downloadLinks[2]}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all text-center p-4 rounded-2xl font-bold"
            >
              <Download />
              <span>DOWNLOAD 1080p</span>
            </a>
          </div>

          <h3 className="text-zinc-400 text-lg mb-4">Cast</h3>

          <div className="flex flex-wrap gap-3">
            {imdb?.Actors?.split(",").map((actor, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-sm"
              >
                {actor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
