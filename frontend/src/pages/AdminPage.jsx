import MovieManagement from "../features/admin/components/MovieManagement";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
      <MovieManagement />
    </div>
  );
}