import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/scrollbar';


const HeroBanner = ({movies}) => {

  let latestMovies = (movies.length > 5)? movies.slice(movies.length-5) : movies;

  return (
    <section className="relative h-[75vh] w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="h-full"
      >
        {latestMovies.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[85vh] w-full">
              {/* Background Image */}
              <img
                src={movie.posterLink}
                alt={movie.movieName}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center px-6 md:px-16">
                <div className="max-w-2xl">
                  {/* Trending */}
                  <p className="text-red-500 font-semibold text-lg mb-4 tracking-wide uppercase">
                    Latest Uploads
                  </p>

                  {/* Title */}
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                    {movie.movieName}
                  </h1>

                  {/* Description */}
                  <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8">
                    {movie.storyline}
                  </p>

                    <Link to={`/movie/${movie._id}`}>
                    <button className="flex items-center gap-2 px-8 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                      <Info size={20} />
                      View Details
                    </button>
                    </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper Custom Styling */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: white;
            opacity: 0.5;
          }

          .swiper-pagination-bullet-active {
            background: #ef4444;
            opacity: 1;
            width: 24px;
            border-radius: 20px;
          }
        `}
      </style>
    </section>
  );
};

export default HeroBanner;