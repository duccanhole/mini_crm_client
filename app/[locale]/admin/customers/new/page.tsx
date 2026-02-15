'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, App, Select } from 'antd';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCreateCustomer } from '@/hooks/api/useCustomer';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { CustomerDTO } from '@/types/api';
import { VN_PHONE_REGEX } from '@/lib/validation';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetUsers } from '@/hooks/api/useUser';

const { TextArea } = Input;

const Option = Select.Option;

const CustomerCreatePage = () => {
    const router = useRouter();
    const t = useTranslations('CustomersPage');
    const tCommon = useTranslations('common');
    const tRegister = useTranslations('RegisterPage');
    const [form] = Form.useForm();

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { data: usersResponse, isLoading: isFetchingUsers } = useGetUsers({
        size: 1000,
        search: debouncedSearchTerm
    });

    const createMutation = useCreateCustomer();

    const onFinish = async (values: any) => {
        try {
            const createData: CustomerDTO = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                company: values.company,
                notes: values.notes,
            };
            await createMutation.mutateAsync(createData);
            router.push('/admin/customers');
        } catch (error) {
            console.error('Create failed:', error);
        }
    };

    const onSearchSale = (value: string) => {
        setSearchTerm(value);
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
                        <Input placeholder={t('name')} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={t('email')}
                        rules={[
                            { required: true, message: tRegister('emailRequired') },
                            { type: 'email', message: tRegister('emailInvalid') }
                        ]}
                    >
                        <Input placeholder={t('email')} />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label={t('phone')}
                        rules={[
                            { required: true, message: tRegister('phoneRequired') },
                            { pattern: VN_PHONE_REGEX, message: tRegister('phoneInvalid') }
                        ]}
                    >
                        <Input placeholder={t('phone')} />
                    </Form.Item>

                    <Form.Item
                        name="company"
                        label={t('company')}
                    >
                        <Input placeholder={t('company')} />
                    </Form.Item>

                    <Form.Item
                        name="saleId"
                        label={t('saleId')}
                    >
                        <Select
                            showSearch={{ filterOption: false, onSearch: onSearchSale }}
                            placeholder={t('saleId')}
                            loading={isFetchingUsers}
                        >
                            {usersResponse?.data?.content?.map((user: any) => (
                                <Option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="notes"
                        label={t('notes')}
                    >
                        <TextArea rows={4} placeholder={t('notes')} />
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

export default CustomerCreatePage;
