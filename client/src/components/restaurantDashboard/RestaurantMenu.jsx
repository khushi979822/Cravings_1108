import { useState, useEffect, useCallback } from "react";
import { FaAward } from "react-icons/fa";
import { LuPencilLine, LuTrash2, LuEye, LuChevronDown, LuLoaderCircle } from "react-icons/lu";
import { AiTwotoneLike } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import ConfirmModal from "./menuItems/ConfirmModal";
import AddNewItemModal from "./menuItems/AddNewItemModal";
import EditOrViewItem from "./menuItems/EditOrViewItem";
import api from "../../config/api.config";
import toast from "react-hot-toast";
const statusChipStyles = {
  available: "bg-green-100 text-green-700 border border-green-300",
  unavailable: "bg-amber-100 text-amber-700 border border-amber-300",
  discontinued: "bg-rose-100 text-rose-700 border border-rose-300",
};

const statusLabels = {
  available: "Available",
  unavailable: "Unavailable",
  discontinued: "Discontinued",
};

const RestaurantMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] = useState(false);
  const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/restaurant/menu");
      setMenuItems(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleUpdateItem = (updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        (item._id && item._id === updatedItem._id) || item.itemName === updatedItem.itemName
          ? updatedItem
          : item
      )
    );
  };

  const handleStatusChange = async (targetItem, newStatus) => {
    try {
      const res = await api.put(`/restaurant/menu/item/${targetItem._id}`, {
        status: newStatus,
      });
      toast.success("Status updated successfully");
      setMenuItems((prev) =>
        prev.map((item) => (item._id === targetItem._id ? res.data.data : item))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedItem || !modalMode) return;

    try {
      if (modalMode === "delete") {
        await api.delete(`/restaurant/menu/item/${selectedItem._id}`);
        toast.success("Item deleted successfully");
        setMenuItems((prev) =>
          prev.filter((item) => item._id !== selectedItem._id)
        );
      } else if (modalMode === "topRated") {
        const res = await api.put(`/restaurant/menu/item/${selectedItem._id}`, {
          isTopRated: !selectedItem.isTopRated,
        });
        toast.success(res.data.message || "Updated top rated status");
        setMenuItems((prev) =>
          prev.map((item) => (item._id === selectedItem._id ? res.data.data : item))
        );
      } else if (modalMode === "recommended") {
        const res = await api.put(`/restaurant/menu/item/${selectedItem._id}`, {
          isRecommended: !selectedItem.isRecommended,
        });
        toast.success(res.data.message || "Updated recommended status");
        setMenuItems((prev) =>
          prev.map((item) => (item._id === selectedItem._id ? res.data.data : item))
        );
      } else if (modalMode === "new") {
        const res = await api.put(`/restaurant/menu/item/${selectedItem._id}`, {
          isNew: !selectedItem.isNew,
        });
        toast.success(res.data.message || "Updated new status");
        setMenuItems((prev) =>
          prev.map((item) => (item._id === selectedItem._id ? res.data.data : item))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="overflow-y-auto h-full">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-bold mb-6">Menu Management</h2>
          <div className="flex gap-4 items-center">
            <button
              className="hover:bg-(--color-primary) border border-(--color-primary) text-(--color-primary) hover:text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              onClick={() => setIsAddNewItemModalOpen(true)}
            >
              <IoMdAddCircleOutline />
              Add New Item
            </button>
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category or type..."
              className="border border-(--color-primary) rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors min-w-[220px]"
            />
          </div>
        </div>
        <div className="bg-(--color-base-200) p-4 rounded-lg">
          <div className="text-(--color-primary) grid grid-cols-7 gap-4 font-bold border-b border-(--color-secondary) py-2">
            <div className="col-span-2">Item Name & Description</div>
            <div className="text-center">Price</div>
            <div>Category & Type</div>
            <div>Status</div>
            <div>Controls</div>
            <div>Actions</div>
          </div>
          <div className="overflow-y-auto max-h-[65vh]">
            {isLoading ? (
              <div className="flex justify-center items-center py-12 text-(--color-primary)">
                <LuLoaderCircle className="animate-spin text-3xl" />
                <span className="ml-2 font-medium">Loading menu...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                {searchQuery
                  ? `No items found for "${searchQuery}"`
                  : "No menu items added yet. Click 'Add New Item' to create one!"}
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="grid grid-cols-7 gap-4 border-b border-(--color-secondary) py-2 items-center"
                >
                <div className="col-span-2 flex items-center gap-4">
                  <div>
                    <img
                      src={item.image.url}
                      alt={item.itemName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="w-full">
                    <div>{item.itemName}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="text-center">₹ {item.price.toFixed(2)}</div>
                <div className="">
                  <div>{item.category}</div>
                  <div className="text-sm">{item.type}</div>
                </div>
                <div>
                  <div className="relative inline-flex items-center">
                    <select
                      value={item.status}
                      className={`appearance-none rounded-md pl-3 pr-8 py-1.5 text-xs font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-primary) ${
                        statusChipStyles[item.status]
                      }`}
                      onChange={(e) => {
                        handleStatusChange(item, e.target.value);
                      }}
                    >
                      <option value="available">
                        {statusLabels.available}
                      </option>
                      <option value="unavailable">
                        {statusLabels.unavailable}
                      </option>
                      <option value="discontinued">
                        {statusLabels.discontinued}
                      </option>
                    </select>
                    <LuChevronDown className="pointer-events-none absolute right-2 text-xs opacity-70" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className={`rounded flex items-center justify-center ${
                      item.isTopRated
                        ? " text-(--color-primary)"
                        : "text-(--color-secondary)"
                    }`}
                    title={item.isTopRated ? "Top Rated" : "Mark as Top Rated"}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode("topRated");
                      setIsControlsModalOpen(true);
                    }}
                  >
                    <FaAward className="" />
                  </button>
                  <button
                    className={`rounded flex items-center justify-center ${
                      item.isRecommended
                        ? "text-(--color-primary)"
                        : "text-(--color-secondary)"
                    }`}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode("recommended");
                      setIsControlsModalOpen(true);
                    }}
                    title={
                      item.isRecommended ? "Recommended" : "Mark as Recommended"
                    }
                  >
                    <AiTwotoneLike className="" />
                  </button>
                  <button
                    className={`px-1 py-0.5 rounded flex items-center justify-center text-xs ${
                      item.isNew
                        ? "text-(--color-primary) border border-(--color-primary)"
                        : "text-(--color-secondary) border border-(--color-secondary)"
                    }`}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode("new");
                      setIsControlsModalOpen(true);
                    }}
                    title={item.isNew ? "New Item" : "Mark as New"}
                  >
                    New
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white rounded"
                    title="Edit Item"
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode("edit");
                      setIsEditViewItemModalOpen(true);
                    }}
                  >
                    <LuPencilLine />
                  </button>
                  <button
                    className="px-2 py-1 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white rounded"
                    title="View Item Details"
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode("view");
                      setIsEditViewItemModalOpen(true);
                    }}
                  >
                    <LuEye />
                  </button>
                  <button
                    className="px-2 py-1 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white rounded"
                    title="Delete Item"
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode("delete");
                      setIsControlsModalOpen(true);
                    }}
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      {isControlsModalOpen && (
        <ConfirmModal
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isControlsModalOpen}
          onClose={() => setIsControlsModalOpen(false)}
          onConfirm={handleConfirmAction}
        />
      )}

      {isEditViewItemModalOpen && (
        <EditOrViewItem
          isOpen={isEditViewItemModalOpen}
          mode={modalMode}
          item={selectedItem}
          onClose={() => setIsEditViewItemModalOpen(false)}
          onSave={handleUpdateItem}
        />
      )}

      <AddNewItemModal
        isOpen={isAddNewItemModalOpen}
        onClose={() => setIsAddNewItemModalOpen(false)}
        onAdd={(newItem) => setMenuItems((prev) => [newItem, ...prev])}
      />
    </>
  );
};

export default RestaurantMenu;
