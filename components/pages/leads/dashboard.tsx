'use client';

import React, { useState, useEffect } from 'react';
import { Button, Flex, Radio, Space, theme, Typography, DatePicker, Select, Card, Statistic, Row, Col, Progress, Divider } from 'antd';
import {
    AppstoreOutlined,
    BarsOutlined,
    ReloadOutlined,
    UserOutlined,
    DollarOutlined,
    LineChartOutlined,
    PieChartOutlined,
    RiseOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import LeadCardView from '@/components/leads/card-view';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import LeadListView from '@/components/leads/list-view';
import { Lead, UserRole } from '@/types/model';
import { useGetLeads } from '@/hooks/api/useLead';
import { SearchQueryParams } from '@/types/api';
import { useRouter, usePathname } from '@/i18n/routing';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetUsers } from '@/hooks/api/useUser';

const { RangePicker } = DatePicker;

const DEFAULT_PAGE_SIZE = 12;

const { Option } = Select;

export default function LeadsDashboard({ role }: { role?: UserRole }) {
    const tCommon = useTranslations('common');
    const tLeads = useTranslations('LeadsPage');
    const { token } = theme.useToken();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial values from URL
    const urlView = searchParams.get('view');
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');

    const [viewMode, setViewMode] = useState<'card' | 'list'>(
        (urlView === 'card' || urlView === 'list') ? urlView : 'card'
    );

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

    const [page, setPage] = useState(0);
    const [leads, setLeads] = useState<Lead[]>([]);

    const user = useUserInfo();

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', viewMode);
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
    }, [viewMode, dateRange, pathname, router, searchParams]);

    const [assignedToId, setAssignedToId] = useState<string | number | undefined>(undefined);

    const queryParams: SearchQueryParams = {
        page: page,
        size: DEFAULT_PAGE_SIZE,
        createdFrom: dateRange?.[0]?.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        createdTo: dateRange?.[1]?.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        assignedToId: role === UserRole.SALE ? user?.id : assignedToId,
    };

    const { data: leadsResponse, isLoading, isFetching, refetch } = useGetLeads(queryParams);

    const hasMore = leadsResponse?.data ? (leadsResponse.data.number + 1 < leadsResponse.data.totalPages) : false;

    const [userSearch, setUserSearch] = useState('');
    const debouncedUserSearch = useDebounce(userSearch, 500);
    const { data: usersResponse, isLoading: isFetchingUsers } = useGetUsers({
        size: 100,
        search: debouncedUserSearch,
        role: UserRole.SALE
    });


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
                <Flex>
                    <Radio.Group
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
                        <Radio.Button value="list"><BarsOutlined /></Radio.Button>
                    </Radio.Group>
                </Flex>
                <Flex gap={token.marginMD} align="center" wrap="wrap">
                    <RangePicker
                        value={dateRange}
                        onChange={onDateRangeChange}
                        format="DD/MM/YYYY"
                        placeholder={[tCommon('start date'), tCommon('end date')]}
                        style={{ borderRadius: token.borderRadiusLG }}
                    />
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isLoading && page === 0}
                        onClick={handleRefresh}
                    />
                    <Button
                        type="primary"
                        onClick={() => router.push(`/${role}/leads/new?assignedToId=${user?.id}`)}
                    >
                        {tCommon('add new')}
                    </Button>
                </Flex>
            </Flex>

            {role !== UserRole.SALE && (
                <Space>
                    <Select
                        showSearch
                        filterOption={false}
                        onSearch={setUserSearch}
                        placeholder={tLeads('assignedTo')}
                        loading={isFetchingUsers}
                        onChange={(value) => {
                            setAssignedToId(value || undefined);
                            setPage(0);
                        }}
                        style={{ width: 220, borderRadius: token.borderRadiusLG }}
                        allowClear
                    >
                        {usersResponse?.data?.content?.map((user: any) => (
                            <Option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </Option>
                        ))}
                    </Select>
                </Space>
            )}

            {/* Data Display area */}
            {viewMode === 'card' ? (
                <LeadCardView
                    loading={isLoading && page === 0}
                    leads={leads}
                    hasMore={hasMore}
                    loadingMore={isFetching && page > 0}
                    role={role}
                    onLoadMore={handleLoadMore}
                />
            ) : (
                <LeadListView
                    loading={isLoading && page === 0}
                    leads={leads}
                    hasMore={hasMore}
                    loadingMore={isFetching && page > 0}
                    onLoadMore={handleLoadMore}
                    role={role}
                />
            )}
        </Flex>
    );
}
