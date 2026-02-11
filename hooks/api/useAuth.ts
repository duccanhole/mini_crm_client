import { useMutation, useQuery } from '@tanstack/react-query';
import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useLocale } from 'next-intl';
import { LoginRequest, RegisterRequest } from '@/types/api';

export const useLogin = () => {
//   const t = useTranslations('ApiMessage');
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (values: LoginRequest) => AuthService.login(values),
    onSuccess: (response) => {
      if (response.status === 200) {
        cookieStore.set('token', response.data.token);
        cookieStore.set('user', JSON.stringify(response.data));
        const role = response.data?.role
        switch (role) {
          case 'admin':
            router.push(`/${locale}/admin/dashboard`);
            break;
          case 'sale':
            router.push(`/${locale}/sale/dashboard`);
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

  return useMutation({
    mutationFn: (values: RegisterRequest) => AuthService.register(values),
    onSuccess: (response) => {
      if (response.status === 200) {
        message.success(response.message || 'Registration successful');
        router.push('/auth/login');
      }
    }
  });
};
