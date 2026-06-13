import bgImage from "../images/bgImage3-BTY6Sz_K.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section
      className="relative min-h-[650px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <button className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-2/2 items-center justify-center rounded-full bg-black/40 text-5xl text-dark-300">
        ‹
      </button>

      <button className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-2/2 items-center justify-center rounded-full bg-black/40 text-5xl text-dark-300">
        ›
      </button>

      <div className="relative z-10 flex min-h-[700px] flex-col items-center justify-center px-5 text-center text-white">
        <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-4xl">
          Your Favorite Food,
          <br />
          Delivered Fast
        </h1>

        <p className="mb-7 text-xl md:text-1xl">
          Order from thousands of restaurants and get it delivered to your
          doorstep
        </p>

        <div className="mb-8 flex gap-5">
          <Link
            to="/register"
            className="rounded-lg bg-orange-700 px-10 py-4 text-lg font-bold text-white"
          >
            Sign Up
          </Link>

          <Link
            to="/order"
            className="rounded-lg bg-orange-50 px-10 py-4 text-lg font-bold text-gray-900"
          >
            Order Now
          </Link>
        </div>

        <div className="flex w-full max-w-5xl items-center rounded-lg bg-orange-50 px-6 py-4">
          <span className="mr-4 text-2xl text-black">⌕</span>
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            className="w-full bg-transparent text-lg text-gray-700 outline-none placeholder:text-orange-400"
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
