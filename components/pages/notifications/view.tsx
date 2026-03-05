'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useGetNotifications, useMarkAllAsRead, useMarkAsRead } from '@/hooks/api/useNotification';
import { useUserInfo } from '@/hooks/useUserInfo';
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
    theme,
    message
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
import { Notification, NotificationType } from '@/types/model';
import type { RadioChangeEvent } from 'antd';

// Mock data removed

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

export default function NotificationsViewPage({ role }: { role?: string }) {
    const { token } = theme.useToken();
    const t = useTranslations('NotificationsPage');
    const tCommon = useTranslations('common');
    const router = useRouter();

    const userInfo = useUserInfo();

    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const { data: notificationsData, isLoading } = useGetNotifications({
        userId: userInfo?.id,
        isRead: filter === 'UNREAD' ? false : true, // Nếu backend hỗ trợ params này
        page,
        size
    });

    const mutationMarkAllRead = useMarkAllAsRead();
    const mutationMarkRead = useMarkAsRead();

    // Lọc data ở client nếu backend không nhận isRead (tùy thuộc API)
    // Nếu API đã lọc thì chỉ hiển thị
    const displayData = notificationsData?.data.content || [];

    const handleFilterChange = (e: RadioChangeEvent) => {
        setFilter(e.target.value);
        setPage(0); // Reset page on filter change
    };

    const handleMarkAllRead = async () => {
        if (!userInfo?.id) return;
        await mutationMarkAllRead.mutateAsync(userInfo.id as string);
    };

    const handleNotificationClick = async (item: Notification) => {
        try {
            if (!item.read) {
                await mutationMarkRead.mutateAsync(item.id as string);
            }
            const metaData = JSON.parse(item.metaData);
            switch (item.type as NotificationType) {
                case NotificationType.LEAD_CREATED:
                case NotificationType.LEAD_UPDATED:
                    router.push(`/${role}/leads/view?id=${metaData?.id}`);
                    break;
                case NotificationType.CUSTOMER_ASSIGNED:
                    router.push(`/${role}/customers/${metaData?.id}`);
                    break;
                case NotificationType.ACTIVITY_CREATED:
                    router.push(`/${role}/leads/view?id=${metaData?.lead?.id}`);
                    break;
                default:
                    break;
            }
        } catch (error: any) {
            message.error(error.message || tCommon('failed'));
        }
    };

    const getNotificationContent = (data: Notification) => {
        try {
            const metaData = JSON.parse(data.metaData);
            switch (data.type as NotificationType) {
                case NotificationType.LEAD_CREATED:
                    return {
                        title: t('leadCreatedTitle'),
                        message: t('leadCreatedMsg', { id: metaData?.id }),
                    };
                case NotificationType.LEAD_UPDATED:
                    return {
                        title: t('leadUpdatedTitle'),
                        message: t('leadUpdatedMsg', { id: metaData?.id }),
                    };
                case NotificationType.CUSTOMER_ASSIGNED:
                    return {
                        title: t('customerAssignedTitle'),
                        message: t('customerAssignedMsg'),
                    };
                case NotificationType.ACTIVITY_CREATED:
                    return {
                        title: t('activityCreatedTitle'),
                        message: t('activityCreatedMsg', { id: metaData?.lead?.id }),
                    };
                default:
                    return { title: data.title, message: data.message };
            }
        } catch (error) {
            return { title: data.title, message: data.message };
        }
    };

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
                    // disabled={!notifications.some(n => !n.read)}
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
                    loading={isLoading || mutationMarkAllRead.isPending || mutationMarkRead.isPending}
                    pagination={{
                        position: 'bottom',
                        align: 'center',
                        pageSize: size,
                        current: page + 1,
                        total: notificationsData?.data.totalElements || 0,
                        onChange: (page, pageSize) => {
                            setPage(page - 1);
                            setSize(pageSize);
                        },
                        showSizeChanger: true,
                    }}
                    dataSource={displayData}
                    locale={{ emptyText: t('emptyMessage') }}
                    renderItem={(item) => {
                        const meta = getNotificationMeta(item.type, token);
                        const content = getNotificationContent(item);
                        return (
                            <List.Item
                                onClick={() => handleNotificationClick(item)}
                                className="hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors duration-200"
                                style={{
                                    padding: `${token.paddingMD}px ${token.paddingLG}px`,
                                    cursor: mutationMarkRead.isPending ? 'wait' : 'pointer',
                                    background: item.read
                                        ? 'transparent'
                                        : token.colorPrimaryBg,
                                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                    alignItems: 'flex-start',
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
                                                strong={!item.read}
                                            >
                                                {content.title}
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
                                                    color: item.read ? token.colorTextSecondary : token.colorText,
                                                }}
                                            >
                                                {content.message}
                                            </Typography.Text>
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
