import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api.config";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import NoDataFound from "../components/NoDataFound";
import defaultRestaurantImage from "../images/foodTable.webp";
import {
  IoSearch,
  IoLocationOutline,
  IoTimeOutline,
  IoStar,
  IoStorefrontOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { FaLeaf, FaDrumstickBite, FaUtensils } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const RESTAURANT_TYPES = [
  { value: "all", label: "All" },
  { value: "veg", label: "Veg", icon: <FaLeaf className="text-green-500" /> },
  {
    value: "non-veg",
    label: "Non-Veg",
    icon: <FaDrumstickBite className="text-red-500" />,
  },
  {
    value: "vegan",
    label: "Vegan",
    icon: <FaLeaf className="text-green-600" />,
  },
  {
    value: "jain",
    label: "Jain",
    icon: <FaLeaf className="text-orange-500" />,
  },
  {
    value: "both",
    label: "Veg & Non-Veg",
    icon: <MdOutlineRestaurantMenu className="text-purple-500" />,
  },
];

const typeStyles = {
  veg: "bg-green-50 text-green-700 border-green-200",
  "non-veg": "bg-red-50 text-red-700 border-red-200",
  vegan: "bg-green-50 text-green-800 border-green-200",
  jain: "bg-orange-50 text-orange-700 border-orange-200",
  both: "bg-purple-50 text-purple-700 border-purple-200",
};

const typeLabels = {
  veg: "Pure Veg",
  "non-veg": "Non-Veg",
  vegan: "Vegan",
  jain: "Jain",
  both: "Veg & Non-Veg",
};

const OrderNow = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/public/restaurants");
      setRestaurants(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch restaurants. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        r.restaurantName?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q) ||
        r.cuisineTypes?.some((c) => c.toLowerCase().includes(q));
      const matchType =
        selectedType === "all" || r.restaurantType === selectedType;
      const matchOpen = !showOpenOnly || r.isOpen;
      return matchSearch && matchType && matchOpen;
    });
  }, [restaurants, searchQuery, selectedType, showOpenOnly]);

  if (isLoading) return <Loader height="100vh" width="100%" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-700 via-orange-600 to-orange-800 text-white px-5 py-14 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3">
            <FaUtensils className="text-xs" />
            Cravings — Order Now
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow">
            Hungry? <span className="text-yellow-300">We've got you.</span>
          </h1>
          <p className="text-sm md:text-base text-orange-100 mb-6 max-w-xl mx-auto">
            Discover the best restaurants around you and get your favorite meals delivered fresh.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {restaurants.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                <IoStorefrontOutline />
                {restaurants.length} Restaurants
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                <IoCheckmarkCircleOutline className="text-green-300" />
                {restaurants.filter((r) => r.isOpen).length} Open Now
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-15 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex flex-wrap items-center gap-2">
          {RESTAURANT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition font-semibold ${
                selectedType === type.value
                  ? "bg-orange-700 text-white border-orange-700"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
              }`}
            >
              {type.icon}
              {type.label}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="accent-orange-700 w-3.5 h-3.5"
            />
            Open Now Only
          </label>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/restaurant-details/${restaurant._id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={restaurant?.coverImage?.url || defaultRestaurantImage}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      restaurant.isOpen
                        ? "bg-green-500 text-white"
                        : "bg-black/60 text-white"
                    }`}
                  >
                    {restaurant.isOpen ? "● Open" : "● Closed"}
                  </span>

                  {restaurant.averageRating > 0 && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-yellow-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                      <IoStar className="text-[11px]" />
                      {restaurant.averageRating.toFixed(1)}
                    </span>
                  )}

                  {restaurant.restaurantType && (
                    <span
                      className={`absolute bottom-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        typeStyles[restaurant.restaurantType] ||
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {typeLabels[restaurant.restaurantType] ||
                        restaurant.restaurantType}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-gray-900 truncate mb-1 group-hover:text-orange-700 transition-colors">
                    {restaurant.restaurantName}
                  </h2>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {restaurant.description || "Fresh & delicious meals cooked daily."}
                  </p>

                  {restaurant.cuisineTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {restaurant.cuisineTypes.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-2.5 py-0.5 bg-orange-50 text-orange-700 font-medium rounded-full border border-orange-100"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                    {(restaurant.city || restaurant.address) && (
                      <span className="flex items-center gap-1 truncate">
                        <IoLocationOutline className="shrink-0 text-orange-600" />
                        {restaurant.city || restaurant.address}
                      </span>
                    )}
                    {restaurant.servingHours?.openingTime && (
                      <span className="flex items-center gap-1 shrink-0">
                        <IoTimeOutline className="shrink-0 text-orange-600" />
                        {restaurant.servingHours.openingTime} –{" "}
                        {restaurant.servingHours.closingTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoDataFound height="300px" text="No Restaurants Found" />
        )}
      </div>
    </div>
  );
};

export default OrderNow;
