import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UsersService from '@/services/users.service';
import { SearchQueryParams, UserDTO } from '@/types/api';
import { message } from 'antd';
import { useTranslations } from 'next-intl';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => ['users', 'list'] as const,
  list: (params: SearchQueryParams) => ['users', 'list', params] as const,
  details: () => ['users', 'detail'] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
};

// Hook to get all users (paginated/searched)
export const useGetUsers = (params?: SearchQueryParams) => {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => UsersService.getAll(params),
  });
};

// Hook to get a single user by ID
export const useGetUser = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => UsersService.getById(id),
    enabled: enabled && !!id,
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const t = useTranslations('common');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UserDTO) => UsersService.create(values),
    onSuccess: () => {
      message.success(t('successful'));
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || t('failed'));
    },
  });
};

// Hook to update a user (Admin function usually)
export const useUpdateUser = () => {
  const t = useTranslations('common');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<UserDTO> }) => UsersService.update(id, values as UserDTO),
    onSuccess: (_, { id }) => {
      message.success(t('successful'));
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
    onError: (error: any) => {
      message.error(error.message || t('failed'));
    },
  });
};

// Hook to update a user profile (e.g., self-update from user perspective)
export const useUpdateUserProfile = () => {
  const t = useTranslations('common');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) => UsersService.updateUser(id, values),
    onSuccess: (_, { id }) => {
      message.success(t('successful'));
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
    onError: (error: any) => {
      message.error(error.message || t('failed'));
    },
  });
};

export const useDeleteUser = () => {
  const t = useTranslations('common');
  return useMutation({
    mutationFn: (id: string) => UsersService.delete(id),
    onSuccess: () => {
      message.success(t('successful'));
    },
    onError: (error: any) => {
      message.error(error.message || t('failed'));
    },
  });
};

// Hook to change password
export const useChangePassword = () => {
  const t = useTranslations('common');
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) => UsersService.changePassword(id, values),
    onSuccess: () => {
      message.success(t('successful'));
    },
    onError: (error: any) => {
      message.error(error.message || t('failed'));
    },
  });
};

// Hook to reset password
export const useResetPassword = () => {
  const t = useTranslations('common');
  return useMutation({
    mutationFn: (id: string) => UsersService.resetPassword(id),
    onSuccess: () => {
      message.success(t('successful'));
    },
    onError: (error: any) => {
      message.error(error.message || t('failed'));
    },
  });
};
