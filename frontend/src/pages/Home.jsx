import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import MovieCard from "../components/MovieCard";
import HeroBanner from "../components/HeroBanner";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const Home = ({ searchTerm }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  let filteredMovies = searchTerm
    ? movies.filter((movie) =>
        movie.movieName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : movies;

  const fetchMovies = async () => {
    try {
      const response = await api.get("/api/movie");

      console.log(response.data);

      setMovies(response.data.movies || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="flex items-start">
        <SideBar />

        <div className="flex-1 pt-20">
          {/* Hero Section */}
          <section className="m-5 relative overflow-hidden rounded-2xl">
            <HeroBanner movies={movies} />
          </section>

          {/* Trending Movies */}
          <section className="px-4 md:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Trending Movies</h2>
            </div>

            {movies.length === 0 ? (
              <div className="text-center text-zinc-400">No movies found</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies?.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
