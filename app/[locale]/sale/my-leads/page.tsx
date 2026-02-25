'use client';

import React, { useState, useEffect } from 'react';
import { Button, Flex, Radio, Space, theme, Typography, DatePicker } from 'antd';
import {
    AppstoreOutlined,
    BarsOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import LeadCardView from '@/components/leads/card-view';
import dayjs, { Dayjs } from 'dayjs';
import LeadListView from '@/components/leads/list-view';
import { Lead } from '@/types/model';
import { useGetLeads } from '@/hooks/api/useLead';
import { SearchQueryParams } from '@/types/api';
import { useRouter } from '@/i18n/routing';

const { RangePicker } = DatePicker;

const DEFAULT_PAGE_SIZE = 12;

export default function MyLeadsPage() {
    const tCommon = useTranslations('common');
    const { token } = theme.useToken();

    const router = useRouter();

    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
        dayjs().startOf('week'),
        dayjs().endOf('week')
    ]);
    const [page, setPage] = useState(0);
    const [leads, setLeads] = useState<Lead[]>([]);

    const queryParams: SearchQueryParams = {
        page: page,
        size: DEFAULT_PAGE_SIZE,
        createdFrom: dateRange?.[0]?.toISOString(),
        createdTo: dateRange?.[1]?.toISOString(),
    };

    const { data: leadsResponse, isLoading, isFetching, refetch } = useGetLeads(queryParams);

    const hasMore = leadsResponse?.data ? (leadsResponse.data.number + 1 < leadsResponse.data.totalPages) : false;

    useEffect(() => {
        if (leadsResponse?.data.content) {
            if (page === 0) {
                setLeads(leadsResponse.data.content);
            } else {
                setLeads(prev => [...prev, ...leadsResponse.data.content]);
            }
        }
    }, [leadsResponse, page]);

    const handleRefresh = () => {
        setPage(0);
        refetch();
    };

    const handleLoadMore = () => {
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const onDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        setDateRange(dates);
        setPage(0); // Reset về trang đầu khi thay đổi filter
    };

    return (
        <Flex vertical gap={token.marginLG}>
            {/* Header Toolbar */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
                <Flex gap={token.marginMD} align="center" wrap="wrap">
                    <Radio.Group
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value="card">
                            <Space size={4}>
                                <AppstoreOutlined />
                            </Space>
                        </Radio.Button>
                        <Radio.Button value="list">
                            <Space size={4}>
                                <BarsOutlined />
                            </Space>
                        </Radio.Button>
                    </Radio.Group>

                    <RangePicker
                        value={dateRange}
                        onChange={onDateRangeChange}
                        format="DD/MM/YYYY"
                        placeholder={[tCommon('start date'), tCommon('end date')]}
                        style={{ borderRadius: token.borderRadiusLG }}
                    />
                </Flex>

                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isLoading && page === 0}
                        onClick={handleRefresh}
                    />
                    <Button
                        type="primary"
                        onClick={() => router.push('/sale/leads/new')}
                    >
                        {tCommon('add new')}
                    </Button>
                </Space>
            </Flex>

            {/* Content Area */}
            {viewMode === 'card' ? (
                <LeadCardView
                    loading={isLoading && page === 0}
                    leads={leads}
                    hasMore={hasMore}
                    loadingMore={isFetching && page > 0}
                    onLoadMore={handleLoadMore}
                />
            ) : (
                <LeadListView
                    loading={isLoading && page === 0}
                    leads={leads}
                    hasMore={hasMore}
                    loadingMore={isFetching && page > 0}
                    onLoadMore={handleLoadMore}
                    role="sale"
                />
            )}
        </Flex>
    );
}
