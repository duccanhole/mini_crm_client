'use client'

import React, { useState } from 'react';
import { Table, Space, Button, App, Tag, theme, Flex } from 'antd';
import { useDeleteLead, useGetLeads, leadKeys } from '@/hooks/api/useLead';
import { Lead } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';
import dayjs from '@/lib/dayjs';
import { useUserInfo } from '@/hooks/useUserInfo';
import { hasPermission } from '@/lib/rbac';
import { title } from 'process';

interface LeadListViewProps {
    leads?: Lead[];
    loading?: boolean;
    onCreate?: () => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    role?: string;
}

const LeadListView = ({
    leads,
    loading,
    onCreate,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    role = 'admin'
}: LeadListViewProps) => {
    const tLeadsPage = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');
    const { token } = theme.useToken();

    const queryClient = useQueryClient();
    const router = useRouter();
    const user = useUserInfo();
    const currentRole = role || user?.role || 'admin';
    const deleteLeadMutation = useDeleteLead();

    const columns: any[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 75,
            render: (text: string, record: Lead) => <a onClick={() => router.push(`/${role}/leads/view?id=${record.id}`)}>{text}</a>,
        },
        {
            title: tLeadsPage('customer'),
            dataIndex: ['customer', 'name'],
            key: 'customer',
            render: (text: string, record: Lead) => <a onClick={() => router.push(`/${role}/customers/${record.customer?.id}`)}>{text || record.customer?.name || '-'}</a>,
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
                switch (status.toUpperCase()) {
                    case 'NEW':
                        color = 'default';
                        break;
                    case 'CONTACTED':
                        color = 'warning';
                        break;
                    case 'QUALIFIED':
                        color = 'processing';
                        break;
                    case 'WON':
                        color = 'success';
                        break;
                    case 'LOST':
                        color = 'error';
                        break;
                    default:
                        color = 'default';
                }
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
                record.assignedTo?.name ? <Space size="middle" onClick={() => router.push(`/${role}/users/${record.assignedTo?.id}`)}>
                    <a>{record.assignedTo?.name}</a>
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
                    <a onClick={() => router.push(`/${role}/leads/view?id=${record.id}`)}>{tCommon('view')}</a>
                    {hasPermission(user?.role, 'leads', 'edit') && (
                        <a onClick={() => router.push(`/${role}/leads/${record.id}`)}>{tCommon('edit')}</a>
                    )}
                    {hasPermission(user?.role, 'leads', 'delete') && (
                        <a style={{ color: 'red' }} onClick={() => handleDelete(record.id as string)}>{tCommon('delete')}</a>
                    )}
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
        <Flex vertical gap={token.marginMD}>
            <Table
                columns={columns}
                dataSource={leads || []}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
            {hasMore && (
                <Flex justify="center" style={{ padding: `${token.paddingMD}px 0` }}>
                    <Button
                        onClick={onLoadMore}
                        loading={loadingMore}
                        style={{ borderRadius: token.borderRadiusLG }}
                    >
                        {tCommon('loadMore')}
                    </Button>
                </Flex>
            )}
        </Flex>
    )
}

export default LeadListView
