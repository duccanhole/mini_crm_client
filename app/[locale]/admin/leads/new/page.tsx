'use client';

import React, { useState } from 'react';
import { Form, Button, Card, Space, Select, InputNumber, DatePicker } from 'antd';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCreateLead } from '@/hooks/api/useLead';
import { useGetCustomers } from '@/hooks/api/useCustomer';
import { useGetUsers } from '@/hooks/api/useUser';
import { useDebounce } from '@/hooks/useDebounce';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { LeadDTO } from '@/types/api';
import dayjs from '@/lib/dayjs';

const { Option } = Select;

const LeadCreatePage = () => {
    const router = useRouter();
    const t = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');
    const [form] = Form.useForm();

    const [customerSearch, setCustomerSearch] = useState('');
    const debouncedCustomerSearch = useDebounce(customerSearch, 500);
    const { data: customersResponse, isLoading: isFetchingCustomers } = useGetCustomers({
        size: 100,
        search: debouncedCustomerSearch
    });

    const [userSearch, setUserSearch] = useState('');
    const debouncedUserSearch = useDebounce(userSearch, 500);
    const { data: usersResponse, isLoading: isFetchingUsers } = useGetUsers({
        size: 100,
        search: debouncedUserSearch
    });

    const createMutation = useCreateLead();

    const onFinish = async (values: any) => {
        try {
            const createData: LeadDTO = {
                customerId: values.customerId,
                value: values.value,
                status: values.status,
                assignedToId: values.assignedToId,
                expectedCloseDate: values.expectedCloseDate ? values.expectedCloseDate.format('YYYY-MM-DDTHH:mm:ss') : undefined,
            };
            await createMutation.mutateAsync(createData);
            router.push('/admin/leads');
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
                    initialValues={{ status: 'NEW' }}
                >
                    <Form.Item
                        name="customerId"
                        label={t('customer')}
                        rules={[{ required: true, message: tCommon('failed') }]}
                    >
                        <Select
                            showSearch
                            filterOption={false}
                            onSearch={setCustomerSearch}
                            placeholder={t('customer')}
                            loading={isFetchingCustomers}
                        >
                            {customersResponse?.data?.content?.map((customer: any) => (
                                <Option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="value"
                        label={t('value')}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            suffix="₫"
                            placeholder={t('value')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label={t('status')}
                        rules={[{ required: true }]}
                    >
                        <Select placeholder={t('status')}>
                            <Option value="NEW">NEW</Option>
                            <Option value="CONTACTED">CONTACTED</Option>
                            <Option value="QUALIFIED">QUALIFIED</Option>
                            <Option value="PROPOSAL">PROPOSAL</Option>
                            <Option value="NEGOTIATION">NEGOTIATION</Option>
                            <Option value="WON">WON</Option>
                            <Option value="LOST">LOST</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="assignedToId"
                        label={t('assignedTo')}
                    >
                        <Select
                            showSearch
                            filterOption={false}
                            onSearch={setUserSearch}
                            placeholder={t('assignedTo')}
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
                        name="expectedCloseDate"
                        label={t('expectedCloseDate')}
                    >
                        <DatePicker showTime minDate={dayjs()} style={{ width: '100%' }} />
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

export default LeadCreatePage;
