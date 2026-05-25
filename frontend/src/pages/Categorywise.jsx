import {useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import SideBar from '../components/SideBar';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const Categorywise = ({searchTerm}) => {
 const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);


  let filteredMovies = searchTerm
    ? movies.filter((movie) =>
        movie.movieName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : movies;

  const { categoryName } = useParams();

  const fetchMovies = async () => {
    try {
      const response = await api.get(`/api/movie/category/${categoryName}`);

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
  }, [categoryName]);


  if (loading) {
    return <Loader/>;  
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <SideBar />

      <div className="lg:ml-64 pt-20">
        {/* Trending Movies */}
        <section className="px-4 md:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {categoryName}
            </h2>

            <button className="text-red-500 hover:underline">
              View All
            </button>
          </div>

          {loading ? (
            <div className="text-center text-zinc-400">
              Loading movies...
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center text-zinc-400">
              No movies found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Categorywise;
