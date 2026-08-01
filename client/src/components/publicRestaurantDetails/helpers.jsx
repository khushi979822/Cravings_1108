import { FaLeaf, FaDrumstickBite } from "react-icons/fa";

export const renderFoodTypeBadge = (foodType) => {
  if (!foodType) return null;
  const isVeg = foodType.toLowerCase().includes("veg") && !foodType.toLowerCase().includes("non");
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
        isVeg
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {isVeg ? <FaLeaf className="text-green-600" /> : <FaDrumstickBite className="text-red-600" />}
      {foodType}
    </span>
  );
};
