import React, { useState, useRef, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuLoaderCircle, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import api from "../../../config/api.config";

const CATEGORIES = [
  "Pizza","Burger","Wrap","Dessert","Beverages","Biryani",
  "Main Course","Seafood","Rice","Starter","Other",
];

const EditOrViewItem = ({ isOpen, onClose, item, mode, onSave }) => {
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef();
  const isView = mode === "view";

  useEffect(() => {
    if (item) {
      setForm({ ...item });
      setPreview(item.image?.url || null);
      setSelectedFile(null);
    }
  }, [item]);

  if (!isOpen || !form) return null;

  const handleChange = (e) => {
    if (isView) return;
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    if (isView) return;
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleClose = () => onClose();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return handleClose();
    if (!form.itemName?.trim()) return toast.error("Item name is required.");
    if (!form.category) return toast.error("Please select a category.");
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      return toast.error("Please enter a valid price.");

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("itemName", form.itemName.trim());
      formData.append("description", form.description ? form.description.trim() : "");
      formData.append("price", parseFloat(form.price));
      formData.append("category", form.category);
      formData.append("type", form.type || "Vegetarian");
      formData.append("status", form.status || "available");
      formData.append("isTopRated", form.isTopRated || false);
      formData.append("isRecommended", form.isRecommended || false);
      formData.append("isNew", form.isNew || false);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await api.put(`/restaurant/menu/item/${form._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSave(res.data.data);
      toast.success("Menu item updated successfully!");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "border border-(--color-secondary) rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:bg-gray-100";
  const inputClass = `${inputBase}${isView ? " bg-gray-50 cursor-default" : ""}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center p-4 border-b border-(--color-secondary) sticky top-0 bg-white z-10">
          <h2 className="font-bold text-xl text-(--color-primary)">
            {isView ? "View Menu Item" : "Edit Menu Item"}
          </h2>
          <button onClick={handleClose} type="button">
            <IoIosCloseCircleOutline className="text-red-400 hover:text-red-700 text-2xl" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <main className="p-6 space-y-4">
            {/* Image */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Item Image</label>
              <div
                className={`border-2 border-dashed border-(--color-secondary) rounded-lg p-4 flex flex-col items-center justify-center transition-colors${
                  isView ? " cursor-default" : " cursor-pointer hover:border-(--color-primary)"
                }`}
                onClick={() => !isView && fileRef.current.click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <LuUpload className="text-3xl" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
              {!isView && (
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              )}
            </div>

            {/* Item Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="itemName" className="font-semibold text-sm">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="itemName" name="itemName" type="text"
                value={form.itemName} onChange={handleChange}
                readOnly={isView} disabled={isLoading} className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="font-semibold text-sm">Description</label>
              <textarea
                id="description" name="description" rows={3}
                value={form.description} onChange={handleChange}
                readOnly={isView} disabled={isLoading}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="price" className="font-semibold text-sm">
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price" name="price" type="number" min="0" step="0.01"
                  value={form.price} onChange={handleChange}
                  readOnly={isView} disabled={isLoading} className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="category" className="font-semibold text-sm">
                  Category <span className="text-red-500">*</span>
                </label>
                {isView ? (
                  <input id="category" name="category" type="text" value={form.category} readOnly className={inputClass} />
                ) : (
                  <select id="category" name="category" value={form.category} onChange={handleChange} disabled={isLoading} className={inputClass}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                )}
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="type" className="font-semibold text-sm">Type</label>
                {isView ? (
                  <input id="type" name="type" type="text" value={form.type} readOnly className={inputClass} />
                ) : (
                  <select id="type" name="type" value={form.type} onChange={handleChange} disabled={isLoading} className={inputClass}>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="status" className="font-semibold text-sm">Status</label>
                {isView ? (
                  <input id="status" name="status" type="text" value={form.status} readOnly className={inputClass} />
                ) : (
                  <select id="status" name="status" value={form.status} onChange={handleChange} disabled={isLoading} className={inputClass}>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Badges</label>
              <div className="flex gap-6">
                {[{ name: "isTopRated", label: "Top Rated" }, { name: "isRecommended", label: "Recommended" }, { name: "isNew", label: "New Item" }].map(
                  ({ name, label }) => (
                    <label key={name} className={`flex items-center gap-2 select-none ${isView ? "cursor-default" : "cursor-pointer"}`}>
                      <input
                        type="checkbox" name={name} checked={form[name]}
                        onChange={handleChange} disabled={isView || isLoading}
                        className="accent-(--color-primary) w-4 h-4"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </main>

          <footer className="p-4 border-t border-(--color-secondary) flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button" onClick={handleClose} disabled={isLoading}
              className="px-4 py-2 rounded bg-(--color-secondary) text-(--color-secondary-content) text-sm hover:opacity-80 transition-opacity"
            >
              {isView ? "Close" : "Cancel"}
            </button>
            {!isView && (
              <button
                type="submit" disabled={isLoading}
                className="px-4 py-2 rounded bg-(--color-primary) text-(--color-primary-content) text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isLoading ? <><LuLoaderCircle className="animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EditOrViewItem;
