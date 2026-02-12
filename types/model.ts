export interface User {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    role: string;
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

export interface Notification {
    id: string | number;
    user: User;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    metaData: string;
    createdAt: string;
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
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    metaData: string;
    createdAt: string;
}