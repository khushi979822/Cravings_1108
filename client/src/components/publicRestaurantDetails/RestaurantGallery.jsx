const RestaurantGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">
        Gallery
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img
              src={img.url || img}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantGallery;
