'use client';

import React, { useState } from 'react';
import { Button, Flex, Radio, Space, theme, Typography } from 'antd';
import {
    AppstoreOutlined,
    BarsOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import LeadCardView from '@/components/leads/card-view';

const { Title } = Typography;

export default function MyLeadsPage() {
    const t = useTranslations('LeadsPage');
    const tCommon = useTranslations('common');
    const tNav = useTranslations('navigation');
    const { token } = theme.useToken();

    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <Flex vertical gap={token.marginLG}>
            {/* Header Toolbar */}
            <Flex justify="space-between" align="center">
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
                <LeadCardView loading={isLoading} />
            ) : (
                <div style={{ padding: token.paddingLG, backgroundColor: token.colorBgContainer, borderRadius: token.borderRadiusLG, border: `1px solid ${token.colorBorderSecondary}` }}>
                    <Text type="secondary">List View đang được phát triển...</Text>
                </div>
            )}
        </Flex>
    );
}

const { Text } = Typography;
