'use client'

import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Typography, Button, App, message } from 'antd';
import { useDeleteUser, useGetUsers, useResetPassword, userKeys } from '@/hooks/api/useUser';
import { User } from '@/types/model';
import { SearchQueryParams } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from '@/i18n/routing';
import dayjs from '@/lib/dayjs';
import { useUserInfo } from '@/hooks/useUserInfo';
import { hasPermission } from '@/lib/rbac';
import { UserRole } from '@/types/model';
import { useSearchParams } from 'next/navigation';

const UsersPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial values from URL
    const urlPage = parseInt(searchParams.get('page') || '1') - 1;
    const urlSize = parseInt(searchParams.get('size') || '10');

    const [pagination, setPagination] = useState<SearchQueryParams>({
        page: urlPage >= 0 ? urlPage : 0,
        size: urlSize > 0 ? urlSize : 10,
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

    const [userEmail, setUserEmail] = useState('')

    const tUsersPage = useTranslations('UsersPage');
    const tCommon = useTranslations('common');

    const queryClient = useQueryClient();
    const user = useUserInfo();
    const role = user?.role;

    const { data: usersData, isLoading } = useGetUsers(pagination);
    const deleteUserMutation = useDeleteUser();
    const resetPasswordMutation = useResetPassword();

    const { modal } = App.useApp();

    const handleTableChange = (newPagination: any) => {
        setPagination({
            ...pagination,
            page: newPagination.current - 1,
            size: newPagination.pageSize,
        });
    };

    const handleDelete = (id: string) => {
        modal.confirm({
            title: tCommon('deleteTitle'),
            content: tCommon('deleteConfirm'),
            okText: tCommon('confirm'),
            cancelText: tCommon('cancel'),
            onOk: async () => {
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

    const handleResetPassword = (id: string) => {
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

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const { email } = JSON.parse(user);
            setUserEmail(email);
        }
    }, []);

    const columns: any[] = [
        {
            title: tUsersPage('name'),
            dataIndex: 'name',
            fixed: 'left',
            key: 'name',
            render: (text: string, record: User) => <a onClick={() => router.push(`/admin/users/${record.id}`)}>{text}</a>,
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
            key: 'phone',
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
            title: tUsersPage('status'),
            key: 'status',
            dataIndex: 'status',
            width: 150,
            render: (status: string) => {
                let color = 'blue';
                switch (status) {
                    case 'active':
                        color = 'green';
                        break;
                    case 'inactive':
                        color = 'red';
                        break;
                    default:
                        color = 'blue';
                        break;
                }
                return (
                    <Tag color={color} key={status}>
                        {status ? status.toUpperCase() : 'USER'}
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
                    {hasPermission(role, 'users', 'edit') && (
                        <a onClick={() => router.push(`/admin/users/${record.id}`)}>{tCommon('edit')}</a>
                    )}
                    {hasPermission(role, 'users', 'delete') && userEmail !== record.email && (
                        <a style={{ color: 'red' }} onClick={() => handleDelete(record.id as string)}>{tCommon('delete')}</a>
                    )}
                    {hasPermission(role, 'users', 'edit') && (
                        <a style={{ color: 'orange' }} onClick={() => handleResetPassword(record.id as string)}>{tUsersPage('resetPassword')}</a>
                    )}
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const { email } = JSON.parse(user);
            setUserEmail(email);
        }
    }, []);

    return (
        <div>
            <div className='flex justify-end !mb-4'>
                {hasPermission(role, 'users', 'edit') && (
                    <Button type="primary" onClick={() => router.push('/admin/users/new')}>{tCommon('add new')}</Button>
                )}
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
