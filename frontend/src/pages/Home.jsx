import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import MovieCard from "../components/MovieCard";
import HeroBanner from "../components/HeroBanner";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

import Pagination from "../components/Pagination.jsx";

const LIMIT = 5;

const Home = ({ searchTerm = "" }) => {
  const [movies, setMovies] = useState([]);
  const [bannerMovies, setBannerMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalMovies: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch banner movies independently of grid pagination and search
  useEffect(() => {
    const fetchBannerMovies = async () => {
      try {
        const response = await api.get("/api/movie", {
          params: { page: 1, limit: 5 },
        });

        setBannerMovies(response.data.movies || []);
      } catch (error) {
        console.error("Failed to fetch banner movies:", error);
      }
    };

    fetchBannerMovies();
  }, []);

  // Reset to the first page whenever the search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Fetch paginated movies from the backend
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      setLoading(true);

      try {
        const response = await api.get("/api/movie", {
          params: {
            page,
            limit: LIMIT,
            search: searchTerm.trim(),
          },
        });

        if (cancelled) return;

        setMovies(response.data.movies || []);
        setPagination(
          response.data.pagination || {
            currentPage: page,
            totalPages: 0,
            totalMovies: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch movies:", error);
          setMovies([]);
          setPagination({
            currentPage: 1,
            totalPages: 0,
            totalMovies: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [page, searchTerm]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="flex items-start">
        <SideBar />

        <main className="min-w-0 flex-1 pt-30">
          {/* Hero Banner */}
          <div className="m-5 overflow-hidden rounded-2xl">
            <HeroBanner movies={bannerMovies} />
          </div>

          {/* Movies Section */}
          <section className="px-4 py-12 md:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold md:text-3xl">
                {searchTerm.trim() ? "Search Results" : "Trending Movies"}
              </h2>

              {!loading && (
                <span className="text-sm text-zinc-400">
                  {pagination.totalMovies} movies
                </span>
              )}
            </div>

            {loading ? (
              <Loader />
            ) : movies.length === 0 ? (
              <div className="py-12 text-center text-zinc-400">
                {searchTerm.trim()
                  ? "No movies match your search."
                  : "No movies found."}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
                  {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <Pagination
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;