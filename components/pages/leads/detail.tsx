'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Tag,
    Typography,
    Space,
    Button,
    Row,
    Col,
    Timeline,
    Avatar,
    theme,
    Divider,
    Flex,
    Badge,
    Spin,
    Empty
} from 'antd';
import {
    ArrowLeftOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dayjs from '@/lib/dayjs';
import { useGetLead } from '@/hooks/api/useLead';
import { useGetActivities } from '@/hooks/api/useActivity';

const { Title, Text } = Typography;

// --- Helpers ---
const getStatusColor = (status?: string) => {
    switch (status) {
        case 'NEW': return 'blue';
        case 'CONTACTED': return 'cyan';
        case 'QUALIFIED': return 'purple';
        case 'PROPOSAL': return 'orange';
        case 'NEGOTIATION': return 'geekblue';
        case 'WON': return 'success';
        case 'LOST': return 'error';
        default: return 'default';
    }
};

const LeadDetailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const t = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');
    const { token } = theme.useToken();

    // AI API Hooks
    const { data: leadResponse, isLoading: isFetchingLead } = useGetLead(id || '');
    const { data: activitiesResponse, isLoading: isFetchingActivities } = useGetActivities({ leadId: id || undefined } as any);

    const lead = leadResponse?.data;
    const activities = activitiesResponse?.data?.content || [];

    if (isFetchingLead) {
        return (
            <Flex align="center" justify="center" style={{ minHeight: '80vh' }}>
                <Spin size="large" tip={tCommon('processing')} />
            </Flex>
        );
    }

    if (!lead && !isFetchingLead) {
        return (
            <Flex align="center" justify="center" style={{ minHeight: '80vh' }}>
                <Empty description={tCommon('failed')} />
            </Flex>
        );
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <Flex vertical gap={token.marginLG}>
                {/* Back Button */}
                <Space direction="vertical" size={0}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        className="p-0 mb-2"
                    >
                        {tCommon('back')}
                    </Button>
                </Space>

                <Row gutter={[token.marginLG, token.marginLG]}>
                    <Col xs={24} lg={16}>
                        <Flex vertical gap={token.marginLG}>
                            {/* SECTION 1: CUSTOMER INFORMATION */}
                            <Card
                                title={t('customerInfo')}
                                bordered={false}
                                className="shadow-sm"
                                extra={
                                    <Button
                                        onClick={() => router.push(`/admin/customers/${lead?.customer.id}`)}
                                    >
                                        {tCommon('edit')}
                                    </Button>
                                }
                            >
                                <Flex vertical gap={token.marginLG}>
                                    <Flex align="center" gap={token.marginMD}>
                                        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: token.colorTextTertiary }} />
                                        <Flex vertical>
                                            <Title level={3} style={{ margin: 0 }}>
                                                {lead?.customer.name} {lead?.customer.company ? `(${lead.customer.company})` : ''}
                                            </Title>
                                            <Space size="middle" style={{ marginTop: token.marginXS }}>
                                                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                                                    <ClockCircleOutlined /> {t('createdAt')}: {lead?.createdAt ? dayjs(lead.createdAt).format('DD/MM/YYYY HH:mm') : '-'}
                                                </Text>
                                            </Space>
                                        </Flex>
                                    </Flex>

                                    <Divider style={{ margin: 0 }} />

                                    <Flex vertical gap={token.marginMD}>
                                        <Flex align="center" gap={token.marginMD}>
                                            <Text type="secondary" style={{ width: 120 }}><MailOutlined /> Email:</Text>
                                            <Text copyable>{lead?.customer.email}</Text>
                                        </Flex>
                                        <Flex align="center" gap={token.marginMD}>
                                            <Text type="secondary" style={{ width: 120 }}><PhoneOutlined /> {t('phone')}:</Text>
                                            <Text copyable>{lead?.customer.phone}</Text>
                                        </Flex>
                                        <Flex vertical gap={token.marginXS}>
                                            <Text type="secondary">{t('notes')}:</Text>
                                            <Text>{lead?.customer.notes || '-'}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Card>

                            {/* SECTION 2: LEAD INFORMATION */}
                            <Card
                                title={t('detail')}
                                bordered={false}
                                className="shadow-sm"
                                extra={
                                    <Button
                                        onClick={() => router.push(`/admin/leads/${id}`)}
                                    >
                                        {tCommon('edit')}
                                    </Button>
                                }
                            >
                                <Flex vertical gap={token.marginXS} className='p-2'>
                                    <Flex vertical gap={4} className='p-2'>
                                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{t('status')}</Text>
                                        <div style={{ fontWeight: 500 }}><Tag color={getStatusColor(lead?.status)}>{lead?.status}</Tag></div>
                                    </Flex>
                                    <Divider style={{ margin: 0 }} />
                                    <Flex vertical gap={4} className='p-2'>
                                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{t('value')}</Text>
                                        <div style={{ fontWeight: 500 }}>
                                            <Text strong style={{ color: token.colorPrimary }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lead?.value || 0)}
                                            </Text>
                                        </div>
                                    </Flex>
                                    <Divider style={{ margin: 0 }} />
                                    <Flex vertical gap={4} className='p-2'>
                                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{t('assignedTo')}</Text>
                                        <div style={{ fontWeight: 500 }}>
                                            <Space>
                                                <Avatar size="small" icon={<UserOutlined />} />
                                                <a href={`/admin/users/${lead?.assignedTo.id}`} onClick={(e) => e.stopPropagation()}>
                                                    {lead?.assignedTo.name}
                                                </a>
                                            </Space>
                                        </div>
                                    </Flex>
                                    <Divider style={{ margin: 0 }} />
                                    <Flex vertical gap={4} className='p-2'>
                                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{t('expectedCloseDate')}</Text>
                                        <div style={{ fontWeight: 500 }}>
                                            <Space>
                                                <CalendarOutlined style={{ color: token.colorWarning }} />
                                                <Text>{lead?.expectedCloseDate ? dayjs(lead.expectedCloseDate).format('DD/MM/YYYY') : '-'}</Text>
                                            </Space>
                                        </div>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Flex>
                    </Col>

                    {/* Section 3: Activities Information */}
                    <Col xs={24} lg={8}>
                        <Card
                            title={t('activities')}
                            bordered={false}
                            className="shadow-sm"
                            style={{ minHeight: '100%' }}
                            extra={<Button type="primary">{tCommon('newActivity')}</Button>}
                        >
                            {isFetchingActivities ? (
                                <Flex justify="center" style={{ padding: token.paddingMD }}><Spin /></Flex>
                            ) : activities.length > 0 ? (
                                <Timeline
                                    mode="left"
                                    items={activities.map((act: any) => ({
                                        children: (
                                            <Flex vertical gap={token.marginXXS}>
                                                <Text strong>{act.type}</Text>
                                                <Text style={{ fontSize: token.fontSizeSM }}>{act.description}</Text>
                                                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{dayjs(act.createdAt).format('DD/MM HH:mm')}</Text>
                                            </Flex>
                                        ),
                                    }))}
                                />
                            ) : (
                                <Empty description={t('noDocuments')} />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Flex>
        </div>
    );
};

export default LeadDetailPage;
