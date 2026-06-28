import React, { useState } from "react";
import { Link } from "react-router-dom";

import heroImage from "../images/bgImage1-BgVBBcls.jpg";

import mangoTree from "../images/undermango tree.avif";
import rajDarbar from "../images/Rajdarabr.webp";
import countrySide from "../images/country side coulture.webp";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const restaurants = [
    {
      name: "Under The Mango Tree",
      image: mangoTree,
      rating: "4.5",
      cuisine: "Indian, Chinese, Italian",
    },
    {
      name: "Raj Darbar",
      image: rajDarbar,
      rating: "4.8",
      cuisine: "Indian, Chinese",
    },
    {
      name: "Countryside Culture",
      image: countrySide,
      rating: "4.2",
      cuisine: "Indian",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const payload = {
      searchQuery,
      page: "home",
      action: "search",
    };

    console.log("Home payload ready for backend:", payload);
  };

  return (
    <div className="bg-gray-50">
      <section
        className="h-[90vh] bg-cover bg-center flex items-center justify-center text-center text-white relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 px-4 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Favorite Food,
            <br />
            Delivered Fast
          </h1>

          <p className="text-lg md:text-2xl mb-8">
            Order from thousands of restaurants and get it delivered to your
            doorstep.
          </p>

          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Order Now
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white rounded-xl flex items-center px-4 py-3 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <span className="text-gray-500 text-xl mr-3">🔍</span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="w-full outline-none text-gray-700 placeholder-gray-400"
              aria-label="Search restaurants or dishes"
            />
          </form>
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-3">
          Featured Restaurants
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Discover amazing restaurants near you
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-2 transition duration-300"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xl">{restaurant.name}</h3>

                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    ⭐ {restaurant.rating}
                  </span>
                </div>

                <p className="text-gray-600">{restaurant.cuisine}</p>

                <button className="w-full mt-5 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium">
                  Explore Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12">
            Cravings By The Numbers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6 text-center">
              <h3 className="text-4xl font-bold text-orange-600">2.5M+</h3>
              <p>Successful Deliveries</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 text-center">
              <h3 className="text-4xl font-bold text-pink-500">500K+</h3>
              <p>Happy Customers</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 text-center">
              <h3 className="text-4xl font-bold text-orange-600">5K+</h3>
              <p>Partner Restaurants</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 text-center">
              <h3 className="text-4xl font-bold text-pink-500">1K+</h3>
              <p>Delivery Partners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-orange-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12">
            What Our Customers Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 mb-4">
                Amazing service and super fast delivery. Highly recommended.
              </p>
              <h4 className="font-bold">Rahul Sharma</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 mb-4">
                Great variety of restaurants and easy ordering experience.
              </p>
              <h4 className="font-bold">Priya Patel</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 mb-4">
                Food arrived hot and fresh. Loved the experience.
              </p>
              <h4 className="font-bold">Aman Verma</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Download Our Mobile App</h2>

          <p className="text-gray-600 mb-8">
            Order food anytime, anywhere with the Cravings mobile app.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium">
              Google Play
            </button>

            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium">
              App Store
            </button>
          </div>
        </div>
      </section>

      <section className="bg-orange-600 text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Become a Restaurant Partner</h2>

        <p className="text-lg mb-8">
          Grow your business with Cravings and reach thousands of customers.
        </p>

        <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200\">
          Partner With Us
        </button>
      </section>
    </div>
  );
}

export default Home;
