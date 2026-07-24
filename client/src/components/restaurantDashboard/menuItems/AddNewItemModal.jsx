import React, { useState, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuLoaderCircle, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";

const defaultForm = {
  itemName: "",
  description: "",
  price: "",
  category: "",
  type: "Vegetarian",
  status: "available",
  isTopRated: false,
  isRecommended: false,
  isNew: false,
  image: null,
};

const CATEGORIES = [
  "Pizza",
  "Burger",
  "Wrap",
  "Dessert",
  "Beverages",
  "Biryani",
  "Main Course",
  "Seafood",
  "Rice",
  "Starter",
  "Other",
];

const AddNewItemModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState(defaultForm);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setForm(defaultForm);
    setPreview(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.itemName.trim()) return toast.error("Item name is required.");
    if (!form.category) return toast.error("Please select a category.");
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      return toast.error("Please enter a valid price.");

    setIsLoading(true);
    try {
      // Build the new item object matching dummyMenu shape
      const newItem = {
        itemName: form.itemName.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,
        type: form.type,
        image: {
          url: preview || `https://picsum.photos/seed/${Date.now()}/600/600`,
          publicId: `item-${Date.now()}`,
        },
        status: form.status,
        isTopRated: form.isTopRated,
        isRecommended: form.isRecommended,
        isNew: form.isNew,
        isDeleted: false,
      };

      onAdd(newItem);
      toast.success("Menu item added successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-(--color-secondary) sticky top-0 bg-white z-10">
          <h2 className="font-bold text-xl text-(--color-primary)">
            Add New Menu Item
          </h2>
          <button onClick={handleClose} type="button">
            <IoIosCloseCircleOutline className="text-red-400 hover:text-red-700 text-2xl" />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <main className="p-6 space-y-4">
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Item Image</label>
              <div
                className="border-2 border-dashed border-(--color-secondary) rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-(--color-primary) transition-colors"
                onClick={() => fileRef.current.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <LuUpload className="text-3xl" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Item Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="itemName" className="font-semibold text-sm">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="itemName"
                name="itemName"
                type="text"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g. Classic Margherita Pizza"
                disabled={isLoading}
                className="border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:bg-gray-100"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="font-semibold text-sm">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your menu item..."
                disabled={isLoading}
                className="border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) resize-none disabled:bg-gray-100"
              />
            </div>

            {/* Price & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="price" className="font-semibold text-sm">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 299"
                  disabled={isLoading}
                  className="border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:bg-gray-100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="category" className="font-semibold text-sm">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:bg-gray-100"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="type" className="font-semibold text-sm">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:bg-gray-100"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="status" className="font-semibold text-sm">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:bg-gray-100"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            {/* Badges / Flags */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Badges</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isTopRated"
                    checked={form.isTopRated}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="accent-(--color-primary) w-4 h-4"
                  />
                  <span className="text-sm">Top Rated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isRecommended"
                    checked={form.isRecommended}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="accent-(--color-primary) w-4 h-4"
                  />
                  <span className="text-sm">Recommended</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={form.isNew}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="accent-(--color-primary) w-4 h-4"
                  />
                  <span className="text-sm">New Item</span>
                </label>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-4 border-t border-(--color-secondary) flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-(--color-secondary) text-(--color-secondary-content) text-sm hover:opacity-80 transition-opacity"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-(--color-primary) text-(--color-primary-content) text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <LuLoaderCircle className="animate-spin" /> Adding...
                </>
              ) : (
                "Add Item"
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddNewItemModal;
