import { useState } from "react";
import { useMovies } from "../../movies/hooks/useMovies";
import { useCreateMovie, useUpdateMovie, useDeleteMovie } from "../hooks/useAdminMovies";
import MovieForm from "./MovieForm";

export default function MovieManagement() {
  const { data: movies, isLoading } = useMovies();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  const [editingMovie, setEditingMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setError("");
    try {
      if (editingMovie) {
        await updateMovie.mutateAsync({ id: editingMovie.id, ...formData });
      } else {
        await createMovie.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingMovie(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save movie.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this movie? This cannot be undone.")) return;
    try {
      await deleteMovie.mutateAsync(id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete movie.");
    }
  };

  const startEdit = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Movies</h2>
        <button
          onClick={startCreate}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Add Movie
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md">
          <h3 className="font-medium text-gray-900 mb-3">
            {editingMovie ? `Edit: ${editingMovie.title}` : "New Movie"}
          </h3>
          {error && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <MovieForm
            initialValues={editingMovie}
            onSubmit={handleSubmit}
            isSubmitting={createMovie.isPending || updateMovie.isPending}
            submitLabel={editingMovie ? "Update Movie" : "Create Movie"}
          />
          <button
            onClick={() => {
              setShowForm(false);
              setEditingMovie(null);
            }}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading movies...</p>
      ) : (
        <div className="space-y-2">
          {movies?.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
            >
              <div>
                <p className="font-medium text-gray-900">{movie.title}</p>
                <p className="text-sm text-gray-500">
                  {movie.genre} · {movie.duration} min
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(movie)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}