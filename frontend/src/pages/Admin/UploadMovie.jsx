import { useState } from "react";
import { Upload } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const UploadMovie = () => {
  const [formData, setFormData] = useState({
    movieName: "",
    storyline: "",
    imdbId: "",
    category: "",
    download480: "",
    download720: "",
    download1080: "",
  });

  const [poster, setPoster] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePoster = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleScreenshots = (e) => {
    setScreenshots(Array.from(e.target.files));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const movieData = new FormData();

      movieData.append("movieName", formData.movieName);
      movieData.append("storyline", formData.storyline);
      movieData.append("imdbId", formData.imdbId);

      // Convert category string to array
      movieData.append(
        "category",
        JSON.stringify(
          formData.category
            .split(",")
            .map((item) => item.trim())
        )
      );

      // Convert download links to array
      movieData.append(
        "downloadLinks",
        JSON.stringify([
          formData.download480,
          formData.download720,
          formData.download1080,
        ].filter(Boolean))
      );

      movieData.append("poster", poster);

      screenshots.forEach((file) => {
          movieData.append("screenshots", file);
      });

      const res = await api.post(
        "/api/movie/upload",
        movieData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      toast.success(
        res.data.message || "Login successful"
      );

      setFormData({
        movieName: "",
        storyline: "",
        imdbId: "",
        category: "",
        download480: "",
        download720: "",
        download1080: "",
      });

      setPoster(null);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loader/>;  
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}      

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 pt-25">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">

            {/* Movie Name */}
            <div>
              <label className="block mb-2 text-zinc-300">
                Movie Name
              </label>

              <input
                type="text"
                name="movieName"
                value={formData.movieName}
                onChange={handleChange}
                placeholder="Enter movie name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* IMDb ID */}
            <div>
              <label className="block mb-2 text-zinc-300">
                IMDb ID
              </label>

              <input
                type="text"
                name="imdbId"
                value={formData.imdbId}
                onChange={handleChange}
                placeholder="tt4154796"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-zinc-300">
                Categories
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="eg. Action, Adventure, Sci-Fi"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Storyline */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-zinc-300">
                Storyline
              </label>

              <textarea
                rows="6"
                name="storyline"
                value={formData.storyline}
                onChange={handleChange}
                placeholder="Enter movie storyline..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500 resize-none"
              />
            </div>

            {/* Poster Upload */}
            <div className="md:col-span-2">
              <label className="block mb-3 text-zinc-300">
                Upload Poster
              </label>

              <label className="border-2 border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-all bg-zinc-800/40">
                <Upload
                  size={50}
                  className="text-red-500 mb-4"
                />

                <p className="text-zinc-400">
                  Click to upload movie poster
                </p>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePoster}
                />
              </label>

              {poster && (
                <p className="mt-4 text-green-500">
                  {poster.name}
                </p>
              )}
            </div>
          </div>



          {/* screenshots Upload */}
            <div className="md:col-span-2">
              <label className="block mb-3 text-zinc-300">
                Upload Screenshots
              </label>

              <label className="border-2 border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-all bg-zinc-800/40">
                <Upload
                  size={50}
                  className="text-red-500 mb-4"
                />

                <p className="text-zinc-400">
                  Click to upload movie screenshots
                </p>

                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleScreenshots}
                />
              </label>

              {screenshots.map((item, idx) => (
                <p key={idx} className="mt-4 text-green-500">
                  {item.name}
                </p>
              ))}
            </div>
          


          {/* Download Links */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">
              Download Links
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              <input
                type="text"
                name="download480"
                value={formData.download480}
                onChange={handleChange}
                placeholder="480p Link"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
              />

              <input
                type="text"
                name="download720"
                value={formData.download720}
                onChange={handleChange}
                placeholder="720p Link"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
              />

              <input
                type="text"
                name="download1080"
                value={formData.download1080}
                onChange={handleChange}
                placeholder="1080p Link"
                className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition-all font-semibold text-lg shadow-lg shadow-red-500/20"
          >
            {loading ? "Uploading..." : "Upload Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMovie;