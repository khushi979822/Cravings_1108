const RestaurantAbout = ({ description }) => {
  if (!description) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-2">
        About Restaurant
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default RestaurantAbout;
