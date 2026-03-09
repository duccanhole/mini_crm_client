import { describe, expect, it } from 'vitest';

import { hasPermission } from '@/lib/rbac';
import { UserRole } from '@/types/model';

describe('hasPermission', () => {
  it('grants admin permission for delete on users', () => {
    expect(hasPermission(UserRole.ADMIN, 'users', 'delete')).toBe(true);
  });

  it('denies manager permission for edit on users', () => {
    expect(hasPermission(UserRole.MANAGER, 'users', 'edit')).toBe(false);
  });

  it('grants sale permission for delete on activities', () => {
    expect(hasPermission(UserRole.SALE, 'activities', 'delete')).toBe(true);
  });

  it('denies permission when role is undefined', () => {
    expect(hasPermission(undefined, 'leads', 'view')).toBe(false);
  });

  it('denies permission for unknown role string', () => {
    expect(hasPermission('unknown', 'leads', 'view')).toBe(false);
  });
});
