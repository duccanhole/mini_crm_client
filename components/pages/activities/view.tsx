'use client';

import React, { useState, useEffect } from 'react';
import { Table, Space, Button, App, Tag } from 'antd';
import { useDeleteActivity, useGetActivities, activityKeys } from '@/hooks/api/useActivity';
import { Activity } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';
import dayjs from '@/lib/dayjs';
import { useUserInfo } from '@/hooks/useUserInfo';
import { hasPermission } from '@/lib/rbac';

interface ActivitiesViewPageProps {
    query?: SearchQueryParams;
    role?: string;
}

const defaultQuery: SearchQueryParams = {
    page: 0,
    size: 10,
}

const ActivitiesViewPage = ({ query, role }: ActivitiesViewPageProps) => {
    const [pagination, setPagination] = useState<SearchQueryParams>({ ...defaultQuery, ...query });

    useEffect(() => {
        setPagination((prev) => ({ ...prev, ...query }));
    }, [JSON.stringify(query)]);

    const tActivitiesPage = useTranslations('ActivitiesPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const router = useRouter();
    const user = useUserInfo();
    const { data: activitiesData, isLoading } = useGetActivities(pagination);
    const deleteActivityMutation = useDeleteActivity();

    const columns: any[] = [
        {
            title: tActivitiesPage('type'),
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: string) => (
                <Tag color="blue">
                    {type}
                </Tag>
            ),
        },
        {
            title: tActivitiesPage('description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 300,
        },
        {
            title: tActivitiesPage('lead'),
            dataIndex: ['lead', 'id'],
            key: 'lead',
            width: 150,
            render: (_: any, record: Activity) => (
                record.lead ? (
                    <a onClick={() => router.push(`/${role}/leads/view?id=${record.lead.id}`)}>
                        Lead #{record.lead.id}
                    </a>
                ) : '-'
            ),
        },
        {
            title: tActivitiesPage('customer'),
            dataIndex: ['lead', 'customer', 'name'],
            key: 'customer',
            width: 200,
            render: (_: any, record: Activity) => (
                record.lead?.customer ? (
                    <a onClick={() => router.push(`/${role}/customers/${record.lead.customer.id}`)}>
                        {record.lead.customer.name}
                    </a>
                ) : '-'
            ),
        },
        {
            title: tActivitiesPage('createdBy'),
            dataIndex: ['createdBy', 'name'],
            key: 'createdBy',
            width: 200,
            render: (_: any, record: Activity) => (
                record.createdBy?.email ? (
                    <a onClick={() => router.push(`/${role}/users/${record.createdBy.id}`)}>
                        {record.createdBy.name || record.createdBy.email}
                    </a>
                ) : '-'
            ),
        },
        {
            title: tActivitiesPage('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
            title: tActivitiesPage('action'),
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_: any, record: Activity) => (
                <Space size="middle">
                    {/* <a onClick={() => router.push(`/admin/activities/${record.id}`)}>{tCommon('edit')}</a> */}
                    {hasPermission(user?.role, 'activities', 'delete') && (
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
                    await deleteActivityMutation.mutateAsync(id);
                    queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
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
            {/* <div className='flex justify-end !mb-4'>
                <Button type="primary" onClick={() => router.push('/admin/activities/new')}>
                    {tCommon('add new')}
                </Button>
            </div> */}

            <Table
                columns={columns}
                dataSource={activitiesData?.data?.content || []}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: (activitiesData?.data?.number || 0) + 1,
                    pageSize: activitiesData?.data?.size || 10,
                    total: activitiesData?.data?.totalElements || 0,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default ActivitiesViewPage;
