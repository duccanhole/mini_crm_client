'use client'

import React, { useState } from 'react';
import { Table, Space, Button, App, Tag } from 'antd';
import { useDeleteLead, useGetLeads, leadKeys } from '@/hooks/api/useLead';
import { Lead } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';
import dayjs from '@/lib/dayjs';

const LeadsPage = () => {
    const [pagination, setPagination] = useState<SearchQueryParams>({
        page: 0,
        size: 10,
    });

    const tLeadsPage = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: leadsData, isLoading } = useGetLeads(pagination);
    const deleteLeadMutation = useDeleteLead();

    const columns: any[] = [
        {
            title: tLeadsPage('customer'),
            dataIndex: ['customer', 'name'],
            fixed: 'left',
            key: 'customer',
            render: (text: string, record: Lead) => <a onClick={() => router.push(`/admin/leads/${record.id}`)}>{text || record.customer?.name || '-'}</a>,
            width: 200,
        },
        {
            title: tLeadsPage('value'),
            dataIndex: 'value',
            key: 'value',
            width: 150,
            render: (value: number) => value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '-',
        },
        {
            title: tLeadsPage('status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status: string) => {
                let color = 'processing';
                if (status === 'WON') color = 'success';
                if (status === 'LOST') color = 'error';
                return (
                    <Tag color={color}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: tLeadsPage('assignedTo'),
            dataIndex: ['assignedTo', 'name'],
            key: 'assignedTo',
            width: 200,
            render: (_: any, record: Lead) =>
            (
                record.assignedTo?.email ? <Space size="middle" onClick={() => router.push(`/admin/users/${record.assignedTo?.id}`)}>
                    <a>{record.assignedTo?.email}</a>
                </Space> : '-'
            )
        },
        {
            title: tLeadsPage('expectedCloseDate'),
            dataIndex: 'expectedCloseDate',
            key: 'expectedCloseDate',
            width: 200,
            render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
            title: tLeadsPage('action'),
            key: 'action',
            width: 150,
            render: (_: any, record: Lead) => (
                <Space size="middle">
                    <a onClick={() => router.push(`/admin/leads/${record.id}`)}>{tCommon('edit')}</a>
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
                    await deleteLeadMutation.mutateAsync(id);
                    queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
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
                <Button type="primary" onClick={() => router.push('/admin/leads/new')}>{tCommon('add new')}</Button>
            </div>

            <Table
                columns={columns}
                dataSource={leadsData?.data?.content || []}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: (leadsData?.data?.number || 0) + 1,
                    pageSize: leadsData?.data?.size || 10,
                    total: leadsData?.data?.totalElements || 0,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default LeadsPage
