'use client'

import React, { useState } from 'react';
import { Table, Space, Button, App } from 'antd';
import { useDeleteCustomer, useGetCustomers, customerKeys } from '@/hooks/api/useCustomer';
import { Customer, User } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';
import { title } from 'process';

const CustomersPage = () => {
    const [pagination, setPagination] = useState<SearchQueryParams>({
        page: 0,
        size: 10,
    });

    const tCustomersPage = useTranslations('CustomersPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: customersData, isLoading } = useGetCustomers(pagination);
    const deleteCustomerMutation = useDeleteCustomer();

    const columns: any[] = [
        {
            title: tCustomersPage('name'),
            dataIndex: 'name',
            fixed: 'left',
            key: 'name',
            render: (text: string, record: Customer) => <a onClick={() => router.push(`/admin/customers/${record.id}`)}>{text}</a>,
            width: 200,
        },
        {
            title: tCustomersPage('email'),
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: tCustomersPage('phone'),
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        },
        {
            title: tCustomersPage('company'),
            dataIndex: 'company',
            key: 'company',
            width: 200,
            render: (text: string) => text || '-',
        },
        {
            title: tCustomersPage('saleId'),
            dataIndex: 'sale',
            key: 'sale',
            width: 250,
            render: (_: any, record: Customer) => (
                record.sale?.email ? <Space size="middle" onClick={() => router.push(`/admin/users/${record.sale?.id}`)}>
                    <a>{record.sale?.email}</a>
                </Space> : '-'
            )
        },
        {
            title: tCustomersPage('action'),
            key: 'action',
            width: 150,
            render: (_: any, record: Customer) => (
                <Space size="middle">
                    <a onClick={() => router.push(`/admin/customers/${record.id}`)}>{tCommon('edit')}</a>
                    <a style={{ color: 'red' }} onClick={() => handleDelete(record.id as string)}>{tCommon('delete')}</a>
                </Space>
            ),
        },
    ];

    const handleTableChange = (newPagination: any) => {
        setPagination({
            ...pagination,
            page: newPagination.current - 1,
            size: newPagination.pageSize,
        });
    };

    const { modal } = App.useApp();

    const handleDelete = (id: string) => {
        modal.confirm({
            title: tCommon('deleteTitle'),
            content: tCommon('deleteConfirm'),
            okText: tCommon('confirm'),
            cancelText: tCommon('cancel'),
            onOk: async () => {
                try {
                    await deleteCustomerMutation.mutateAsync(id);
                    queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
                } catch (error) {
                    console.log(error);
                }
            },
            okButtonProps: { danger: true },
            centered: true,
        });
    };

    return (
        <div>
            <div className='flex justify-end !mb-4'>
                <Button type="primary" onClick={() => router.push('/admin/customers/new')}>{tCommon('add new')}</Button>
            </div>

            <Table
                columns={columns}
                dataSource={customersData?.data?.content || []}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: (customersData?.data?.number || 0) + 1,
                    pageSize: customersData?.data?.size || 10,
                    total: customersData?.data?.totalElements || 0,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default CustomersPage
