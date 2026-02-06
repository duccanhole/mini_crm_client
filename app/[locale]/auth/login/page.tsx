'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Flex, ConfigProvider, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link as NextLink } from '@/i18n/routing';
import AuthHeader from '@/components/AuthHeader';

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const t = useTranslations('LoginPage');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <AuthHeader isDarkMode={isDarkMode} setDarkMode={setIsDarkMode} />
        <Content>
          <Flex align="center" justify="center" style={{ height: 'calc(100vh - 64px)', paddingBottom: '64px' }}>
            <Card style={{ width: '100%', maxWidth: 400 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={3}>{t('title')}</Title>
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
                  label={t('email')}
                  name="email"
                  rules={[
                    { required: true, message: t('emailRequired') },
                    { type: 'email', message: t('emailInvalid') }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label={t('password')}
                  name="password"
                  rules={[
                    { required: true, message: t('passwordRequired') },
                    { min: 6, message: t('passwordMinLength') }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    {t('login')}
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">{t('noAccount')} </Text>
                  <NextLink href="/auth/register">{t('signUp')}</NextLink>
                </div>
              </Form>
            </Card>
          </Flex>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default LoginPage;
