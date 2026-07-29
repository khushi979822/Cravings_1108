import { useEffect, useMemo, useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api.config";
import toast from "react-hot-toast";

const RestaurantPhotos = () => {
  const { user } = useAuth();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_GALLERY_IMAGES = 8;

  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({ cover: "", gallery: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Existing saved images from DB
  const [savedCoverUrl, setSavedCoverUrl] = useState(null);
  const [savedGalleryUrls, setSavedGalleryUrls] = useState([]);

  // Fetch existing photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get(`/restaurant/get-resturant-data?id=${user._id}`);
        const data = res.data.data;
        if (data?.coverImage?.url) setSavedCoverUrl(data.coverImage.url);
        if (data?.restaurantImage?.length) setSavedGalleryUrls(data.restaurantImage.map((img) => img.url));
      } catch {
        // silently fail — photos section still works
      }
    };
    fetchPhotos();
  }, [user._id]);

  const coverPreview = useMemo(() => {
    return coverImage ? URL.createObjectURL(coverImage) : null;
  }, [coverImage]);

  const galleryPreviews = useMemo(() => {
    return galleryImages.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
      key: `${image.name}-${image.lastModified}`,
    }));
  }, [galleryImages]);

  useEffect(() => {
    return () => { if (coverPreview) URL.revokeObjectURL(coverPreview); };
  }, [coverPreview]);

  useEffect(() => {
    return () => { galleryPreviews.forEach((p) => URL.revokeObjectURL(p.url)); };
  }, [galleryPreviews]);

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) { setCoverImage(null); setErrors((p) => ({ ...p, cover: "" })); return; }
    if (file.size >= MAX_FILE_SIZE) {
      setCoverImage(null);
      setErrors((p) => ({ ...p, cover: "Cover image must be less than 5MB." }));
      event.target.value = "";
      return;
    }
    setCoverImage(file);
    setErrors((p) => ({ ...p, cover: "" }));
  };

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const oversized = files.filter((f) => f.size >= MAX_FILE_SIZE);
    if (oversized.length) {
      setErrors((p) => ({ ...p, gallery: "Each image must be less than 5MB." }));
      event.target.value = "";
      return;
    }
    setGalleryImages((prev) => {
      const merged = [...prev, ...files];
      if (merged.length > MAX_GALLERY_IMAGES) {
        setErrors((p) => ({ ...p, gallery: `Max ${MAX_GALLERY_IMAGES} images allowed.` }));
        return merged.slice(0, MAX_GALLERY_IMAGES);
      }
      setErrors((p) => ({ ...p, gallery: "" }));
      return merged;
    });
    event.target.value = "";
  };

  const removeGalleryImage = (idx) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
    setErrors((p) => ({ ...p, gallery: "" }));
  };

  const handleSavePhotos = async () => {
    if (!coverImage && galleryImages.length === 0) {
      toast.error("Please select at least one image to upload.");
      return;
    }
    try {
      setIsSaving(true);
      const formData = new FormData();
      if (coverImage) formData.append("coverImage", coverImage);
      galleryImages.forEach((img) => formData.append("restaurantImage", img));

      const res = await api.post("/restaurant/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data.data;
      if (data?.coverImage?.url) setSavedCoverUrl(data.coverImage.url);
      if (data?.restaurantImage?.length) setSavedGalleryUrls(data.restaurantImage.map((img) => img.url));

      setCoverImage(null);
      setGalleryImages([]);
      toast.success("Photos saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save photos. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-2 space-y-3">
      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-3 items-start">
        {/* Cover Image */}
        <div className="bg-(--color-base-100) rounded-xl border border-(--color-secondary)/40 shadow-sm p-4 h-full">
          <div className="flex items-center justify-between border-b border-(--color-secondary) pb-2 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-(--color-primary)">Cover Image</h3>
              <p className="text-xs text-(--color-secondary)">Upload one hero image under 5MB.</p>
            </div>
            <div className="text-[11px] px-2 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">1 file</div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-dashed border-(--color-secondary) bg-(--color-base-100) p-3">
              <label
                htmlFor="coverImage"
                className="inline-flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-sm hover:opacity-95 transition"
              >
                <MdOutlineAddAPhoto className="text-sm" />
                {coverImage ? "Change Cover" : "Upload Cover Image"}
              </label>
              <input id="coverImage" type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
              <p className="mt-2 text-xs text-(--color-secondary)">JPG, PNG, AVIF, WEBP — best for banner-style photos.</p>
              {errors.cover && <p className="text-xs text-(--color-error) mt-2">{errors.cover}</p>}
            </div>

            {/* Preview: new or saved */}
            {coverPreview || savedCoverUrl ? (
              <div className="overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm">
                <div className="relative">
                  <img
                    src={coverPreview || savedCoverUrl}
                    alt="Cover Preview"
                    className="w-full h-56 object-cover"
                  />
                  {coverPreview && (
                    <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">New</span>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                </div>
                {coverImage && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                    <p className="truncate font-medium">{coverImage.name}</p>
                    <span className="shrink-0 rounded-full bg-(--color-secondary)/20 px-2 py-1 text-[11px]">
                      {(coverImage.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-(--color-secondary) bg-linear-to-br from-white to-(--color-base-100) px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                  <MdOutlineAddAPhoto className="text-2xl" />
                </div>
                <p className="text-sm font-semibold text-(--color-primary)">No cover selected</p>
                <p className="mt-1 text-xs text-(--color-secondary-content)">Add a hero image to make your restaurant stand out.</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-(--color-base-100) rounded-xl border border-(--color-secondary)/40 shadow-sm p-4 h-full">
          <div className="flex items-start justify-between gap-3 border-b border-(--color-secondary) mb-3 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-(--color-primary)">Restaurant Gallery</h3>
                <span className="text-[11px] px-2 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
                  {galleryImages.length}/{MAX_GALLERY_IMAGES} new
                </span>
              </div>
              <p className="text-xs text-(--color-secondary-content) mt-0.5">Upload up to {MAX_GALLERY_IMAGES} images, each under 5MB.</p>
            </div>
            <label
              htmlFor="galleryImages"
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs shadow-sm transition ${galleryImages.length >= MAX_GALLERY_IMAGES ? "bg-(--color-secondary) text-(--color-secondary-content) cursor-not-allowed" : "bg-(--color-primary) text-(--color-primary-content) cursor-pointer hover:opacity-95"}`}
            >
              <MdOutlineAddAPhoto className="text-sm" />
              Add Images
            </label>
            <input
              id="galleryImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesChange}
              disabled={galleryImages.length >= MAX_GALLERY_IMAGES}
              className="hidden"
            />
          </div>

          {errors.gallery && (
            <div className="mb-3 rounded-lg border border-(--color-error)/30 bg-(--color-error)/5 px-3 py-2">
              <p className="text-xs text-(--color-error)">{errors.gallery}</p>
            </div>
          )}

          {/* Saved gallery from DB */}
          {savedGalleryUrls.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-(--color-secondary) mb-2 font-medium">Saved Photos</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {savedGalleryUrls.map((url, i) => (
                  <div key={url} className="overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm">
                    <img src={url} alt={`Saved ${i + 1}`} className="h-32 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New gallery previews */}
          {galleryPreviews.length > 0 ? (
            <div>
              <p className="text-xs text-(--color-secondary) mb-2 font-medium">New Photos (not saved yet)</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {galleryPreviews.map((imagePreview, index) => (
                  <div
                    key={imagePreview.key}
                    className="group overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative">
                      <img src={imagePreview.url} alt={`New ${index + 1}`} className="h-36 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-(--color-error) shadow-sm ring-1 ring-(--color-error)/20 transition hover:bg-(--color-error) hover:text-(--color-error-content)"
                        aria-label="Remove image"
                      >
                        <IoMdClose className="text-lg" />
                      </button>
                    </div>
                    <div className="px-3 py-2">
                      <p className="truncate text-xs font-medium text-(--color-primary)">{imagePreview.file.name}</p>
                      <p className="mt-0.5 text-[11px] text-(--color-secondary-content)">{(imagePreview.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : savedGalleryUrls.length === 0 && (
            <div className="rounded-xl border border-dashed border-(--color-secondary) bg-linear-to-br from-white to-(--color-base-100) px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                <MdOutlineAddAPhoto className="text-2xl" />
              </div>
              <p className="text-sm font-semibold text-(--color-primary)">No restaurant images yet</p>
              <p className="mt-1 text-xs text-(--color-secondary-content)">Add photos of your dining space, food, and kitchen.</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSavePhotos}
          disabled={isSaving || (!coverImage && galleryImages.length === 0)}
          className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-5 py-2 rounded-lg text-sm font-semibold shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <><LuLoaderCircle className="animate-spin" /> Saving...</>
          ) : (
            "Save Photos"
          )}
        </button>
      </div>
    </div>
  );
};

export default RestaurantPhotos;
