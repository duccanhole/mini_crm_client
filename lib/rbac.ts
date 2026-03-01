import { UserRole, Entity, Action } from '@/types/model';

/**
 * Role-Based Access Control (RBAC) configuration:
 * - admin: Full access to all entities.
 * - manager: Full access to leads, customers, and activities. Can view the user list.
 * - sale: Can view/edit leads and customers. Full access to activities. Can view the user list.
 */
export const PERMISSIONS: Record<UserRole, Partial<Record<Entity, Action[]>>> = {
    [UserRole.ADMIN]: {
        users: ['view', 'edit', 'delete'],
        customers: ['view', 'edit', 'delete'],
        leads: ['view', 'edit', 'delete'],
        activities: ['view', 'edit', 'delete'],
    },
    [UserRole.MANAGER]: {
        users: ['view'],
        customers: ['view', 'edit', 'delete'],
        leads: ['view', 'edit', 'delete'],
        activities: ['view', 'edit', 'delete'],
    },
    [UserRole.SALE]: {
        users: ['view'],
        customers: ['view', 'edit'],
        leads: ['view', 'edit'],
        activities: ['view', 'delete'],
    },
};

/**
 * Check permission for a role against a specific entity and action
 * @param role User role (admin, manager, sale)
 * @param entity Entity to check (users, customers, leads, activities)
 * @param action Action to check (view, edit, delete)
 * @returns true if permission is granted, false otherwise
 */
export const hasPermission = (role: UserRole | string | undefined, entity: Entity, action: Action): boolean => {
    if (!role) return false;
    
    // Cast role if it's a string from cookie/api
    const userRole = role as UserRole;
    
    const permissions = PERMISSIONS[userRole];
    if (!permissions) return false;
    
    const entityPermissions = permissions[entity];
    if (!entityPermissions) return false;
    
    return entityPermissions.includes(action);
};
