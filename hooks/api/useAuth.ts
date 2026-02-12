import { useMutation, useQuery } from '@tanstack/react-query';
import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { LoginRequest, RegisterRequest } from '@/types/api';

import Cookies from 'js-cookie';

export const useLogin = () => {
  //   const t = useTranslations('ApiMessage');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');

  return useMutation({
    mutationFn: (values: LoginRequest) => AuthService.login(values),
    onSuccess: (response) => {
      if (response.status === 200) {
        // Set cookies with js-cookie
        Cookies.set('token', response.data.token, { expires: 7 }); // Expires in 7 days
        Cookies.set('role', response.data.role, { expires: 7 });
        // Store user info in localStorage is fine for UI, or keep in cookie too. Let's keep in localStorage for simplicity or update to Cookie if needed. 
        // For now, let's stick to localStorage for user object as it might be large, but token MUST be in cookie for middleware.
        localStorage.setItem('user', JSON.stringify(response.data));

        const role = response.data?.role
        switch (role) {
          case 'admin':
            router.push(`/${locale}/admin/users`);
            break;
          case 'sale':
            router.push(`/${locale}/sale/users`);
            break;
          default:
            break;
        }
        // router.push('/admin/dashboard');
      }
    },
    // onError: (error: Error) => {
    //   message.error(error.message || 'Login failed');
    // }
  });
};

export const useRegister = () => {
  const router = useRouter();
  const t = useTranslations('msg');

  return useMutation({
    mutationFn: (values: RegisterRequest) => AuthService.register(values),
    onSuccess: (response) => {
      if (response?.status === 200 || response?.status === 201) {
        message.success(t('Registration successful'));
        router.push('/auth/login');
      }
    }
  });
};
