import { IoCallOutline, IoMailOutline, IoLocationOutline } from "react-icons/io5";

const RestaurantContact = ({ restaurant }) => {
  const email = restaurant?.contactDetails?.email;
  const phone = restaurant?.contactDetails?.phone;
  const address = restaurant?.address || restaurant?.city;

  if (!email && !phone && !address) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-2">
        Contact & Location
      </h3>

      {phone && (
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <IoCallOutline className="text-orange-600 text-lg shrink-0" />
          <span>{phone}</span>
        </div>
      )}

      {email && (
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <IoMailOutline className="text-orange-600 text-lg shrink-0" />
          <span>{email}</span>
        </div>
      )}

      {address && (
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <IoLocationOutline className="text-orange-600 text-lg shrink-0" />
          <span>{address}</span>
        </div>
      )}
    </div>
  );
};

export default RestaurantContact;
