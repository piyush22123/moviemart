import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SideBar from "../components/SideBar";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

import Pagination from "../components/Pagination";

const LIMIT = 12;

const Categorywise = ({ searchTerm = "" }) => {
  const { categoryName } = useParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalMovies: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Reset page when the category or search term changes
  useEffect(() => {
    setPage(1);
  }, [categoryName, searchTerm]);

  // Fetch category movies from the backend
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      setLoading(true);

      try {
        const response = await api.get(
          `/api/movie/category/${encodeURIComponent(categoryName)}`,
          {
            params: {
              page,
              limit: LIMIT,
              search: searchTerm.trim(),
            },
          }
        );

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
          console.error("Failed to fetch category movies:", error);
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
  }, [categoryName, page, searchTerm]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="flex items-start">
        <SideBar />

        <main className="min-w-0 flex-1 pt-20">
          <section className="px-4 py-12 md:px-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold md:text-3xl">
                {categoryName}
                {searchTerm.trim() && " - Search Results"}
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
                  ? "No movies match your search in this category."
                  : "No movies found in this category."}
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

export default Categorywise;