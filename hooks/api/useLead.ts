import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LeadsService from '@/services/leads.service';
import { SearchQueryParams, LeadDTO } from '@/types/api';
import { message } from 'antd';
import { useTranslations } from 'next-intl';

// Query Keys
export const leadKeys = {
    all: ['leads'] as const,
    lists: () => ['leads', 'list'] as const,
    list: (params: SearchQueryParams) => ['leads', 'list', params] as const,
    details: () => ['leads', 'detail'] as const,
    detail: (id: string | number) => ['leads', 'detail', id] as const,
};

// Hook to get all leads (paginated/searched)
export const useGetLeads = (params?: SearchQueryParams) => {
    return useQuery({
        queryKey: leadKeys.list(params || {}),
        queryFn: () => LeadsService.getAll(params),
    });
};

// Hook to get a single lead by ID
export const useGetLead = (id: string | number, enabled: boolean = true) => {
    return useQuery({
        queryKey: leadKeys.detail(id),
        queryFn: () => LeadsService.getById(id),
        enabled: enabled && !!id,
    });
};

// Hook to create a new lead
export const useCreateLead = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: LeadDTO) => LeadsService.create(values),
        onSuccess: () => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to update a lead
export const useUpdateLead = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: { id: string | number; values: LeadDTO }) =>
            LeadsService.update(id, values),
        onSuccess: (_, { id }) => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to delete a lead
export const useDeleteLead = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => LeadsService.delete(id),
        onSuccess: () => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};
