import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-orange-700">404</h1>
        <p className="mb-6 text-xl text-gray-700">Page Not Found</p>
        <p className="mb-8 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-md bg-orange-700 px-6 py-3 text-white hover:bg-orange-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
