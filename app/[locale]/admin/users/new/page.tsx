'use client';

import React from 'react';
import { Form, Input, Button, Card, Select, Space, Typography, App } from 'antd';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCreateUser } from '@/hooks/api/useUser';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { UserDTO } from '@/types/api';
import { VN_PHONE_REGEX } from '@/lib/validation';

const { Title } = Typography;
const { Option } = Select;

const UserCreatePage = () => {
    const router = useRouter();
    const t = useTranslations('UsersPage');
    const tCommon = useTranslations('common');
    const tRegister = useTranslations('RegisterPage');
    const [form] = Form.useForm();

    const createMutation = useCreateUser();

    const onFinish = async (values: any) => {
        try {
            const createData: UserDTO = {
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                role: values.role,
                password: values.password,
                status: 'active',
            };
            await createMutation.mutateAsync(createData);
            router.push('/admin/users');
        } catch (error) {
            console.error('Create failed:', error);
        }
    };

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
                    initialValues={{ role: 'sale' }}
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
                        name="password"
                        label={tRegister('password')}
                        rules={[
                            { required: true, message: tRegister('passwordRequired') },
                            { min: 6, message: tRegister('passwordMinLength') }
                        ]}
                    >
                        <Input.Password placeholder={tRegister('password')} />
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

                    <Form.Item className="mb-0 mt-8">
                        <Space className='flex justify-end !w-full'>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createMutation.isPending}
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

export default UserCreatePage;
