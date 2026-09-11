import { useAuth } from "../features/auth/AuthContext";
import BookingHistory from "../features/bookings/components/useMyBookings";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 max-w-sm mb-8">
        <p className="text-sm text-gray-500">Name</p>
        <p className="text-gray-900 font-medium">{user?.name}</p>

        <p className="text-sm text-gray-500 pt-2">Email</p>
        <p className="text-gray-900 font-medium">{user?.email}</p>

        <p className="text-sm text-gray-500 pt-2">Role</p>
        <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
      </div>

      <h2 className="text-lg font-medium text-gray-900 mb-3">Booking History</h2>
      <BookingHistory />
    </div>
  );
}