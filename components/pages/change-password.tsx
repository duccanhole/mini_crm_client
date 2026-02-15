'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { useTranslations } from 'next-intl';
import { useChangePassword } from '@/hooks/api/useUser';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ChangePasswordPage = () => {
    const t = useTranslations('ChangePasswordPage');
    const tCommon = useTranslations('common');
    const tRegister = useTranslations('RegisterPage');
    const [form] = Form.useForm();
    const changePasswordMutation = useChangePassword();

    const onFinish = async (values: any) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const updateData = {
                currentPassword: values.oldPassword,
                newPassword: values.newPassword,
            };

            await changePasswordMutation.mutateAsync({ id: user.id, values: updateData });
            form.resetFields();
        } catch (error) {
            console.error('Change password failed:', error);
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
                        name="oldPassword"
                        label={t('oldPassword')}
                        rules={[{ required: true, message: t('oldPasswordRequired') }]}
                    >
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder={t('oldPassword')} />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label={t('newPassword')}
                        rules={[
                            { required: true, message: t('newPasswordRequired') },
                            { min: 6, message: tRegister('passwordMinLength') }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder={t('newPassword')} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={t('confirmPassword')}
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: tRegister('confirmPasswordRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(tRegister('passwordMismatch')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder={t('confirmPassword')} />
                    </Form.Item>

                    <div className="flex justify-end mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={changePasswordMutation.isPending}
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

export default ChangePasswordPage;
