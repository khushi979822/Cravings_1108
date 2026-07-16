import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState } from "../common/DashboardShared";
import { MdDeleteOutline } from "react-icons/md";

const WishList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      const res = await api.get("/customer/favourites");
      setItems(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (foodId) => {
    try {
      await api.delete(`/customer/favourites/${foodId}`);
      toast.success("Removed from favorites");
      setItems(prev => prev.filter(item => item._id !== foodId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove favorite");
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  if (loading) return <LoadingSpinner message="Loading favorites..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <h2 className="text-2xl font-bold mb-6 text-(--color-base-content)">Favorite Items</h2>
      {items.length === 0 ? (
        <EmptyState message="You haven't favorited any dishes yet." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-(--color-base-200) rounded-xl border border-(--color-base-300) shadow-sm overflow-hidden flex flex-col justify-between">
              <img
                src={item.image?.url || "https://placehold.co/600x400?text=Food"}
                alt={item.itemName}
                className="h-44 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-(--color-base-content)">{item.itemName}</h3>
                  <p className="text-sm text-(--color-secondary) mt-1">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-(--color-primary)">₹{item.price}</span>
                  <button
                    onClick={() => removeFavourite(item._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                    title="Remove Favorite"
                  >
                    <MdDeleteOutline className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
