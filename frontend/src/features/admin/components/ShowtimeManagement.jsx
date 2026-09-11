import { useState } from "react";
import { useMovies } from "../../movies/hooks/useMovies";
import { useTheaters } from "../hooks/useAdminTheaters";
import { useCreateShowtime, useDeleteShowtime } from "../hooks/useAdminShowtimes";

export default function ShowtimeManagement() {
  const { data: movies } = useMovies();
  const { data: theaters } = useTheaters();
  const createShowtime = useCreateShowtime();
  const deleteShowtime = useDeleteShowtime();

  const [form, setForm] = useState({
    movieId: "",
    theaterId: "",
    startTime: "",
    endTime: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createShowtime.mutateAsync(form);
      setForm({ movieId: "", theaterId: "", startTime: "", endTime: "", price: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create showtime.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (!confirm(`Delete showtime #${deleteId}?`)) return;
    try {
      await deleteShowtime.mutateAsync(deleteId);
      setDeleteId("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete showtime.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Showtimes</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md space-y-3"
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Movie</label>
          <select
            name="movieId"
            required
            value={form.movieId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a movie</option>
            {movies?.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theater</label>
          <select
            name="theaterId"
            required
            value={form.theaterId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a theater</option>
            {theaters?.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            required
            value={form.startTime}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            required
            value={form.endTime}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            required
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={createShowtime.isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {createShowtime.isPending ? "Creating..." : "Create Showtime"}
        </button>
      </form>

      <div className="border border-gray-200 rounded-lg p-4 max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delete Showtime by ID
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            placeholder="Showtime ID"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={handleDelete}
            disabled={deleteShowtime.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}