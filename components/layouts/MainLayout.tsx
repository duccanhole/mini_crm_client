'use client';

import React, { useEffect, useState } from 'react';
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
    MenuOutlined,
    KeyOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import AuthService from '@/services/auth.service';
import NotificationDropdown from '@/components/shared/NotificationDropdown';

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

    const [userName, setUserName] = useState('User');
    const [userEmail, setUserEmail] = useState('');


    const menuItems: Record<'admin' | 'manager' | 'sale', MenuProps['items']> = {
        admin: [
            {
                key: 'overview',
                label: t('overview'),
                icon: <DashboardOutlined />,
            },
            {
                key: 'user',
                label: t('users'),
                icon: <TeamOutlined />,
            },
            {
                key: 'customer',
                label: t('customers'),
                icon: <UserOutlined />,
            },
            {
                key: 'lead',
                label: t('leads'),
                icon: <SolutionOutlined />,
            },
            {
                key: 'activity',
                label: t('activities'),
            },
        ],
        manager: [
            {
                key: 'overview',
                label: t('overview'),
            },
            {
                key: 'customer',
                label: t('customers'),
            },
            {
                key: 'lead',
                label: t('leads'),
            },
            {
                key: 'activity',
                label: t('activities'),
            },
        ],
        sale: [
            {
                key: 'overview',
                label: t('overview'),
                icon: <DashboardOutlined />,
            },
            {
                key: 'my-leads',
                label: t('my-leads'),
            },
            {
                key: 'my-customers',
                label: t('my-customers'),
            },
            {
                key: 'my-activities',
                label: t('my-activities'),
            },
        ],
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('profile'),
        },
        {
            key: 'change-password',
            icon: <KeyOutlined />,
            label: t('change-password'),
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
                router.push(`/${userRole}/profile`);
                break;
            case 'settings':
                router.push(`/${currentLocale}/settings`);
                break;
            case 'change-password':
                router.push(`/${userRole}/change-password`);
                break;
            case 'user':
                router.push('/admin/users');
                break;
            case 'customer':
                router.push(`/${userRole}/customers`);
                break;
            case 'lead':
                router.push(`/${userRole}/leads`);
                break;
            case 'activity':
                router.push(`/${userRole}/activities`);
                break;
            case 'my-leads':
                router.push('/sale/leads');
                break;
            case 'my-customers':
                router.push('/sale/customers');
                break;
            case 'my-activities':
                router.push('/sale/activities');
                break;
            case 'overview':
                if (userRole === 'admin') {
                    router.push('/admin');
                } else {
                    router.push(`/${userRole}/overview`);
                }
                break;
            case 'logout':
                modal.confirm({
                    title: tCommon('logoutTitle'),
                    content: tCommon('logoutConfirm'),
                    okText: tCommon('confirm'),
                    cancelText: tCommon('cancel'),
                    onOk: () => {
                        console.log('logout, redirect to', `/auth/login`)
                        AuthService.logout();
                        router.push(`/auth/login`);
                    },
                    okButtonProps: { danger: true },
                    centered: true,
                });
                break;
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const { name, email } = JSON.parse(user);
            setUserName(name);
            setUserEmail(email);
        }
    }, []);

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
                            onClick={handleMenuClick}
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
                    {screens.md && <NotificationDropdown role={userRole} />}
                    <Dropdown menu={{ items: userMenuItems, onClick: (e) => handleMenuClick(e) }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar size="small" icon={<UserOutlined />} />
                            {screens.md && (
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                    <Text strong>{userName}</Text>
                                    <Text type="secondary" style={{ fontSize: '10px' }}>{userEmail}</Text>
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
                    onClick={(e) => {
                        handleMenuClick(e);
                        setDrawerVisible(false);
                    }}
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
