export interface User {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
}

export interface Customer {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    notes?: string;
    sale?: User;
}

export interface Lead {
    id: string | number;
    customer: Customer;
    value: number;
    status: string;
    assignedTo: User;
    expectedCloseDate: string;
    createdAt: string;
    createdBy: User;
}

export interface Activity {
    id: string | number;
    lead: Lead;
    type: string;
    description: string;
    createdAt: string;
    createdBy: User;
}

export interface Notification {
    id: string | number;
    user: User;
    type: NotificationType | string;
    title: string;
    message: string;
    read: boolean;
    metaData: string;
    createdAt: string;
}

export enum UserRole {
    ADMIN = 'admin',
    SALE = 'sale',
    MANAGER = 'manager',
}

export enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    QUALIFIED = 'QUALIFIED',
    WON = 'WON',
    LOST = 'LOST',
}

export enum NotificationType {
    LEAD_CREATED = 'LEAD_CREATED',
    LEAD_UPDATED = 'LEAD_UPDATED',
    CUSTOMER_ASSIGNED = 'CUSTOMER_ASSIGNED',
    ACTIVITY_CREATED = 'ACTIVITY_CREATED',
}

/**
 * Định nghĩa các Entity (Thực thể) trong hệ thống
 */
export type Entity = 'users' | 'customers' | 'leads' | 'activities';

/**
 * Định nghĩa các Action (Hành động) có thể thực hiện trên Entity
 */
export type Action = 'view' | 'edit' | 'delete';