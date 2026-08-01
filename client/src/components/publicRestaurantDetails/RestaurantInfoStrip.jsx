import { IoTimeOutline, IoLocationOutline, IoRestaurantOutline } from "react-icons/io5";

const RestaurantInfoStrip = ({ restaurant }) => {
  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-wrap gap-6 items-center text-xs text-gray-600">
        {restaurant.servingHours?.openingTime && (
          <div className="flex items-center gap-1.5 font-medium">
            <IoTimeOutline className="text-orange-600 text-base" />
            <span>
              Timing: {restaurant.servingHours.openingTime} – {restaurant.servingHours.closingTime}
            </span>
          </div>
        )}

        {(restaurant.city || restaurant.address) && (
          <div className="flex items-center gap-1.5 font-medium">
            <IoLocationOutline className="text-orange-600 text-base" />
            <span>{restaurant.city || restaurant.address}</span>
          </div>
        )}

        {restaurant.restaurantType && (
          <div className="flex items-center gap-1.5 font-medium capitalize">
            <IoRestaurantOutline className="text-orange-600 text-base" />
            <span>Type: {restaurant.restaurantType}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantInfoStrip;
