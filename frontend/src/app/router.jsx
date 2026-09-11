import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import BookingPage from "../pages/BookingPage";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";

function ProtectedRoute({ roles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/movies/:id", element: <MovieDetailsPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/bookings/:showtimeId", element: <BookingPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },

      {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: "/admin", element: <AdminPage /> }],
      },
    ],
  },
]);