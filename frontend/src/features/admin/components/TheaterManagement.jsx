import { useState } from "react";
import { useTheaters, useCreateTheater } from "../hooks/useAdminTheaters";

export default function TheaterManagement() {
  const { data: theaters, isLoading } = useTheaters();
  const createTheater = useCreateTheater();

  const [form, setForm] = useState({ name: "", location: "", totalSeats: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTheater.mutateAsync({
        ...form,
        totalSeats: Number(form.totalSeats),
      });
      setForm({ name: "", location: "", totalSeats: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create theater.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Theaters</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
          <input
            type="number"
            name="totalSeats"
            required
            value={form.totalSeats}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={createTheater.isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {createTheater.isPending ? "Creating..." : "Create Theater"}
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading theaters...</p>
      ) : (
        <div className="space-y-2">
          {theaters?.map((theater) => (
            <div key={theater.id} className="border border-gray-200 rounded-lg p-3">
              <p className="font-medium text-gray-900">{theater.name}</p>
              <p className="text-sm text-gray-500">
                {theater.location} · {theater.totalSeats} seats
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}