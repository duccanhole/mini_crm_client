'use client'

import React, { useState } from 'react';
import { Table, Tag, Space, Typography, Button } from 'antd';
import { useGetUsers } from '@/hooks/api/useUser';
import { User } from '@/types/model';
import { SearchQueryParams } from '@/types/api';

const { Title } = Typography;

const UsersPage = () => {
    const [pagination, setPagination] = useState<SearchQueryParams>({
        page: 0,
        size: 10,
    });

    const { data: usersData, isLoading } = useGetUsers(pagination);

    const columns: any[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            fixed: 'left',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone', // Note: User model has 'phone', check if response actually has it or 'phoneNumber'
            render: (text: string, record: User) => text || (record as any).phoneNumber || '-',
            width: 150,
        },
        {
            title: 'Role',
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
            title: 'Action',
            key: 'action',
            width: 300,
            render: (_: any, record: User) => (
                <Space size="middle">
                    <a>Edit</a>
                    <a style={{ color: 'red' }}>Delete</a>
                    <a style={{ color: 'orange' }}>Reset Password</a>
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

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'end', width: '100%' }}>
                <Button type="primary">Add User</Button>
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
