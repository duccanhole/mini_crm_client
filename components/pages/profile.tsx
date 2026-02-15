'use client';

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Space, Typography, Tag, App } from 'antd';
import { useTranslations } from 'next-intl';
import { useUpdateUserProfile } from '@/hooks/api/useUser';
import { UserOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { VN_PHONE_REGEX } from '@/lib/validation';

const { Title, Text } = Typography;

const ProfilePage = () => {
    const t = useTranslations('ProfilePage');
    const tCommon = useTranslations('common');
    const tRegister = useTranslations('RegisterPage');
    const [form] = Form.useForm();
    const updateMutation = useUpdateUserProfile();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone || user.phoneNumber
            });
        }
    }, [form]);

    const onFinish = async (values: any) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const updateData = {
                name: values.name,
                phone: values.phone,
            };

            await updateMutation.mutateAsync({ id: user.id, values: updateData });

            // Cập nhật lại localStorage sau khi thành công
            const newUser = { ...user, ...updateData };
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (error) {
            console.error('Update profile failed:', error);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>

            <Card bordered={false} className="shadow-sm">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label={t('name')}
                        rules={[{ required: true, message: tRegister('nameRequired') }]}
                    >
                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder={t('name')} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={t('email')}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label={t('phone')}
                        rules={[
                            { pattern: VN_PHONE_REGEX, message: tRegister('phoneInvalid') }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder={t('phone')} />
                    </Form.Item>

                    <div className="flex justify-end mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={updateMutation.isPending}
                            size="large"
                            className="px-8"
                        >
                            {tCommon('save')}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ProfilePage;
