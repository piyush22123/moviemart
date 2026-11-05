
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

const HeroBanner = ({ movies = [] }) => {
  // Handle empty movie data
  if (!Array.isArray(movies) || movies.length === 0) {
    return null;
  }

  // Select the last five movies
  const latestMovies = movies.slice(-5);

  return (
    <section className="relative h-[75vh] min-h-[400px] w-full overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={latestMovies.length > 1}
        autoplay={
          latestMovies.length > 1
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{
          clickable: true,
        }}
        className="hero-banner-swiper h-full w-full"
      >
        {latestMovies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <div className="relative h-full w-full overflow-hidden bg-zinc-900">
              {/* Background Image */}
              <img
                src={movie.posterLink}
                alt={movie.movieName || "Movie poster"}
                className="absolute inset-0 block h-full w-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

              {/* Movie Content */}
              <div className="relative z-10 flex h-full items-center px-6 md:px-16">
                <div className="max-w-2xl">
                  <p className="mb-4 text-lg font-semibold uppercase tracking-wide text-red-500">
                    Latest Uploads
                  </p>

                  <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
                    {movie.movieName}
                  </h1>

                  <p className="mb-8 line-clamp-3 text-base leading-relaxed text-zinc-300 md:text-lg">
                    {movie.storyline}
                  </p>

                  <Link
                    to={`/movie/${movie._id}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
                  >
                    <Info size={20} />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scoped Swiper Pagination Styles */}
      <style>
        {`
          .hero-banner-swiper .swiper-pagination {
            bottom: 20px;
          }

          .hero-banner-swiper .swiper-pagination-bullet {
            background: white;
            opacity: 0.5;
          }

          .hero-banner-swiper .swiper-pagination-bullet-active {
            width: 24px;
            border-radius: 20px;
            background: #ef4444;
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
};

export default HeroBanner;
