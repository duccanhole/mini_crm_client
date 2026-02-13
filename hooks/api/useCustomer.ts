import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CustomersService from '@/services/customers.service';
import { SearchQueryParams, CustomerDTO } from '@/types/api';
import { message } from 'antd';
import { useTranslations } from 'next-intl';

// Query Keys
export const customerKeys = {
    all: ['customers'] as const,
    lists: () => ['customers', 'list'] as const,
    list: (params: SearchQueryParams) => ['customers', 'list', params] as const,
    details: () => ['customers', 'detail'] as const,
    detail: (id: string | number) => ['customers', 'detail', id] as const,
};

// Hook to get all customers (paginated/searched)
export const useGetCustomers = (params?: SearchQueryParams) => {
    return useQuery({
        queryKey: customerKeys.list(params || {}),
        queryFn: () => CustomersService.getAll(params),
    });
};

// Hook to get a single customer by ID
export const useGetCustomer = (id: string | number, enabled: boolean = true) => {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => CustomersService.getById(id),
        enabled: enabled && !!id,
    });
};

// Hook to create a new customer
export const useCreateCustomer = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: CustomerDTO) => CustomersService.create(values),
        onSuccess: () => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to update a customer
export const useUpdateCustomer = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: { id: string | number; values: CustomerDTO }) =>
            CustomersService.update(id, values),
        onSuccess: (_, { id }) => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};

// Hook to delete a customer
export const useDeleteCustomer = () => {
    const t = useTranslations('common');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => CustomersService.delete(id),
        onSuccess: () => {
            message.success(t('successful'));
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
        onError: (error: any) => {
            message.error(error.message || t('failed'));
        },
    });
};
