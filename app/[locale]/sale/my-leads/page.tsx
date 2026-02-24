'use client';

import React, { useState } from 'react';
import { Button, Flex, Radio, Space, theme, Typography, DatePicker } from 'antd';
import {
    AppstoreOutlined,
    BarsOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import LeadCardView from '@/components/leads/card-view';
import dayjs, { Dayjs } from 'dayjs';
import LeadListView from '@/components/leads/list-view';
import { Lead } from '@/types/model';

const { Title } = Typography;
const { RangePicker } = DatePicker;

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


export default function MyLeadsPage() {
    const t = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');
    const tNav = useTranslations('navigation');
    const { token } = theme.useToken();

    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
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
                        onChange={(dates) => setDateRange(dates)}
                        format="DD/MM/YYYY"
                        placeholder={[tCommon('start date'), tCommon('end date')]}
                        style={{ borderRadius: token.borderRadiusLG }}
                    />
                </Flex>

                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isLoading}
                        onClick={handleRefresh}
                    />
                    <Button
                        type="primary"
                        onClick={() => console.log('Create new lead')}
                    >
                        {tCommon('add new')}
                    </Button>
                </Space>
            </Flex>

            {/* Content Area */}
            {viewMode === 'card' ? (
                <LeadCardView loading={isLoading} leads={mockLeads} />
            ) : (
                <LeadListView loading={isLoading} leads={mockLeads} />
            )}
        </Flex>
    );
}

const { Text } = Typography;
