'use client';

import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    Divider,
    Flex,
    List,
    Radio,
    Tag,
    Typography,
    theme
} from 'antd';
import {
    CalendarOutlined,
    CheckOutlined,
    EditOutlined,
    FilterOutlined,
    RiseOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import dayjs from '@/lib/dayjs';
import { Notification } from '@/types/model';
import type { RadioChangeEvent } from 'antd';

// Mock data (trong thực tế sẽ fetch từ API thông qua hooks/api)
const MOCK_USER = {
    id: 1,
    name: 'Admin',
    email: 'admin@minicrm.com',
    phone: '',
    role: 'admin',
    status: 'active',
};

const MOCK_NOTIFICATIONS: Notification[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    user: MOCK_USER,
    type: i % 4 === 0 ? 'LEAD_CREATED'
        : i % 4 === 1 ? 'LEAD_UPDATED'
            : i % 4 === 2 ? 'CUSTOMER_ASSIGNED'
                : 'ACTIVITY_CREATED',
    title: `Thông báo hệ thống ${i + 1}`,
    message: `Nội dung chi tiết của thông báo số ${i + 1} được hiển thị ở đây để người dùng dễ dàng theo dõi và xử lý.`,
    isRead: i > 3,
    metaData: '{}',
    createdAt: dayjs().subtract(i * 45, 'minute').toISOString(),
}));

const getNotificationMeta = (
    type: string,
    token: ReturnType<typeof theme.useToken>['token']
): { icon: React.ReactNode; color: string } => {
    switch (type) {
        case 'LEAD_CREATED':
            return { icon: <RiseOutlined />, color: token.colorPrimary };
        case 'LEAD_UPDATED':
            return { icon: <EditOutlined />, color: token.colorWarning };
        case 'CUSTOMER_ASSIGNED':
            return { icon: <UserSwitchOutlined />, color: token.colorSuccess };
        case 'ACTIVITY_CREATED':
            return { icon: <CalendarOutlined />, color: token.colorInfo };
        default:
            return { icon: <CalendarOutlined />, color: token.colorTextDescription };
    }
};

export default function NotificationsViewPage() {
    const { token } = theme.useToken();
    const t = useTranslations('NotificationsPage');
    const tCommon = useTranslations('common');

    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const handleFilterChange = (e: RadioChangeEvent) => {
        setFilter(e.target.value);
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleMarkRead = (id: string | number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const displayData = notifications.filter(
        (n) => filter === 'ALL' || (filter === 'UNREAD' && !n.isRead)
    );

    return (
        <Flex vertical gap={token.marginLG}>
            {/* Header */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
                <Typography.Title level={2} style={{ margin: 0 }}>
                    {t('title')}
                </Typography.Title>
                <Flex gap={token.marginMD} wrap>
                    <Radio.Group
                        value={filter}
                        onChange={handleFilterChange}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="ALL">{t('filterAll')}</Radio.Button>
                        <Radio.Button value="UNREAD">{t('filterUnread')}</Radio.Button>
                    </Radio.Group>
                    <Button
                        icon={<CheckOutlined />}
                        onClick={handleMarkAllRead}
                        disabled={!notifications.some(n => !n.isRead)}
                    >
                        {t('markAllRead')}
                    </Button>
                </Flex>
            </Flex>

            {/* Content List */}
            <Card
                styles={{ body: { padding: 0 } }}
                style={{
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadowTertiary,
                    // border: `1px solid ${token.colorBorderSecondary}`,
                    overflow: 'hidden'
                }}
            >
                <List
                    // size="large"
                    pagination={{
                        position: 'bottom',
                        align: 'center',
                        pageSize: 10,
                        showSizeChanger: true,
                    }}
                    dataSource={displayData}
                    locale={{ emptyText: t('emptyMessage') }}
                    renderItem={(item) => {
                        const meta = getNotificationMeta(item.type, token);
                        return (
                            <List.Item
                                onClick={() => handleMarkRead(item.id)}
                                className={`transition-colors duration-200 ${item.isRead ? 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                                    : ''
                                    }`}
                                style={{
                                    padding: `${token.paddingMD}px ${token.paddingLG}px`,
                                    cursor: 'pointer',
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            size={35}
                                            icon={meta.icon}
                                            style={{
                                                backgroundColor: `${meta.color}15`,
                                                color: meta.color,
                                                border: `1px solid ${meta.color}40`,
                                                marginTop: 4
                                            }}
                                        />
                                    }
                                    title={
                                        <Flex justify="space-between" align="center" style={{ marginBottom: token.marginXXS }}>
                                            <Typography.Text
                                                strong={!item.isRead}
                                            // style={{ fontSize: token.fontSizeLG }}
                                            >
                                                {item.title}
                                            </Typography.Text>
                                            <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                                                {dayjs(item.createdAt).fromNow()}
                                            </Typography.Text>
                                        </Flex>
                                    }
                                    description={
                                        <Flex vertical gap={token.marginXS}>
                                            <Typography.Text
                                                style={{
                                                    color: item.isRead ? token.colorTextSecondary : token.colorText,
                                                }}
                                            >
                                                {item.message}
                                            </Typography.Text>
                                            <Flex gap={token.marginXS}>
                                                <Tag bordered={false} color="processing">
                                                    {item.type}
                                                </Tag>
                                            </Flex>
                                        </Flex>
                                    }
                                />
                                {/* {!item.isRead && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 4,
                                            backgroundColor: token.colorPrimary
                                        }}
                                    />
                                )} */}
                            </List.Item>
                        );
                    }}
                />
            </Card>
        </Flex>
    );
}
