import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import api from "../../api/axios";
import AdminMovieCard from "../../components/AdminMovieCard";
import Loader from "../../components/Loader";

const Dashboard = ({searchTerm}) => {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  let filteredMovies = searchTerm
    ? movies.filter((movie) =>
        movie.movieName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : movies;

  const fetchMovies = async () => {

    try {

      const response = await api.get("/api/movie");

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

  const deleteMovie = async (movieId) => {

    try {

      await api.delete(`/api/movie/delete/${movieId}`);

      setMovies((prev) =>
        prev.filter((movie) => movie._id !== movieId)
      );

    } catch (error) {

      console.log(error);
    }
  };


  if (loading) {
    return <Loader/>;  
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <div className="pt-20 flex items-center justify-between mb-10">

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        {/* Add Movie Button */}
        <Link to="/admin/upload">

          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition-all font-semibold shadow-lg shadow-red-500/20">

            <Plus size={20} />

            Add Movie

          </button>

        </Link>

      </div>

      {loading ? (

        <div className="text-center text-zinc-400">
          Loading movies...
        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">

          {filteredMovies.map((movie) => (

            <AdminMovieCard
              key={movie._id}
              movie={movie}
              onDelete={deleteMovie}
            />

          ))}

        </div>
      )}
    </div>
  );
};

export default Dashboard;