'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Flex, ConfigProvider, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link as NextLink } from '@/i18n/routing';
import AuthHeader from '@/components/AuthHeader';
import { useDarkMode } from '@/components/providers/ThemeProvider';
import { useLogin } from '@/hooks/api/useAuth';

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const TRANSLATIONS_PAGE = 'LoginPage';
  const t = useTranslations();
  const { mode, toggleTheme } = useDarkMode();
  const [message, setMessage] = useState<string>('');
  const loginMutation = useLogin();

  const onFinish = async (values: any) => {
    setMessage('');
    try {
      await loginMutation.mutateAsync(values);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AuthHeader isDarkMode={mode === 'dark'} setDarkMode={toggleTheme} />
      <Content>
        <Flex align="center" justify="center" style={{ height: 'calc(100vh - 64px)', paddingBottom: '64px' }}>
          <Card style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3}>{t(`${TRANSLATIONS_PAGE}.title`)}</Title>
            </div>

            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ remember: true }}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                label={t(`${TRANSLATIONS_PAGE}.email`)}
                name="email"
                rules={[
                  { required: true, message: t(`${TRANSLATIONS_PAGE}.emailRequired`) },
                  { type: 'email', message: t(`${TRANSLATIONS_PAGE}.emailInvalid`) }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                label={t(`${TRANSLATIONS_PAGE}.password`)}
                name="password"
                rules={[
                  { required: true, message: t(`${TRANSLATIONS_PAGE}.passwordRequired`) },
                  { min: 6, message: t(`${TRANSLATIONS_PAGE}.passwordMinLength`) }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                {message &&
                  <p className='text-red-400 text-center'>{t(`msg.${message}`)}</p>
                }
                <Button type="primary" htmlType="submit" block className='!mt-4' loading={loginMutation.isPending}>
                  {t(`${TRANSLATIONS_PAGE}.login`)}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">{t(`${TRANSLATIONS_PAGE}.noAccount`)} </Text>
                <NextLink href="/auth/register">{t(`${TRANSLATIONS_PAGE}.signUp`)}</NextLink>
              </div>
            </Form>
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default LoginPage;
