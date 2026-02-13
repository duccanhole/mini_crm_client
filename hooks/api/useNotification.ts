import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotificationsService from '@/services/notifications.service';
import { SearchQueryParams } from '@/types/api';
import { message } from 'antd';
import { useTranslations } from 'next-intl';

// Query Keys
export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => ['notifications', 'list'] as const,
    list: (params: SearchQueryParams) => ['notifications', 'list', params] as const,
    unreadCount: (userId: string) => ['notifications', 'unread-count', userId] as const,
};

// Hook to get all notifications (paginated/searched)
export const useGetNotifications = (params?: SearchQueryParams) => {
    return useQuery({
        queryKey: notificationKeys.list(params || {}),
        queryFn: () => NotificationsService.getAll(params),
    });
};

// Hook to count unread notifications
export const useGetUnreadCount = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: notificationKeys.unreadCount(userId),
        queryFn: () => NotificationsService.countUnread(userId),
        enabled: enabled && !!userId,
    });
};

// Hook to mark a notification as read
export const useMarkAsRead = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => NotificationsService.markAsRead(id),
        onSuccess: () => {
            // Refresh both lists and unread count
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to mark all notifications as read
export const useMarkAllAsRead = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => NotificationsService.markAllAsRead(userId),
        onSuccess: (_, userId) => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(userId) });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};
