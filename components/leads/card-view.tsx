'use client';

import React from 'react';
import {
    Card,
    Typography,
    Space,
    Tooltip,
    Avatar,
    Button,
    Empty,
    theme,
    Flex,
    Badge,
    Skeleton,
    Divider
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    MoreOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { Lead } from '@/types/model';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

const { Text } = Typography;

interface LeadCardViewProps {
    leads?: Lead[];
    loading?: boolean;
    onCreate?: () => void;
}

const LeadCard = ({ lead }: { lead: Lead }) => {
    const t = useTranslations('LeadsPage');
    const { token } = theme.useToken();

    return (
        <Card
            hoverable
            size="small"
            style={{ borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}` }}
            styles={{
                body: { padding: token.paddingMD },
                header: { padding: `0 ${token.paddingMD}px`, minHeight: 48 }
            }}
            className="group"
            title={
                <Flex vertical gap={2} style={{ padding: `${token.paddingXS}px 0` }}>
                    <Text strong className="truncate block max-w-[250px]">
                        {lead.customer.name}
                    </Text>
                    <Space size={4}>
                        {
                            lead.customer.company ? (
                                <Space size={4}>
                                    <EnvironmentOutlined style={{ fontSize: token.fontSizeSM, color: token.colorTextDescription }} />
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        {lead.customer.company}
                                    </Text>
                                </Space>
                            ) : (
                                <Text style={{ fontSize: 11 }}>-</Text>
                            )
                        }
                    </Space>
                </Flex>
            }
            actions={[
                <Tooltip title={lead.customer.phone} key="phone">
                    <Button type="text" size="small" icon={<PhoneOutlined style={{ color: token.colorTextTertiary }} />} />
                </Tooltip>,
                <Tooltip title={lead.customer.email} key="email">
                    <Button type="text" size="small" icon={<MailOutlined style={{ color: token.colorTextTertiary }} />} />
                </Tooltip>,
                <Tooltip title="Xem chi tiết" key="more">
                    <Button type="text" size="small" icon={<MoreOutlined style={{ color: token.colorTextTertiary }} />} />
                </Tooltip>,
            ]}
        >
            <Flex vertical gap={token.marginMD}>
                <Flex vertical gap={0} style={{ borderBottom: `1px dashed ${token.colorBorderSecondary}`, paddingBottom: token.paddingSM }}>
                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('value')}</Text>
                    <Text strong style={{ color: token.colorPrimary, fontSize: token.fontSizeLG }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lead.value)}
                    </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                    <Flex vertical gap={2}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{t('expectedCloseDate')}</Text>
                        <Space size={4}>
                            <CalendarOutlined style={{ color: token.colorTextQuaternary, fontSize: 12 }} />
                            <Text style={{ fontSize: 12 }}>{lead.expectedCloseDate ? dayjs(lead.expectedCloseDate).format('DD/MM') : '-'}</Text>
                        </Space>
                    </Flex>
                    <Flex vertical gap={2} align="end">
                        <Text type="secondary" style={{ fontSize: 11 }}>{t('assignedTo')}</Text>
                        <Space size={4}>
                            {lead.assignedTo.name ? (
                                <Space size={4}>
                                    <Avatar size={16} src={lead.assignedTo?.email ? undefined : undefined} icon={<UserOutlined />} />
                                    <Text className="truncate max-w-[80px]" style={{ fontSize: 12 }}>{lead.assignedTo?.name}</Text>
                                </Space>
                            ) : (
                                <Text style={{ fontSize: 12 }}>-</Text>
                            )}
                        </Space>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

const mockLeads: Lead[] = [
    {
        id: 1,
        customer: { id: 1, name: "Nguyễn Văn Anh", email: "vananh@gmail.com", phone: "0345678901", company: "Công ty Công nghệ X" },
        value: 15000000,
        status: "NEW",
        assignedTo: { id: 101, name: "Trần Thị Bình", email: "thib@gmail.com", phone: "", role: "SALE", status: "ACTIVE" },
        expectedCloseDate: "2024-06-15",
        createdAt: "2024-05-20T10:00:00Z",
        createdBy: { id: 100, name: "Admin", email: "admin@gmail.com", phone: "", role: "ADMIN", status: "ACTIVE" }
    },
    {
        id: 2,
        customer: { id: 2, name: "Trần Thị Kim Liên (Khách hàng VIP tiềm năng rất lớn)", email: "kimlien.longemailaddress@verylongdomain.com", phone: "0987123456" }, // Trống công ty, tên và email cực dài
        value: 500000000,
        status: "QUALIFIED",
        assignedTo: { id: 101, name: "Trần Thị Bình", email: "thib@gmail.com", phone: "", role: "SALE", status: "ACTIVE" },
        expectedCloseDate: "", // Trống ngày đóng dự kiến
        createdAt: "2024-05-22T14:30:00Z",
        createdBy: { id: 100, name: "Admin", email: "admin@gmail.com", phone: "", role: "ADMIN", status: "ACTIVE" }
    },
    {
        id: 3,
        customer: { id: 3, name: "Phạm Thị Dung", email: "thid@gmail.com", phone: "0912345678", company: "Giải pháp Thông minh" },
        value: 8000000,
        status: "CONTACTED",
        assignedTo: { id: 0, name: "", email: "", phone: "", role: "", status: "" }, // Trống thông tin nhân viên phụ trách
        expectedCloseDate: "2024-06-10",
        createdAt: "2024-05-25T09:15:00Z",
        createdBy: { id: 100, name: "Admin", email: "admin@gmail.com", phone: "", role: "ADMIN", status: "ACTIVE" }
    },
    {
        id: 4,
        customer: { id: 4, name: "Lê Văn Cường", email: "cuong@gmail.com", phone: "0909090909" },
        value: 0, // Giá trị bằng 0
        status: "LOST",
        assignedTo: { id: 103, name: "Lý Thị Hoa", email: "hoal@gmail.com", phone: "", role: "SALE", status: "ACTIVE" },
        expectedCloseDate: "2024-05-30",
        createdAt: "2024-05-15T11:00:00Z",
        createdBy: { id: 100, name: "Admin", email: "admin@gmail.com", phone: "", role: "ADMIN", status: "ACTIVE" }
    }
];

const COLUMNS = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];

const LeadCardSkeleton = () => {
    const { token } = theme.useToken();
    return (
        <Card
            size="small"
            style={{ borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}` }}
            styles={{ body: { padding: token.paddingMD } }}
        >
            <Flex vertical gap={token.marginMD}>
                <Flex vertical gap={8}>
                    <Skeleton.Input active size="small" style={{ width: '60%' }} />
                    <Skeleton.Input active size="small" style={{ width: '40%' }} />
                </Flex>
                <Divider dashed style={{ margin: '4px 0' }} />
                <Flex justify="space-between" align="center">
                    <Skeleton.Button active size="small" style={{ width: 60 }} />
                    <Skeleton.Avatar active size="small" shape="circle" />
                </Flex>
            </Flex>
        </Card>
    );
};

const LeadCardView = ({ leads = [], loading = false }: LeadCardViewProps) => {
    const { token } = theme.useToken();
    const displayLeads = (loading || leads.length > 0) ? leads : mockLeads;

    const groupedLeads = COLUMNS.reduce((acc, status) => {
        acc[status] = displayLeads.filter(lead => lead.status.toUpperCase() === status);
        return acc;
    }, {} as Record<string, Lead[]>);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'NEW': return token.colorPrimary;
            case 'CONTACTED': return token.colorWarning;
            case 'QUALIFIED': return token.colorInfo;
            case 'WON': return token.colorSuccess;
            case 'LOST': return token.colorError;
            default: return token.colorTextTertiary;
        }
    };

    return (
        <Flex vertical style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <Flex gap={token.marginMD} style={{ height: '100%', minWidth: 'max-content', padding: token.paddingXXS }}>
                    {COLUMNS.map(status => (
                        <Card
                            key={status}
                            size="small"
                            styles={{
                                body: {
                                    padding: token.paddingSM,
                                    backgroundColor: token.colorFillAlter,
                                    flex: 1,
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: token.marginSM
                                },
                                header: {
                                    borderBottom: `2px solid ${getStatusColor(status)}`,
                                    backgroundColor: token.colorBgContainer
                                }
                            }}
                            className="custom-scrollbar"
                            title={
                                <Space size={8}>
                                    <Badge color={getStatusColor(status)} />
                                    <Text strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {status}
                                    </Text>
                                    <Badge
                                        count={groupedLeads[status].length}
                                        showZero
                                        color={token.colorFillSecondary}
                                        style={{ color: token.colorTextSecondary, fontSize: 10 }}
                                    />
                                </Space>
                            }
                            style={{
                                width: 320,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: token.borderRadiusLG,
                                border: `1px solid ${token.colorBorderSecondary}`,
                                overflow: 'hidden'
                            }}
                        >
                            {loading ? (
                                <Flex vertical gap={token.marginSM}>
                                    <LeadCardSkeleton />
                                    <LeadCardSkeleton />
                                    <LeadCardSkeleton />
                                </Flex>
                            ) : groupedLeads[status].length === 0 ? (
                                <Flex align="center" justify="center" style={{ flex: 1 }}>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={<Text type="secondary" style={{ fontSize: 12 }}>Trống</Text>}
                                    />
                                </Flex>
                            ) : (
                                groupedLeads[status].map(lead => (
                                    <LeadCard key={lead.id} lead={lead} />
                                ))
                            )}
                        </Card>
                    ))}
                </Flex>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px !important;
                    height: 10px !important;
                    display: block !important;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${token.colorFillQuaternary} !important;
                    border-radius: 10px !important;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: ${token.colorFill} !important;
                    border-radius: 10px !important;
                    border: 2px solid ${token.colorFillQuaternary} !important;
                    background-clip: content-box !important;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: ${token.colorTextSecondary} !important;
                }
                /* Tăng cường độ đậm cho Light Mode */
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    box-shadow: inset 0 0 0 10px ${token.colorFillSecondary};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    box-shadow: inset 0 0 0 10px ${token.colorFill};
                }
            `}</style>
        </Flex>
    );
};

export default LeadCardView;
