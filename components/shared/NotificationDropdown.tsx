'use client';

import React, { useState } from 'react';
import {
    Avatar,
    Badge,
    Button,
    Divider,
    Dropdown,
    Empty,
    Flex,
    List,
    Tag,
    Tooltip,
    Typography,
    theme,
} from 'antd';
import {
    BellOutlined,
    CalendarOutlined,
    CheckOutlined,
    EditOutlined,
    RiseOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import dayjs from '@/lib/dayjs';
import { Notification } from '@/types/model';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
    id: 1,
    name: 'Admin',
    email: 'admin@minicrm.com',
    phone: '',
    role: 'admin',
    status: 'active',
};

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        user: MOCK_USER,
        type: 'LEAD_CREATED',
        title: 'Lead mới được tạo',
        message: 'Sale Tran Thi B vừa tạo một lead mới cho khách hàng Công ty ABC với giá trị 80,000,000 VND.',
        isRead: false,
        metaData: '{"leadId": 13}',
        createdAt: dayjs().subtract(5, 'minute').toISOString(),
    },
    {
        id: 2,
        user: MOCK_USER,
        type: 'CUSTOMER_ASSIGNED',
        title: 'Khách hàng được phân công',
        message: 'Khách hàng Nguyen Van A đã được phân công cho bạn bởi Manager.',
        isRead: false,
        metaData: '{"customerId": 8}',
        createdAt: dayjs().subtract(30, 'minute').toISOString(),
    },
    {
        id: 3,
        user: MOCK_USER,
        type: 'ACTIVITY_CREATED',
        title: 'Hoạt động mới',
        message: 'Sale Le Van C đã tạo một cuộc gọi mới với khách hàng Pham Thi D vào lúc 14:00 hôm nay.',
        isRead: false,
        metaData: '{"activityId": 5}',
        createdAt: dayjs().subtract(2, 'hour').toISOString(),
    },
    {
        id: 4,
        user: MOCK_USER,
        type: 'LEAD_UPDATED',
        title: 'Lead được cập nhật',
        message: 'Lead của khách hàng Hoang Van E đã được cập nhật trạng thái sang QUALIFIED.',
        isRead: true,
        metaData: '{"leadId": 9}',
        createdAt: dayjs().subtract(1, 'day').toISOString(),
    },
    {
        id: 5,
        user: MOCK_USER,
        type: 'LEAD_CREATED',
        title: 'Lead mới được tạo',
        message: 'Sale Nguyen Thi F vừa tạo lead mới cho khách hàng Cong ty XYZ.',
        isRead: true,
        metaData: '{"leadId": 20}',
        createdAt: dayjs().subtract(2, 'day').toISOString(),
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Dùng token design thay vì hardcode màu. Hàm này nhận token để đảm bảo
// tất cả màu sắc đều đến từ design system.
type TokenType = ReturnType<typeof theme.useToken>['token'];

const getNotificationMeta = (
    type: string,
    token: TokenType
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
            return { icon: <BellOutlined />, color: token.colorTextDescription };
    }
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function NotificationDropdown({ role }: { role: string }) {
    const { token } = theme.useToken();
    const t = useTranslations('NotificationPanel');
    const router = useRouter();

    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const markRead = (id: string | number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const dropdownContent = (
        <div
            style={{
                width: 380,
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowSecondary,
                overflow: 'hidden',
                border: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            {/* Header */}
            <Flex
                justify="space-between"
                align="center"
                style={{
                    padding: `${token.paddingMD}px ${token.paddingLG}px`,
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 100%)`,
                }}
            >
                <Flex align="center" gap={token.marginXS}>
                    <Typography.Text strong style={{ fontSize: token.fontSizeLG }}>
                        {t('title')}
                    </Typography.Text>
                </Flex>

                {unreadCount > 0 && (
                    <Tooltip title={t('markAllReadTooltip')}>
                        <Button
                            type="text"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={markAllRead}
                            style={{ color: token.colorPrimary }}
                        >
                            {t('markAllRead')}
                        </Button>
                    </Tooltip>
                )}
            </Flex>

            {/* List */}
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t('empty')}
                        style={{ padding: `${token.paddingXL}px 0` }}
                    />
                ) : (
                    <List
                        dataSource={notifications}
                        renderItem={(item) => {
                            const meta = getNotificationMeta(item.type, token);
                            return (
                                <List.Item
                                    key={item.id}
                                    onClick={() => markRead(item.id)}
                                    // Dùng Tailwind cho hover effect (đúng quy tắc cursorrules)
                                    className="hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors duration-200"
                                    style={{
                                        padding: `${token.paddingMD}px ${token.paddingLG}px`,
                                        cursor: 'pointer',
                                        background: item.isRead
                                            ? 'transparent'
                                            : token.colorPrimaryBg,
                                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Flex gap={token.marginMD} style={{ width: '100%' }}>
                                        {/* Dùng Avatar thay vì <div> tròn tự build */}
                                        <Avatar
                                            size={36}
                                            icon={meta.icon}
                                            style={{
                                                background: `${meta.color}1a`,
                                                color: meta.color,
                                                border: `1.5px solid ${meta.color}55`,
                                                flexShrink: 0,
                                                marginTop: 2,
                                            }}
                                        />

                                        {/* Content */}
                                        <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
                                            <Flex justify="space-between" align="center">
                                                <Typography.Text
                                                    strong={!item.isRead}
                                                    style={{
                                                        fontSize: token.fontSizeSM,
                                                        color: item.isRead
                                                            ? token.colorTextSecondary
                                                            : token.colorText,
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography.Text>
                                                {!item.isRead && (
                                                    <Badge
                                                        color={token.colorPrimary}
                                                        style={{ flexShrink: 0, marginLeft: token.marginXS }}
                                                    />
                                                )}
                                            </Flex>

                                            <Typography.Text
                                                type="secondary"
                                                style={{
                                                    fontSize: token.fontSizeSM,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {item.message}
                                            </Typography.Text>

                                            <Typography.Text
                                                type="secondary"
                                                style={{ fontSize: token.fontSizeSM - 1, marginTop: token.marginXXS }}
                                            >
                                                {dayjs(item.createdAt).fromNow()}
                                            </Typography.Text>
                                        </Flex>
                                    </Flex>
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>

            {/* Footer */}
            <Divider style={{ margin: 0 }} />
            <Flex justify="center" style={{ padding: `${token.paddingSM}px 0` }}>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                        router.push(`/${role}/notifications`);
                    }}
                >
                    {t('viewAll')}
                </Button>
            </Flex>
        </div>
    );

    return (
        <Dropdown
            dropdownRender={() => dropdownContent}
            trigger={['click']}
            open={open}
            onOpenChange={setOpen}
            placement="bottomRight"
        >
            <Badge count={unreadCount} size="small">
                <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            </Badge>
        </Dropdown>
    );
}
