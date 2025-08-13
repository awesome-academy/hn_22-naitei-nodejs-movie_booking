import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) {
    return null;
  }

  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
    scrollTo(0, 0);
  };

  const formatGenres = () => {
    if (!movie.genre) return "";
    return movie.genre;
  };

  const formatYear = () => {
    if (!movie.releaseDate) return "";
    return new Date(movie.releaseDate).getFullYear();
  };

  const formatRuntime = () => {
    if (!movie.durationMinutes) return "";
    return timeFormat(movie.durationMinutes);
  };

  const formatRating = () => {
    if (!movie.vote_average) return "0.0";
    return movie.vote_average.toFixed(1);
  };

  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl
    hover:-translate-y-1 transition duration-300 w-66"
    >
      <img
        onClick={handleClick}
        src={movie.posterUrl || "https://via.placeholder.com/300x200"}
        alt={movie.title || "Movie"}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {formatYear()} • {formatGenres()} • {formatRuntime()}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={handleClick}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull 
        transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {formatRating()}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
