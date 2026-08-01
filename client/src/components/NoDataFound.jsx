import NoDataFoundGif from "../assets/runningLoader.gif";

const NoDataFound = ({ height, width, text }) => {
  return (
    <div
      className="flex flex-col justify-center items-center py-12"
      style={{ height: height || "100%", width: width || "100%" }}
    >
      <div className="w-24 h-24 flex justify-center items-center opacity-80">
        <img
          src={NoDataFoundGif}
          alt="No Data Found"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold text-gray-700">
          {text || "No Data Found"}
        </h2>
      </div>
    </div>
  );
};

export default NoDataFound;
