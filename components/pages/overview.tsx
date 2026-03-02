'use client';

import React, { useState } from 'react';
import { Card, Col, DatePicker, Flex, Progress, Row, Space, Statistic, theme, Typography, Button } from 'antd';
import {
    CreditCardOutlined,
    DollarOutlined,
    LineChartOutlined,
    PieChartOutlined,
    ReloadOutlined,
    RiseOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    LineChart,
    Line as ReLine,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie as RePie,
    Cell,
    Legend,
} from 'recharts';
import { useTranslations } from 'next-intl';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export default function OverviewPage() {
    const tCommon = useTranslations('common');
    const tOverview = useTranslations('OverviewPage');
    const tLeads = useTranslations('LeadsPage');
    const { token } = theme.useToken();

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);

    const cardStyle: React.CSSProperties = {
        borderRadius: token.borderRadiusLG,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: `1px solid ${token.colorBorderSecondary}`,
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillAlter} 100%)`,
    };

    return (
        <Flex vertical gap={token.marginLG}>
            {/* Header Toolbar */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
                <Typography.Title level={2} style={{ margin: 0 }}>
                    {tOverview('title')}
                </Typography.Title>
                <Flex gap={token.marginMD} align="center" wrap="wrap">
                    <RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                        format="DD/MM/YYYY"
                        placeholder={[tCommon('start date'), tCommon('end date')]}
                        style={{ borderRadius: token.borderRadiusLG }}
                    />
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => { }}
                    />
                </Flex>
            </Flex>

            {/* Statistics Section */}
            <Row gutter={[token.marginMD, token.marginMD]}>
                <Col xs={24} sm={12} md={8}>
                    <Card style={cardStyle} hoverable>
                        <Statistic
                            title={<Typography.Text type="secondary">{tOverview('totalCustomers')}</Typography.Text>}
                            value={128}
                            prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
                            valueStyle={{ color: token.colorPrimary, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card style={cardStyle} hoverable>
                        <Statistic
                            title={<Typography.Text type="secondary">{tOverview('totalWonValue')}</Typography.Text>}
                            value={1250000000}
                            suffix={tCommon('currencySuffix')}
                            valueStyle={{ color: token.colorSuccess, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card style={cardStyle} hoverable>
                        <Statistic
                            title={<Typography.Text type="secondary">{tOverview('conversionRate')}</Typography.Text>}
                            value={24.5}
                            precision={1}
                            prefix={<RiseOutlined style={{ color: token.colorWarning }} />}
                            suffix="%"
                            valueStyle={{ color: token.colorWarning, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Section */}
            <Row gutter={[token.marginMD, token.marginMD]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<Space><LineChartOutlined /> {tOverview('customers')}</Space>}
                        style={{ ...cardStyle, background: token.colorBgContainer, height: 400 }}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={[
                                { date: '2024-01-01', value: 120 },
                                { date: '2024-02-01', value: 50 },
                                { date: '2024-03-01', value: 150 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ReTooltip />
                                <ReLine type="monotone" dataKey="value" stroke={token.colorPrimary} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card
                        title={<Space><PieChartOutlined /> {tOverview('leads')}</Space>}
                        style={{ ...cardStyle, background: token.colorBgContainer, height: 400 }}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { type: 'Q1', total: 40, win: 5, lose: 10 },
                                { type: 'Q2', total: 30, win: 10, lose: 5 },
                                { type: 'Q3', total: 20, win: 15, lose: 2 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis />
                                <ReTooltip />
                                <Legend />
                                <Bar dataKey="total" fill={token.colorPrimary} />
                                <Bar dataKey="win" fill={token.colorSuccess} />
                                <Bar dataKey="lose" fill={token.colorError} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </Flex>
    );
}
