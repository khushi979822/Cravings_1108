import { FaInstagram, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";

const getPlatformIcon = (platform) => {
  const p = platform?.toLowerCase() || "";
  if (p.includes("insta")) return <FaInstagram className="text-pink-600" />;
  if (p.includes("face")) return <FaFacebook className="text-blue-600" />;
  if (p.includes("twit") || p.includes("x")) return <FaTwitter className="text-sky-500" />;
  return <FaGlobe className="text-gray-500" />;
};

const RestaurantSocialLinks = ({ socialMediaLinks }) => {
  if (!socialMediaLinks || socialMediaLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">
        Follow Us
      </h3>
      <div className="flex flex-wrap gap-3">
        {socialMediaLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            {getPlatformIcon(link.platform)}
            <span className="capitalize">{link.platform || "Link"}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RestaurantSocialLinks;
