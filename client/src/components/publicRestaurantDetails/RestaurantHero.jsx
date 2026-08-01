import { IoArrowBack, IoStar } from "react-icons/io5";
import defaultBg from "../../assets/hero.png";

const RestaurantHero = ({ restaurant, onBack }) => {
  const coverUrl = restaurant?.coverImage?.url || defaultBg;

  return (
    <div className="relative h-64 md:h-80 overflow-hidden bg-gray-900 text-white">
      <img
        src={coverUrl}
        alt={restaurant.restaurantName}
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <button
        onClick={onBack}
        className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold transition"
      >
        <IoArrowBack className="text-base" /> Back
      </button>

      <div className="absolute bottom-6 left-5 right-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-3 z-10">
        <div>
          <span
            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${
              restaurant.isOpen ? "bg-green-500 text-white" : "bg-gray-600 text-white"
            }`}
          >
            {restaurant.isOpen ? "● Open Now" : "● Closed"}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow">
            {restaurant.restaurantName}
          </h1>
          {restaurant.cuisineTypes?.length > 0 && (
            <p className="text-xs md:text-sm text-gray-200 mt-1">
              {restaurant.cuisineTypes.join(" • ")}
            </p>
          )}
        </div>

        {restaurant.averageRating > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full text-sm font-bold shadow">
            <IoStar />
            <span>{restaurant.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantHero;
