import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/api.config";

import bg1 from "../images/bgImage1-BgVBBcls.jpg";
import bg2 from "../images/bgImage2-CSvQeVNX.jpg";
import bg3 from "../images/bgImage3-BTY6Sz_K.jpg";
import bg4 from "../images/bgImage4-L1QELaMd.jpg";

const CAROUSEL_IMAGES = [bg1, bg2, bg3, bg4];

const STATS = [
  { value: "2.5M+", label: "Successful Deliveries", color: "text-orange-500" },
  { value: "500K+", label: "Happy Customers", color: "text-pink-500" },
  { value: "5K+", label: "Partner Restaurants", color: "text-orange-500" },
  { value: "1K+", label: "Delivery Partners", color: "text-pink-500" },
];

const TESTIMONIALS = [
  { text: "Amazing service and super fast delivery. Highly recommended!", name: "Rahul Sharma", role: "Food Enthusiast" },
  { text: "Great variety of restaurants and easy ordering experience.", name: "Priya Patel", role: "Regular Customer" },
  { text: "Food arrived hot and fresh. Loved the experience!", name: "Aman Verma", role: "Loyal Customer" },
];

// Skeleton card for loading state
const RestaurantSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded-xl mt-4" />
    </div>
  </div>
);

function Home() {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLogin } = useAuth();

  // Auto-advance carousel
  const next = useCallback(() => setCurrent((c) => (c + 1) % CAROUSEL_IMAGES.length), []);
  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  // Fetch restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/public/restaurants");
        setRestaurants(res.data.data || []);
      } catch {
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(isLogin ? `/customer-dashboard?search=${encodeURIComponent(searchQuery.trim())}` : "/login");
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      {/* ─── HERO CAROUSEL ─── */}
      <section className="relative h-[92vh] overflow-hidden">
        {/* Slides */}
        {CAROUSEL_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70 z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight drop-shadow-lg">
            Your Favorite Food,<br />
            <span className="text-orange-400">Delivered Fast</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
            Order from the best local restaurants and get it delivered hot to your doorstep.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl bg-white rounded-2xl flex items-center px-5 py-3 shadow-2xl mb-10 gap-3"
          >
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base"
              aria-label="Search restaurants or dishes"
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors duration-200 text-sm"
            >
              Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
            >
              Order Now
            </Link>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {CAROUSEL_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-8 h-2.5 bg-orange-500" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── FEATURED RESTAURANTS ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Discover</span>
          <h2 className="text-4xl font-bold mt-1 text-gray-900">Featured Restaurants</h2>
          <p className="text-gray-500 mt-3">Fresh picks from our best restaurant partners</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => <RestaurantSkeleton key={n} />)}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl font-medium text-gray-500">No restaurants available yet.</p>
            <p className="text-sm mt-2">Check back soon — great food is on its way!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  {r.coverImage?.url ? (
                    <img
                      src={r.coverImage.url}
                      alt={r.restaurantName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                      <span className="text-5xl">🍽️</span>
                    </div>
                  )}
                  {/* Open/Closed badge */}
                  <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      r.isOpen ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    {r.isOpen ? "● Open" : "○ Closed"}
                  </span>
                  {/* Rating badge */}
                  {r.averageRating > 0 && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      ⭐ {r.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{r.restaurantName}</h3>
                  {r.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{r.description}</p>
                  )}
                  {/* Cuisine Tags */}
                  {r.cuisineTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {r.cuisineTypes.slice(0, 3).map((c) => (
                        <span key={c} className="bg-orange-50 text-orange-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-orange-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => navigate(isLogin ? "/customer-dashboard" : "/login")}
                    className="mt-auto w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200"
                  >
                    Explore Menu →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12 text-gray-900">
            Cravings By The Numbers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, color }) => (
              <div key={label} className="bg-gray-50 border border-gray-100 shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition-shadow duration-200">
                <h3 className={`text-4xl font-extrabold ${color}`}>{value}</h3>
                <p className="text-gray-600 mt-2 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
          <h2 className="text-4xl font-bold mt-1 mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📍", step: "01", title: "Choose Location", desc: "Enter your delivery address to find nearby restaurants." },
              { icon: "🛒", step: "02", title: "Pick Your Meal", desc: "Browse menus, choose your favorites, and add to cart." },
              { icon: "🚀", step: "03", title: "Fast Delivery", desc: "Track your order live and get it delivered to your door." },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center">
                <div className="text-4xl mb-3">{icon}</div>
                <span className="text-orange-500 font-bold text-sm mb-2">{step}</span>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Reviews</span>
            <h2 className="text-4xl font-bold mt-1 text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ text, name, role }) => (
              <div key={name} className="bg-orange-50 border border-orange-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-orange-400 text-2xl mb-3">"</div>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700 text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER CTA ─── */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Become a Restaurant Partner</h2>
          <p className="text-lg text-orange-100 mb-8">
            Grow your business with Cravings and reach thousands of hungry customers.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200 shadow-lg"
          >
            Partner With Us →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
