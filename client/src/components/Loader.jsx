import loader from "../assets/runningLoader.gif";

const Loader = ({ height, width }) => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: height || "100%", width: width || "100%" }}
    >
      <div className="w-28 h-28 flex justify-center items-center">
        <img
          src={loader}
          alt="Loading..."
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Loader;
