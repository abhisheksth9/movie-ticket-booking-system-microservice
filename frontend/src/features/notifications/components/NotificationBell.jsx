import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotificationsHistory, useMarkNotificationRead } from "../hooks/useNotifications";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: notifications, isLoading } = useNotificationsHistory();
  const markRead = useMarkNotificationRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markRead.mutate(notification._id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative text-gray-600 hover:text-gray-900"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-medium rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div className="p-3 border-b border-gray-100 font-medium text-sm text-gray-900">
            Notifications
          </div>

          {isLoading ? (
            <p className="p-4 text-sm text-gray-500">Loading...</p>
          ) : !notifications?.length ? (
            <p className="p-4 text-sm text-gray-500">No notifications yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition ${
                    !notification.isRead ? "bg-indigo-50/50" : ""
                  }`}
                >
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}