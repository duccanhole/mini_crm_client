'use client'

import React, { useState } from 'react';
import { Table, Space, Button, App } from 'antd';
import { useDeleteCustomer, useGetCustomers, customerKeys } from '@/hooks/api/useCustomer';
import { Customer, User, UserRole } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from '@/i18n/routing';
import { useUserInfo } from '@/hooks/useUserInfo';
import { hasPermission } from '@/lib/rbac';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface CustomersViewPageProps {
    role?: string,
    query?: SearchQueryParams
}

const defaultQuery: SearchQueryParams = {
    page: 0,
    size: 10,
}

const CustomersViewPage = (props: CustomersViewPageProps) => {
    const { role, query } = props;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial values from URL or props
    const urlPage = parseInt(searchParams.get('page') || '1') - 1;
    const urlSize = parseInt(searchParams.get('size') || '10');

    const [pagination, setPagination] = useState<SearchQueryParams>({
        ...defaultQuery,
        page: urlPage >= 0 ? urlPage : 0,
        size: urlSize > 0 ? urlSize : 10,
        ...query
    });

    // Update URL when pagination changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', (pagination.page! + 1).toString());
        params.set('size', pagination.size!.toString());

        const newQuery = params.toString();
        if (newQuery !== searchParams.toString()) {
            router.replace(`${pathname}?${newQuery}`, { scroll: false });
        }
    }, [pagination.page, pagination.size, pathname, router, searchParams]);

    const tCustomersPage = useTranslations('CustomersPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const { data: customersData, isLoading } = useGetCustomers(pagination);
    const deleteCustomerMutation = useDeleteCustomer();

    const user = useUserInfo();

    const columns: any[] = [
        {
            title: tCustomersPage('name'),
            dataIndex: 'name',
            fixed: 'left',
            key: 'name',
            render: (text: string, record: Customer) => <a onClick={() => router.push(`/${role}/customers/${record.id}`)}>{text}</a>,
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
            title: tCustomersPage('notes'),
            dataIndex: 'notes',
            key: 'notes',
            width: 250,
            render: (text: string) => text || '-',
        },
        {
            title: tCustomersPage('saleId'),
            dataIndex: 'sale',
            key: 'sale',
            width: 250,
            render: (_: any, record: Customer) => (
                record.sale?.name ? <Space size="middle" onClick={() => router.push(`/${role}/users/${record.sale?.id}`)}>
                    <a>{record.sale?.name}</a>
                </Space> : '-'
            )
        },
        {
            title: tCustomersPage('action'),
            key: 'action',
            width: 150,
            render: (_: any, record: Customer) => (
                <Space size="middle">
                    {hasPermission(user?.role, 'customers', 'edit') && (
                        <a onClick={() => router.push(`/${role}/customers/${record.id}`)}>{tCommon('edit')}</a>
                    )}
                    {hasPermission(user?.role, 'customers', 'delete') && (
                        <a style={{ color: 'red' }} onClick={() => handleDelete(record.id as string)}>{tCommon('delete')}</a>
                    )}
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

    const handleCreate = () => {
        if (role === UserRole.SALE) {
            router.push(`/${role}/customers/new?saleId=${user?.id}`);
        } else {
            router.push(`/${role}/customers/new`);
        }
    }

    return (
        <div>
            <div className='flex justify-end !mb-4'>
                {hasPermission(user?.role, 'customers', 'edit') && (
                    <Button type="primary" onClick={handleCreate}>{tCommon('add new')}</Button>
                )}
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

export default CustomersViewPage
