'use client'

import React, { useState } from 'react';
import { Table, Tag, Space, Typography, Button, App, message } from 'antd';
import { useDeleteUser, useGetUsers, useResetPassword, userKeys } from '@/hooks/api/useUser';
import { User } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

const UsersPage = () => {
    const [pagination, setPagination] = useState<SearchQueryParams>({
        page: 0,
        size: 10,
    });

    const tUsersPage = useTranslations('UsersPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const { data: usersData, isLoading } = useGetUsers(pagination);
    const deleteUserMutation = useDeleteUser();
    const resetPasswordMutation = useResetPassword();

    const columns: any[] = [
        {
            title: tUsersPage('name'),
            dataIndex: 'name',
            fixed: 'left',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
            width: 150,
        },
        {
            title: tUsersPage('email'),
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: tUsersPage('phone'),
            dataIndex: 'phone',
            key: 'phone', // Note: User model has 'phone', check if response actually has it or 'phoneNumber'
            render: (text: string, record: User) => text || (record as any).phoneNumber || '-',
            width: 150,
        },
        {
            title: tUsersPage('role'),
            key: 'role',
            dataIndex: 'role',
            width: 150,
            render: (role: string) => {
                let color = 'blue';
                switch (role) {
                    case 'admin':
                        color = 'purple';
                        break;
                    case 'manager':
                        color = 'orange';
                        break;
                    default:
                        color = 'blue';
                        break;
                }
                return (
                    <Tag color={color} key={role}>
                        {role ? role.toUpperCase() : 'USER'}
                    </Tag>
                );
            },
        },
        {
            title: tUsersPage('action'),
            key: 'action',
            width: 300,
            render: (_: any, record: User) => (
                <Space size="middle">
                    <a>{tCommon('edit')}</a>
                    <a style={{ color: 'red' }} onClick={() => handleDelete(record.id as string)}>{tCommon('delete')}</a>
                    <a style={{ color: 'orange' }} onClick={() => handleResetPassword(record.id as string)}>{tUsersPage('resetPassword')}</a>
                </Space>
            ),
        },
    ];

    const handleTableChange = (newPagination: any) => {
        setPagination({
            ...pagination,
            page: newPagination.current - 1, // AntD is 1-based, API is likely 0-based
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
                // console.log('delete, redirect to', `/admin/users`)
                // AuthService.logout();
                // router.push(`/admin/users`);
                try {
                    await deleteUserMutation.mutateAsync(id);
                    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
                } catch (error) {
                    console.log(error);
                }

            },
            okButtonProps: { danger: true },
            centered: true,
        });
    };

    const handleEdit = (id: string) => {
        console.log(id);
    };

    const handleResetPassword = (id: string) => {
        console.log(id);
        modal.confirm({
            title: tUsersPage('resetPasswordTitle'),
            content: tUsersPage('resetPasswordConfirm'),
            okText: tCommon('confirm'),
            cancelText: tCommon('cancel'),
            onOk: async () => {
                try {
                    await resetPasswordMutation.mutateAsync(id);
                } catch (error) {
                    console.log(error);
                }
            },
            okButtonProps: { color: 'orange' },
            centered: true,
        });
    };

    return (
        <div>
            <div className='flex justify-end !mb-4'>
                <Button type="primary">{tCommon('add new')}</Button>
            </div>

            <Table
                columns={columns}
                dataSource={usersData?.data?.content || []}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: (usersData?.data?.number || 0) + 1,
                    pageSize: usersData?.data?.size || 10,
                    total: usersData?.data?.totalElements || 0,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default UsersPage
