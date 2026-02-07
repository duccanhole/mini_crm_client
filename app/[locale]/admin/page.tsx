'use client';

import React from 'react';
import { Typography, Card, Col, Row, Statistic, Empty, Flex } from 'antd';
import { ArrowUpOutlined, UserOutlined, ShoppingCartOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminDashboard() {
    return (
        <Flex vertical gap="large">
            <div>
                <Title level={2} style={{ margin: 0 }}>Admin Dashboard</Title>
                <Text type="secondary">Chào mừng bạn trở lại, đây là tổng quan hệ thống của bạn.</Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Tổng người dùng"
                            value={11289}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                            suffix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Khách hàng mới"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<LineChartOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Đơn hàng"
                            value={93}
                            precision={0}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable>
                        <Statistic
                            title="Phản hồi"
                            value={1128}
                            precision={0}
                            suffix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Hoạt động gần đây" bordered={false}>
                <div style={{ padding: '40px 0' }}>
                    <Empty description="Biểu đồ hoạt động đang được cập nhật" />
                </div>
            </Card>
        </Flex>
    );
}
