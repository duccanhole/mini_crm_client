'use client';

import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Space, Avatar, Dropdown, Typography, Drawer, Grid, App, type MenuProps } from 'antd';
import { useDarkMode } from '@/components/providers/ThemeProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from '@/i18n/routing';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    DashboardOutlined,
    TeamOutlined,
    SolutionOutlined,
    SunOutlined,
    MoonOutlined,
    GlobalOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface MainLayoutProps {
    children: React.ReactNode;
    userRole?: 'admin' | 'manager' | 'sale';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, userRole = 'admin' }) => {
    const { mode, toggleTheme } = useDarkMode();
    const { currentLocale, changeLanguage } = useLanguage();
    const router = useRouter();
    const screens = useBreakpoint();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { modal } = App.useApp();

    const {
        token: { colorBgContainer, borderRadiusLG, colorTextDescription, colorPrimary },
    } = theme.useToken();
    const t = useTranslations('navigation');
    const tCommon = useTranslations('common');

    const menuItems: Record<'admin' | 'manager' | 'sale', MenuProps['items']> = {
        admin: [
            {
                key: 'user',
                label: 'user',
            },
            {
                key: 'customer',
                label: 'customer',
            },
            {
                key: 'lead',
                label: 'lead',
            },
        ],
        manager: [],
        sale: [],
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: t('settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('logout'),
            danger: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case 'profile':
                router.push('/profile');
                break;
            case 'settings':
                router.push('/settings');
                break;
            case 'logout':
                modal.confirm({
                    title: tCommon('logoutTitle'),
                    content: tCommon('logoutConfirm'),
                    okText: tCommon('confirm'),
                    cancelText: tCommon('cancel'),
                    onOk: () => {
                        // Clear auth tokens if any (optional based on project)
                        router.push('/auth/login');
                    },
                    okButtonProps: { danger: true },
                    centered: true,
                });
                break;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: screens.md ? '0 24px' : '0 16px',
                    background: colorBgContainer,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                    boxShadow: mode === 'dark' ? '0 1px 4px rgba(0, 0, 0, 0.5)' : '0 1px 4px rgba(0, 21, 41, 0.08)',
                }}
            >
                <Space size="middle">
                    {!screens.md && (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setDrawerVisible(true)}
                        />
                    )}
                    <Title level={4} style={{ margin: 0, color: colorPrimary, whiteSpace: 'nowrap' }}>
                        {screens.md ? 'MiniCRM' : 'CRM'}
                    </Title>
                    {screens.md && (
                        <Menu
                            mode="horizontal"
                            defaultSelectedKeys={['dashboard']}
                            items={menuItems[userRole]}
                            style={{ borderBottom: 'none', minWidth: '300px' }}
                        />
                    )}
                </Space>

                <Space size={screens.md ? 'middle' : 'small'}>
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        onClick={() => changeLanguage(currentLocale === 'vi' ? 'en' : 'vi')}
                    >
                        {screens.md && (currentLocale === 'vi' ? 'VI' : 'EN')}
                    </Button>
                    <Button
                        type="text"
                        icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                        onClick={toggleTheme}
                    />
                    {screens.md && <Button type="text" icon={<BellOutlined />} />}
                    <Dropdown menu={{ items: userMenuItems, onClick: (e) => handleMenuClick(e) }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar size="small" icon={<UserOutlined />} />
                            {screens.md && (
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                    <Text strong>Admin</Text>
                                    <Text type="secondary" style={{ fontSize: '10px' }}>{userRole.toUpperCase()}</Text>
                                </div>
                            )}
                        </Space>
                    </Dropdown>
                </Space>
            </Header>

            <Drawer
                title="MiniCRM"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                size="large"
                styles={{ body: { padding: 0 } }}
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={menuItems[userRole]}
                    onClick={() => setDrawerVisible(false)}
                />
            </Drawer>

            <Content style={{ padding: screens.md ? '24px' : '16px' }}>
                <div
                    style={{
                        padding: screens.md ? 24 : 16,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', color: colorTextDescription }}>
                Mini CRM ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};

export default MainLayout;
