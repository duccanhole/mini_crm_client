'use client';

import React, { useEffect, useState } from 'react';
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
import { useCountCustomers } from '@/hooks/api/useCustomer';
import { useCountLeads, useValueLeads } from '@/hooks/api/useLead';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { LeadStatus } from '@/types/model';
import useChartData from '@/hooks/chart/useChartData';

const { RangePicker } = DatePicker;

export default function OverviewPage() {
    const tCommon = useTranslations('common');
    const tOverview = useTranslations('OverviewPage');
    const { token } = theme.useToken();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial values from URL
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');


    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(() => {
        if (urlFrom && urlTo) {
            const from = dayjs(urlFrom);
            const to = dayjs(urlTo);
            if (from.isValid() && to.isValid()) {
                return [from, to];
            }
        }
        return [
            dayjs().startOf('week').startOf('day'),
            dayjs().endOf('week').endOf('day')
        ];
    });

    const queryForStatstics = {
        createdFrom: dateRange?.[0]?.toISOString(),
        createdTo: dateRange?.[1]?.toISOString()
    };

    const { data: countCustomers, refetch: refetchCountCustomers } = useCountCustomers(queryForStatstics);
    const { data: countLeadsTotal, refetch: refetchCountLeadsNew } = useCountLeads({ ...queryForStatstics });
    const { data: countLeadsWin, refetch: refetchCountLeadsWin } = useCountLeads({ ...queryForStatstics, status: LeadStatus.WON });
    const { data: valueLeads, refetch: refetchValueLeads } = useValueLeads({ ...queryForStatstics, status: LeadStatus.WON });

    const cardStyle: React.CSSProperties = {
        borderRadius: token.borderRadiusLG,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: `1px solid ${token.colorBorderSecondary}`,
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillAlter} 100%)`,
    };

    const conversionRate = (countLeadsWin?.data ?? 0) / (Math.max(countLeadsTotal?.data ?? 1, 1)) * 100;

    const { data, refresh } = useChartData();

    const lineChart = [
        {
            date: dayjs().subtract(2, 'month').startOf('month').format('MM/YYYY'),
            value: data?.customers.last2Month
        },
        {
            date: dayjs().subtract(1, 'month').startOf('month').format('MM/YYYY'),
            value: data?.customers.lastMonth,
        },
        {
            date: dayjs().startOf('month').format('MM/YYYY'),
            value: data?.customers.thisMonth,
        }
    ]

    const barChart = [
        {
            date: dayjs().subtract(2, 'month').startOf('month').format('MM/YYYY'),
            total: data?.leads.total.last2Month,
            won: data?.leads.won.last2Month,
            lost: data?.leads.lost.last2Month
        },
        {
            date: dayjs().subtract(1, 'month').startOf('month').format('MM/YYYY'),
            total: data?.leads.total.lastMonth,
            won: data?.leads.won.lastMonth,
            lost: data?.leads.lost.lastMonth
        },
        {
            date: dayjs().startOf('month').format('MM/YYYY'),
            total: data?.leads.total.thisMonth,
            won: data?.leads.won.thisMonth,
            lost: data?.leads.lost.thisMonth
        }
    ]

    const handleRefresh = () => {
        refetchCountCustomers();
        refetchValueLeads();
        refresh();
    };

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (dateRange?.[0] && dateRange?.[1]) {
            params.set('from', dateRange[0].toISOString());
            params.set('to', dateRange[1].toISOString());
        } else {
            params.delete('from');
            params.delete('to');
        }

        const newQuery = params.toString();
        if (newQuery !== searchParams.toString()) {
            router.replace(`${pathname}?${newQuery}`, { scroll: false });
        }
    }, [dateRange, pathname, router, searchParams]);

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
                        onClick={handleRefresh}
                    />
                </Flex>
            </Flex>

            {/* Statistics Section */}
            <Row gutter={[token.marginMD, token.marginMD]}>
                <Col xs={24} sm={12} md={8}>
                    <Card style={cardStyle} hoverable>
                        <Statistic
                            title={<Typography.Text type="secondary">{tOverview('totalCustomers')}</Typography.Text>}
                            value={countCustomers?.data}
                            prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
                            valueStyle={{ color: token.colorPrimary, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card style={cardStyle} hoverable>
                        <Statistic
                            title={<Typography.Text type="secondary">{tOverview('totalWonValue')}</Typography.Text>}
                            value={valueLeads?.data}
                            suffix={tCommon('currencySuffix')}
                            valueStyle={{ color: token.colorSuccess, fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card style={cardStyle} hoverable>
                        <Statistic
                            title={<Typography.Text type="secondary">{tOverview('conversionRate')}</Typography.Text>}
                            value={conversionRate}
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
                            <LineChart data={lineChart}>
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
                            <BarChart data={barChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ReTooltip />
                                <Legend />
                                <Bar dataKey="total" fill={token.colorPrimary} />
                                <Bar dataKey="won" fill={token.colorSuccess} />
                                <Bar dataKey="lost" fill={token.colorError} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </Flex>
    );
}
