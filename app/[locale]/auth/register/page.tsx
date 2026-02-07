'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Flex, ConfigProvider, theme } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link as NextLink } from '@/i18n/routing';
import AuthHeader from '@/components/AuthHeader';
import { useDarkMode } from '@/components/providers/ThemeProvider';

const { Title, Text } = Typography;
const { Content } = Layout;

const RegisterPage = () => {
    const t = useTranslations('RegisterPage');
    const { mode, toggleTheme } = useDarkMode();

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AuthHeader isDarkMode={mode === 'dark'} setDarkMode={toggleTheme} />
            <Content>
                <Flex align="center" justify="center" style={{ height: 'calc(100vh - 64px)', paddingBottom: '64px' }}>
                    <Card style={{ width: '100%', maxWidth: 400 }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Title level={3}>{t('title')}</Title>
                        </div>

                        <Form
                            name="register"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            size="large"
                        >
                            <Form.Item
                                label={t('name')}
                                name="name"
                                rules={[
                                    { required: true, message: t('nameRequired') }
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder={t('name')} />
                            </Form.Item>

                            <Form.Item
                                label={t('phone')}
                                name="phone"
                                rules={[
                                    { required: true, message: t('phoneRequired') }
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder={t('phone')} />
                            </Form.Item>

                            <Form.Item
                                label={t('password')}
                                name="password"
                                rules={[
                                    { required: true, message: t('passwordRequired') },
                                    { min: 6, message: t('passwordMinLength') }
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder={t('password')} />
                            </Form.Item>

                            <Form.Item
                                label={t('confirmPassword')}
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: t('confirmPasswordRequired') },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('passwordMismatch')));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder={t('confirmPassword')} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block className='!mt-4'>
                                    {t('register')}
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">{t('haveAccount')} </Text>
                                <NextLink href="/auth/login">{t('signIn')}</NextLink>
                            </div>
                        </Form>
                    </Card>
                </Flex>
            </Content>
        </Layout>
    );
};

export default RegisterPage;
