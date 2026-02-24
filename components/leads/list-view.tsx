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

interface LeadListViewProps {
    leads?: Lead[];
    loading?: boolean;
    onCreate?: () => void;
}

const LeadListView = ({ leads, loading, onCreate }: LeadListViewProps) => {
    const tLeadsPage = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const router = useRouter();
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
            sorter: (a: Lead, b: Lead) => (a.value || 0) - (b.value || 0),
            render: (value: number) => value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '-',
        },
        {
            title: tLeadsPage('status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            filters: [
                { text: 'NEW', value: 'NEW' },
                { text: 'CONTACTED', value: 'CONTACTED' },
                { text: 'QUALIFIED', value: 'QUALIFIED' },
                { text: 'WON', value: 'WON' },
                { text: 'LOST', value: 'LOST' },
            ],
            onFilter: (value: any, record: Lead) => record.status.toUpperCase() === (value as string).toUpperCase(),
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
            sorter: (a: Lead, b: Lead) => {
                const dateA = a.expectedCloseDate ? dayjs(a.expectedCloseDate).valueOf() : 0;
                const dateB = b.expectedCloseDate ? dayjs(b.expectedCloseDate).valueOf() : 0;
                return dateA - dateB;
            },
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
        <Table
            columns={columns}
            dataSource={leads || []}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
        />
    )
}

export default LeadListView
