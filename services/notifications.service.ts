import apiClient from "@/lib/api-client";
import { ApiResponse, PaginatedResponse, SearchQueryParams } from "@/types/api";

const NotificationsService = {
    getAll: async (params?: SearchQueryParams): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
        const response = await apiClient.get('/notifications', { params });
        return response.data;
    },
    countUnread: async (userId: string): Promise<ApiResponse<number>> => {
        const response = await apiClient.get('/notifications/count-unread', { params: { userId } });
        return response.data;
    },
    markAsRead: async (id: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.put(`/notifications/${id}/read`);
        return response.data;
    },
    markAllAsRead: async (userId: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.put(`/notifications/read-all`, { params: { userId } });
        return response.data;
    }
}

export default NotificationsService