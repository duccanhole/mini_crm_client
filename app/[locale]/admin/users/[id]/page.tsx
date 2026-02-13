'use client';

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Select, Space, Typography, Spin, App } from 'antd';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useGetUser, useUpdateUser } from '@/hooks/api/useUser';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { UserDTO } from '@/types/api';
import { VN_PHONE_REGEX } from '@/lib/validation';

const { Title } = Typography;
const { Option } = Select;

const UserDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const t = useTranslations('UsersPage');
    const tCommon = useTranslations('common');
    const tRegister = useTranslations('RegisterPage');
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const { data: userResponse, isLoading: isFetching } = useGetUser(id);
    const updateMutation = useUpdateUser();

    useEffect(() => {
        if (userResponse?.data) {
            const user = userResponse.data;
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phoneNumber: (user as any).phone || (user as any).phoneNumber,
                role: user.role,
                status: user.status,
            });
        }
    }, [userResponse, form]);

    const onFinish = async (values: any) => {
        try {
            const updateData: UserDTO = {
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                role: values.role,
                status: values.status,
            };
            if (!updateData.phoneNumber) {
                delete updateData.phoneNumber;
            }
            await updateMutation.mutateAsync({ id, values: updateData });
            // The hook already shows success message
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <Spin size="large" tip={tCommon('processing')} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="flex justify-between items-center mb-6">
                <Space direction="vertical" size={0}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        className="p-0 mb-2"
                    >
                        {tCommon('back')}
                    </Button>
                </Space>
            </div>

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
                        <Input placeholder={tRegister('name')} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={t('email')}
                        rules={[
                            { required: true, message: tRegister('emailRequired') },
                            { type: 'email', message: tRegister('emailInvalid') }
                        ]}
                    >
                        <Input placeholder={tRegister('email')} />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label={t('phone')}
                        rules={[
                            {
                                pattern: VN_PHONE_REGEX, message: tRegister('phoneInvalid')
                            }]}
                    >
                        <Input placeholder={tRegister('phone')} />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label={t('role')}
                        rules={[{ required: true, message: t('roleRequired') || 'Role is required' }]}
                    >
                        <Select placeholder={t('role')}>
                            <Option value="admin">ADMIN</Option>
                            <Option value="manager">MANAGER</Option>
                            <Option value="sale">SALE</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label={t('status')}
                        rules={[{ required: true, message: t('statusRequired') || 'Status is required' }]}
                    >
                        <Select placeholder={t('status')}>
                            <Option value="active">ACTIVE</Option>
                            <Option value="inactive">INACTIVE</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-0 mt-8">
                        <Space className='flex justify-end !w-full'>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateMutation.isPending}
                            >
                                {tCommon('confirm')}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UserDetailPage;
