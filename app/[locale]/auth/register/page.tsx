'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Flex, ConfigProvider, theme } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link as NextLink } from '@/i18n/routing';
import AuthHeader from '@/components/AuthHeader';
import { useDarkMode } from '@/components/providers/ThemeProvider';
import { useRegister } from '@/hooks/api/useAuth';
import { VN_PHONE_REGEX } from '@/lib/validation';

const { Title, Text } = Typography;
const { Content } = Layout;

const RegisterPage = () => {
    const TRANSLATIONS_PAGE = 'RegisterPage';
    const t = useTranslations();
    const { mode, toggleTheme } = useDarkMode();
    const [message, setMessage] = useState<string>('');
    const registerMutation = useRegister();

    const onFinish = async (values: any) => {
        console.log('Register:', values);
        try {
            setMessage('');
            await registerMutation.mutateAsync({
                name: values.name,
                phoneNumber: values.phone,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                role: 'sale'
            });
        } catch (error: any) {
            setMessage(error.message);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AuthHeader isDarkMode={mode === 'dark'} setDarkMode={toggleTheme} />
            <Content>
                <Flex align="center" justify="center" style={{ paddingBottom: '64px' }}>
                    <Card style={{ width: '100%', maxWidth: 550 }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Title level={3}>{t(`${TRANSLATIONS_PAGE}.title`)}</Title>
                        </div>

                        <Form
                            name="register"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            size="large"
                        >
                            <Form.Item
                                label={t(`${TRANSLATIONS_PAGE}.name`)}
                                name="name"
                                rules={[
                                    { required: true, message: t(`${TRANSLATIONS_PAGE}.nameRequired`) }
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder={t(`${TRANSLATIONS_PAGE}.name`)} />
                            </Form.Item>

                            <Form.Item
                                label={t(`${TRANSLATIONS_PAGE}.phone`)}
                                name="phone"
                                rules={[
                                    { required: true, message: t(`${TRANSLATIONS_PAGE}.phoneRequired`) },
                                    { pattern: VN_PHONE_REGEX, message: t(`${TRANSLATIONS_PAGE}.phoneInvalid`) }
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder={t(`${TRANSLATIONS_PAGE}.phone`)} />
                            </Form.Item>

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

                            <Form.Item
                                label={t(`${TRANSLATIONS_PAGE}.confirmPassword`)}
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: t(`${TRANSLATIONS_PAGE}.confirmPasswordRequired`) },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t(`${TRANSLATIONS_PAGE}.passwordMismatch`)));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder={t(`${TRANSLATIONS_PAGE}.confirmPassword`)} />
                            </Form.Item>

                            <Form.Item>
                                {message &&
                                    <p className='text-red-400 text-center'>{t(`msg.${message}`)}</p>
                                }
                                <Button type="primary" htmlType="submit" block className='!mt-4' loading={registerMutation.isPending}>
                                    {t(`${TRANSLATIONS_PAGE}.register`)}
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">{t(`${TRANSLATIONS_PAGE}.haveAccount`)} </Text>
                                <NextLink href="/auth/login">{t(`${TRANSLATIONS_PAGE}.signIn`)}</NextLink>
                            </div>
                        </Form>
                    </Card>
                </Flex>
            </Content>
        </Layout>
    );
};

export default RegisterPage;
