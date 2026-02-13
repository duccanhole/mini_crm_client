'use client'

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Space, Spin, App, Select } from 'antd';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useGetCustomer, useUpdateCustomer } from '@/hooks/api/useCustomer';
import { useGetUsers } from '@/hooks/api/useUser';
import { useDebounce } from '@/hooks/useDebounce';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { CustomerDTO, SearchQueryParams } from '@/types/api';
import { VN_PHONE_REGEX } from '@/lib/validation';

const { TextArea } = Input;
const { Option } = Select;

const CustomerDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const t = useTranslations('CustomersPage');
    const tCommon = useTranslations('common');
    const tRegister = useTranslations('RegisterPage');
    const [form] = Form.useForm();

    const { data: customerResponse, isLoading: isFetching } = useGetCustomer(id);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: usersResponse, isLoading: isFetchingUsers } = useGetUsers({
        size: 1000,
        search: debouncedSearchTerm
    });

    const updateMutation = useUpdateCustomer();

    useEffect(() => {
        if (customerResponse?.data) {
            const customer = customerResponse.data;
            form.setFieldsValue({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                company: customer.company,
                notes: customer.notes,
                saleId: customer.sale?.id,
            });
        }
    }, [customerResponse, form]);

    const onFinish = async (values: any) => {
        try {
            const updateData: CustomerDTO = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                company: values.company,
                notes: values.notes,
                saleId: values.saleId,
            };
            await updateMutation.mutateAsync({ id, values: updateData });
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const onSearchSale = (value: string) => {
        setSearchTerm(value);
    }

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

export default CustomerDetailPage;
