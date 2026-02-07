'use client';

import React from 'react';
import { Layout, Space, Switch, Button, Typography } from 'antd';
import { SunOutlined, MoonOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '@/hooks/useLanguage';

const { Header } = Layout;
const { Text } = Typography;

interface AuthHeaderProps {
    isDarkMode: boolean | undefined;
    setDarkMode: (checked: boolean) => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isDarkMode = true, setDarkMode }) => {
    const { currentLocale, toggleLanguage } = useLanguage();

    return (
        <Header style={{
            background: 'transparent',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 24px'
        }}>
            <Space size="middle">
                <Space>
                    <Switch
                        checked={isDarkMode}
                        onChange={setDarkMode}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                    />
                    <Text type="secondary">{isDarkMode ? 'Dark' : 'Light'}</Text>
                </Space>
                <Button
                    type="text"
                    icon={<GlobalOutlined />}
                    onClick={toggleLanguage}
                >
                    {currentLocale === 'vi' ? 'English' : 'Tiếng Việt'}
                </Button>
            </Space>
        </Header>
    );
};

export default AuthHeader;
