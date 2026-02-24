'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Space,
    Tooltip,
    Avatar,
    Button,
    Empty,
    theme,
    Flex,
    Badge,
    Spin
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    MoreOutlined,
    EnvironmentOutlined,
    HolderOutlined
} from '@ant-design/icons';
import { Lead } from '@/types/model';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text } = Typography;

interface LeadCardViewProps {
    leads?: Lead[];
    loading?: boolean;
    onCreate?: () => void;
}

const LeadCard = ({ lead, isOverlay = false, dragAttributes, dragListeners }: {
    lead: Lead,
    isOverlay?: boolean,
    dragAttributes?: any,
    dragListeners?: any
}) => {
    const t = useTranslations('LeadsPage');
    const { token } = theme.useToken();

    return (
        <Card
            hoverable
            size="small"
            style={{
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`,
                opacity: isOverlay ? 0.8 : 1,
            }}
            styles={{
                body: { padding: token.paddingMD },
                header: { padding: `0 ${token.paddingMD}px`, minHeight: 48 }
            }}
            className="group"
            title={
                <Flex align="center" gap={token.marginXS}>
                    <Flex vertical gap={2} style={{ padding: `${token.paddingXS}px 0`, flex: 1, overflow: 'hidden' }}>
                        <Text strong className="truncate block">
                            {lead.customer.name}
                        </Text>
                        <Space size={4}>
                            {
                                lead.customer.company ? (
                                    <Space size={4}>
                                        <EnvironmentOutlined style={{ fontSize: token.fontSizeSM, color: token.colorTextDescription }} />
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            {lead.customer.company}
                                        </Text>
                                    </Space>
                                ) : (
                                    <Text style={{ fontSize: 11 }}>-</Text>
                                )
                            }
                        </Space>
                    </Flex>
                    {/* Drag Handle - Chỉ phần này mới có thể nắm để kéo */}
                    <div
                        {...dragAttributes}
                        {...dragListeners}
                        style={{
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'center',
                            // padding: '4px',
                            // marginRight: -4,
                            // borderRadius: 4,
                            color: token.colorTextQuaternary,
                        }}
                        className="rounded-md p-2"
                    >
                        <HolderOutlined style={{ fontSize: 16 }} />
                    </div>
                </Flex>
            }
            actions={[
                <Tooltip title={lead.customer.phone} key="phone">
                    <Button type="text" size="small" icon={<PhoneOutlined style={{ color: token.colorTextTertiary }} />} />
                </Tooltip>,
                <Tooltip title={lead.customer.email} key="email">
                    <Button type="text" size="small" icon={<MailOutlined style={{ color: token.colorTextTertiary }} />} />
                </Tooltip>,
                <Tooltip title="Xem chi tiết" key="more">
                    <Button type="text" size="small" icon={<MoreOutlined style={{ color: token.colorTextTertiary }} />} />
                </Tooltip>,
            ]}
        >
            <Flex vertical gap={token.marginMD}>
                <Flex vertical gap={0} style={{ borderBottom: `1px dashed ${token.colorBorderSecondary}`, paddingBottom: token.paddingSM }}>
                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('value')}</Text>
                    <Text strong style={{ color: token.colorPrimary, fontSize: token.fontSizeLG }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lead.value)}
                    </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                    <Flex vertical gap={2}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{t('expectedCloseDate')}</Text>
                        <Space size={4}>
                            <CalendarOutlined style={{ color: token.colorTextQuaternary, fontSize: 12 }} />
                            <Text style={{ fontSize: 12 }}>{lead.expectedCloseDate ? dayjs(lead.expectedCloseDate).format('DD/MM HH:mm') : '-'}</Text>
                        </Space>
                    </Flex>
                    <Flex vertical gap={2} align="end">
                        <Text type="secondary" style={{ fontSize: 11 }}>{t('assignedTo')}</Text>
                        <Space size={4}>
                            {lead.assignedTo.name ? (
                                <Space size={4}>
                                    <Avatar size={16} src={lead.assignedTo?.email ? undefined : undefined} icon={<UserOutlined />} />
                                    <Text className="truncate max-w-[80px]" style={{ fontSize: 12 }}>{lead.assignedTo?.name}</Text>
                                </Space>
                            ) : (
                                <Text style={{ fontSize: 12 }}>-</Text>
                            )}
                        </Space>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

const SortableLeadCard = ({ lead }: { lead: Lead }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <LeadCard
                lead={lead}
                dragAttributes={attributes}
                dragListeners={listeners}
            />
        </div>
    );
};

const COLUMNS = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];

const DroppableContainer = ({ id, children, loading }: { id: string, children: React.ReactNode, loading: boolean }) => {
    const { setNodeRef } = useDroppable({ id });
    const { token } = theme.useToken();

    return (
        <Flex
            ref={setNodeRef}
            vertical
            gap={token.marginSM}
            style={{
                flex: 1,
                minHeight: '200px', // Đảm bảo luôn có không gian để drop
                paddingBottom: '100px' // Thêm padding để dễ drop vào cuối danh sách
            }}
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ flex: 1, minHeight: 150 }}>
                    <Spin />
                </Flex>
            ) : children}
        </Flex>
    );
};

const LeadCardView = ({ leads: initialLeads = [], loading = false }: LeadCardViewProps) => {
    const { token } = theme.useToken();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);

    useEffect(() => {
        setLeads(initialLeads);
    }, [initialLeads]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const groupedLeads = COLUMNS.reduce((acc, status) => {
        acc[status] = leads.filter(lead => lead.status.toUpperCase() === status);
        return acc;
    }, {} as Record<string, Lead[]>);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'NEW': return token.colorPrimary;
            case 'CONTACTED': return token.colorWarning;
            case 'QUALIFIED': return token.colorInfo;
            case 'WON': return token.colorSuccess;
            case 'LOST': return token.colorError;
            default: return token.colorTextTertiary;
        }
    };

    // -- Drag and Drop Handlers --

    /**
     * Khi bắt đầu kéo: Lưu lại ID của Lead đang được kéo để hiển thị trên DragOverlay
     */
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    /**
     * Khi đang kéo qua các vị trí khác (Drag Over):
     * Logic này xử lý việc "nhảy" thẻ giữa các cột (status) khác nhau
     */
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;

        // Tìm Lead đang được kéo
        const activeLead = leads.find((l) => l.id === activeId);
        if (!activeLead) return;

        /**
         * Trường hợp 1: Di chuyển vào một cột (overId là tên status như 'NEW', 'WON'...)
         */
        if (COLUMNS.includes(overId as string)) {
            if (activeLead.status.toUpperCase() !== overId) {
                setLeads((prev) =>
                    prev.map((l) =>
                        l.id === activeId ? { ...l, status: overId as string } : l
                    )
                );
            }
            return;
        }

        /**
         * Trường hợp 2: Di chuyển đè lên một thẻ khác
         * Nếu thẻ đó thuộc cột khác, ta cập nhật status của thẻ đang kéo
         */
        const overLead = leads.find((l) => l.id === overId);
        if (overLead && activeLead.status !== overLead.status) {
            setLeads((prev) =>
                prev.map((l) =>
                    l.id === activeId ? { ...l, status: overLead.status } : l
                )
            );
        }
    };

    /**
     * Khi kết thúc kéo (Drag End):
     * Xử lý việc sắp xếp lại thứ tự (reorder) trong cùng một cột
     */
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null); // Reset ID đang kéo

        if (!over) return;

        // Nếu vị trí kết thúc khác vị trí bắt đầu, thực hiện sắp xếp lại mảng
        if (active.id !== over.id) {
            const activeIndex = leads.findIndex((l) => l.id === active.id);
            const overIndex = leads.findIndex((l) => l.id === over.id);

            if (activeIndex !== -1 && overIndex !== -1) {
                // arrayMove là helper của dnd-kit để tráo đổi vị trí phần tử
                setLeads((items) => arrayMove(items, activeIndex, overIndex));
            }
        }

        // TODO: Tại đây có thể gọi API để cập nhật status/rank mới của Lead lên Database
    };

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <Flex vertical style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                    <Flex gap={token.marginMD} style={{ height: '100%', minWidth: 'max-content', padding: token.paddingXXS }}>
                        {COLUMNS.map(status => (
                            <SortableContext
                                key={status}
                                id={status}
                                items={groupedLeads[status].map(l => l.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Card
                                    size="small"
                                    styles={{
                                        body: {
                                            padding: token.paddingSM,
                                            backgroundColor: token.colorFillAlter,
                                            flex: 1,
                                            overflowY: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        },
                                        header: {
                                            borderBottom: `2px solid ${getStatusColor(status)}`,
                                            backgroundColor: token.colorBgContainer
                                        }
                                    }}
                                    className="custom-scrollbar"
                                    title={
                                        <Space size={8}>
                                            <Badge color={getStatusColor(status)} />
                                            <Text strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {status}
                                            </Text>
                                            <Badge
                                                count={groupedLeads[status].length}
                                                showZero
                                                color={token.colorFillSecondary}
                                                style={{ color: token.colorTextSecondary, fontSize: 10 }}
                                            />
                                        </Space>
                                    }
                                    style={{
                                        width: 320,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: token.borderRadiusLG,
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <DroppableContainer id={status} loading={loading}>
                                        {groupedLeads[status].length === 0 ? (
                                            <Flex align="center" justify="center" style={{ flex: 1, minHeight: 150 }}>
                                                <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description={<Text type="secondary" style={{ fontSize: 12 }}>Trống</Text>}
                                                />
                                            </Flex>
                                        ) : (
                                            groupedLeads[status].map(lead => (
                                                <SortableLeadCard key={lead.id} lead={lead} />
                                            ))
                                        )}
                                    </DroppableContainer>
                                </Card>
                            </SortableContext>
                        ))}
                    </Flex>
                </div>
                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeLead ? (
                        <LeadCard lead={activeLead} isOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px !important;
                    height: 10px !important;
                    display: block !important;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${token.colorFillQuaternary} !important;
                    border-radius: 10px !important;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: ${token.colorFill} !important;
                    border-radius: 10px !important;
                    border: 2px solid ${token.colorFillQuaternary} !important;
                    background-clip: content-box !important;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: ${token.colorTextSecondary} !important;
                }
                /* Tăng cường độ đậm cho Light Mode */
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    box-shadow: inset 0 0 0 10px ${token.colorFillSecondary};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    box-shadow: inset 0 0 0 10px ${token.colorFill};
                }
            `}</style>
        </Flex>
    );
};

export default LeadCardView;
