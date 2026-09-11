import axiosClient from "../../../api/axiosClient";

export const fetchMyNotifications = async () => {
    const { data } = await axiosClient.get("/api/notifications/my");
    return data;
};

export const markNotificationRead = async (notificationId) => {
    const { data } = await axiosClient.put(`/api/notifications/${notificationId}/read`);
    return data;
}