import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ActivitiesService from '@/services/activities.service';
import { SearchQueryParams, ActivityDTO } from '@/types/api';
import { message } from 'antd';
import { useTranslations } from 'next-intl';

// Query Keys
export const activityKeys = {
    all: ['activities'] as const,
    lists: () => ['activities', 'list'] as const,
    list: (params: SearchQueryParams) => ['activities', 'list', params] as const,
    details: () => ['activities', 'detail'] as const,
    detail: (id: string | number) => ['activities', 'detail', id] as const,
};

// Hook to get all activities (paginated/searched)
export const useGetActivities = (params?: SearchQueryParams) => {
    return useQuery({
        queryKey: activityKeys.list(params || {}),
        queryFn: () => ActivitiesService.getAll(params),
    });
};

// Hook to get a single activity by ID
export const useGetActivity = (id: string | number, enabled: boolean = true) => {
    return useQuery({
        queryKey: activityKeys.detail(id),
        queryFn: () => ActivitiesService.getById(id),
        enabled: enabled && !!id,
    });
};

// Hook to create a new activity
export const useCreateActivity = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: ActivityDTO) => ActivitiesService.create(values),
        onSuccess: () => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to update an activity
export const useUpdateActivity = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: { id: string | number; values: ActivityDTO }) =>
            ActivitiesService.update(id, values),
        onSuccess: (_, { id }) => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
            queryClient.invalidateQueries({ queryKey: activityKeys.detail(id) });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to delete an activity
export const useDeleteActivity = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => ActivitiesService.delete(id),
        onSuccess: () => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};
