import { renderFoodTypeBadge } from "./helpers";
import { IoStar } from "react-icons/io5";

const MenuItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {renderFoodTypeBadge(item.foodType)}
          {item.isTopRated && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <IoStar /> Top Rated
            </span>
          )}
          {item.isRecommended && (
            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Chef Recommended
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-base">{item.itemName}</h3>
        <p className="text-sm font-semibold text-orange-700">₹{item.price}</p>
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
        )}
      </div>

      {item.image?.url && (
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
          <img
            src={item.image.url}
            alt={item.itemName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;
