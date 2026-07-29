import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/api.config";

import bg1 from "../images/bgImage1-BgVBBcls.jpg";
import bg2 from "../images/bgImage2-CSvQeVNX.jpg";
import bg3 from "../images/bgImage3-BTY6Sz_K.jpg";
import bg4 from "../images/bgImage4-L1QELaMd.jpg";

const CAROUSEL_IMAGES = [bg1, bg2, bg3, bg4];

const STATS = [
  { value: "2.5M+", label: "Successful Deliveries", desc: "Orders delivered with care and precision", color: "text-orange-600" },
  { value: "500K+", label: "Happy Customers", desc: "Satisfied users enjoying delicious food", color: "text-pink-500" },
  { value: "5K+", label: "Partner Restaurants", desc: "Restaurants serving amazing cuisine", color: "text-orange-600" },
  { value: "1K+", label: "Active Delivery Partners", desc: "Riders ensuring quick and safe delivery", color: "text-pink-500" },
];

const TESTIMONIALS = [
  {
    title: "Amazing Service!",
    text: "\"The food arrived hot and fresh. The delivery was incredibly fast. Highly impressed with Cravings' service!\"",
    name: "Khushi",
    initials: "KV",
    role: "Verified Buyer",
    avatarBg: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  {
    title: "Best App Ever!",
    text: "\"Easy to use interface, wide variety of restaurants, and quick delivery. I order from Cravings every week!\"",
    name: "Mann",
    initials: "MV",
    role: "Verified Buyer",
    avatarBg: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
  {
    title: "Excellent Choices",
    text: "\"Love the variety of restaurants available. Found my new favorite spot through Cravings. Definitely worth it!\"",
    name: "Niyati",
    initials: "NK",
    role: "Verified Buyer",
    avatarBg: "bg-gradient-to-br from-orange-600 to-amber-500",
  },
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

// Scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Home() {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLogin } = useAuth();

  // Reveal refs
  const [restaurantsRef, restaurantsVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [howRef, howVisible] = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  // Auto-advance carousel
  const next = useCallback(() => setCurrent((c) => (c + 1) % CAROUSEL_IMAGES.length), []);
  useEffect(() => {
    const timer = setInterval(next, 5000);
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight drop-shadow-lg animate-fade-up">
            Your Favorite Food,<br />
            <span className="text-shimmer">Delivered Fast</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate-fade-up delay-200">
            Order from thousands of restaurants and get it delivered to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center mb-8 animate-fade-up delay-300">
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-3 rounded-lg transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-10 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Order Now
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-3xl bg-white/95 rounded-xl flex items-center px-5 py-3.5 shadow-2xl gap-3 animate-fade-up delay-400 hover:shadow-orange-200/40 transition-shadow duration-300"
          >
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent"
              aria-label="Search restaurants or dishes"
            />
          </form>
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
      <section ref={restaurantsRef} className="py-20 px-6 max-w-7xl mx-auto">
        <div className={`text-center mb-12 ${restaurantsVisible ? "animate-fade-up" : "opacity-0"}`}>
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
            <div className="text-6xl mb-4 animate-float inline-block">🍽️</div>
            <p className="text-xl font-medium text-gray-500">No restaurants available yet.</p>
            <p className="text-sm mt-2">Check back soon — great food is on its way!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((r, idx) => (
              <div
                key={r._id}
                className={`bg-white rounded-2xl shadow-md overflow-hidden shimmer-card flex flex-col
                  hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300
                  ${restaurantsVisible ? `animate-fade-up delay-${Math.min((idx + 1) * 100, 500)}` : "opacity-0"}`}
              >
                {/* Cover Image */}
                <div className="relative h-52 bg-gray-100 overflow-hidden group">
                  {r.coverImage?.url ? (
                    <img
                      src={r.coverImage.url}
                      alt={r.restaurantName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                      <span className="text-6xl animate-float inline-block">🍽️</span>
                    </div>
                  )}
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Open/Closed badge */}
                  <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      r.isOpen ? "bg-green-500 text-white badge-open" : "bg-gray-500 text-white"
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
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{r.restaurantName}</h3>
                  {r.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{r.description}</p>
                  )}
                  {/* Cuisine Tags */}
                  {r.cuisineTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {r.cuisineTypes.slice(0, 3).map((c) => (
                        <span key={c} className="bg-orange-50 text-orange-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-orange-100 hover:bg-orange-100 transition-colors cursor-default">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => navigate(isLogin ? "/customer-dashboard" : "/login")}
                    className="mt-auto w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow hover:shadow-orange-400/40"
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
      <section ref={statsRef} className="bg-orange-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-12 ${statsVisible ? "animate-fade-up" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-gray-900">Cravings by the Numbers</h2>
            <p className="text-gray-500 mt-3 text-sm">See why millions trust us for their daily food delivery needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, desc, color }, idx) => (
              <div
                key={label}
                className={`bg-white border border-gray-100 shadow-sm rounded-2xl p-6 text-center
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group
                  ${statsVisible ? `animate-pop-in delay-${(idx + 1) * 100}` : "opacity-0"}`}
              >
                <h3 className={`text-3xl font-extrabold ${color} group-hover:scale-110 transition-transform duration-200 inline-block`}>{value}</h3>
                <p className="text-gray-900 mt-2 font-bold text-sm">{label}</p>
                <p className={`mt-1 text-xs leading-relaxed ${color}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section ref={howRef} className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className={howVisible ? "animate-fade-up" : "opacity-0"}>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl font-bold mt-1 mb-12 text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📍", step: "01", title: "Choose Location", desc: "Enter your delivery address to find nearby restaurants.", anim: "animate-slide-left" },
              { icon: "🛒", step: "02", title: "Pick Your Meal", desc: "Browse menus, choose your favorites, and add to cart.", anim: "animate-fade-up" },
              { icon: "🚀", step: "03", title: "Fast Delivery", desc: "Track your order live and get it delivered to your door.", anim: "animate-slide-right" },
            ].map(({ icon, step, title, desc, anim }, idx) => (
              <div
                key={step}
                className={`bg-orange-50 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center
                  ${howVisible ? `${anim} delay-${(idx + 1) * 100}` : "opacity-0"}`}
              >
                <div className="text-5xl mb-4 animate-float inline-block" style={{ animationDelay: `${idx * 0.4}s` }}>{icon}</div>
                <span className="text-orange-500 font-bold text-xs tracking-widest mb-2">STEP {step}</span>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section ref={testimonialsRef} className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-12 ${testimonialsVisible ? "animate-fade-up" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-orange-500 mt-2 text-sm">Real feedback from real food lovers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ title, text, name, initials, role, avatarBg }, idx) => (
              <div
                key={name}
                className={`bg-orange-50 border border-orange-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3
                  ${testimonialsVisible ? `animate-fade-up delay-${(idx + 1) * 100}` : "opacity-0"}`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 text-yellow-400 text-lg">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className="animate-pop-in" style={{ animationDelay: `${i * 0.08}s` }}>{s}</span>
                  ))}
                </div>
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-base">{title}</h3>
                {/* Review text */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{text}</p>
                {/* Author */}
                <div className="flex items-center gap-3 mt-2">
                  <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-md`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-orange-500 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER CTA ─── */}
      <section ref={ctaRef} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-20 text-center relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className={`max-w-3xl mx-auto px-6 relative z-10 ${ctaVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl font-bold mb-4">Become a Restaurant Partner</h2>
          <p className="text-lg text-orange-100 mb-8">
            Grow your business with Cravings and reach thousands of hungry customers.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
          >
            Partner With Us →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
