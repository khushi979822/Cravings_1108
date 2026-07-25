import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LuTrash2, LuCheck } from "react-icons/lu";

const modeConfig = {
  delete: {
    title: "Delete Item",
    description: (item) =>
      `Are you sure you want to delete "${item?.itemName}"? This action cannot be undone.`,
    confirmLabel: "Delete",
    confirmClass:
      "bg-red-500 hover:bg-red-600 text-white",
  },
  topRated: {
    title: "Toggle Top Rated",
    description: (item) =>
      item?.isTopRated
        ? `Remove "${item?.itemName}" from Top Rated?`
        : `Mark "${item?.itemName}" as Top Rated?`,
    confirmLabel: "Confirm",
    confirmClass: "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  },
  recommended: {
    title: "Toggle Recommended",
    description: (item) =>
      item?.isRecommended
        ? `Remove "${item?.itemName}" from Recommended?`
        : `Mark "${item?.itemName}" as Recommended?`,
    confirmLabel: "Confirm",
    confirmClass: "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  },
  new: {
    title: "Toggle New Item",
    description: (item) =>
      item?.isNew
        ? `Remove the "New" badge from "${item?.itemName}"?`
        : `Mark "${item?.itemName}" as a New Item?`,
    confirmLabel: "Confirm",
    confirmClass: "bg-(--color-primary) hover:opacity-90 text-(--color-primary-content)",
  },
};

const ConfirmModal = ({ selectedItem, modalMode, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const config = modeConfig[modalMode] || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-(--color-secondary) pb-3">
          <h1 className="text-(--color-primary) text-xl font-bold">
            {config.title || "Are you sure?"}
          </h1>
          <button className="text-red-300 hover:text-red-500" onClick={onClose}>
            <IoMdCloseCircleOutline size={24} />
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-600 text-sm mb-6">
          {config.description ? config.description(selectedItem) : ""}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-(--color-secondary) text-gray-600 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors ${config.confirmClass}`}
          >
            {modalMode === "delete" ? <LuTrash2 /> : <LuCheck />}
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
