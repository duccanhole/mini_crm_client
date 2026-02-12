import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAsset = pathname.includes('.') || pathname.startsWith('/_next');
  if (isAsset) return null;

  const locale = req.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;

  // 1. Identify public routes (auth pages)
  const isPublicPage = pathname.includes('/auth/login') || pathname.includes('/auth/register') || pathname.includes('/error');

  // 2. Check for token and role in cookies
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  // 3. Auth logic for protected routes
  if (!token && !isPublicPage) {
    const isApiRoute = pathname.startsWith('/api');

    // Only redirect valid app routes that are not public
    if (!isApiRoute) {
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Role-Based Access Control (RBAC)
  if (token && role && !isPublicPage) {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const accessDefinition: Record<string, string[]> = {
      admin: ['/admin', '/manager', '/sale'],
      manager: ['/manager', '/sale'],
      sale: ['/sale'],
    }
    let isAuthorized = true;

    if (role in accessDefinition) {
      isAuthorized = accessDefinition[role].some((path) => pathWithoutLocale.startsWith(path));
    }
    else {
      isAuthorized = false;
    }

    if (!isAuthorized) {
      const errorUrl = new URL(`/${locale}/error`, req.url);
      errorUrl.searchParams.set('code', '403');
      errorUrl.searchParams.set('message', 'permission denied');
      return NextResponse.redirect(errorUrl);
    }
  }

  // 5. If token exists and on public page (except error), redirect to their dashboard
  if (token && isPublicPage && !pathname.includes('/error')) {
    const dashboardPath = role === 'admin' ? '/admin/users' : role === 'sale' ? '/sale/users' : `/${role}/dashboard`;
    const dashboardUrl = new URL(`/${locale}${dashboardPath}`, req.url);
    // return NextResponse.redirect(dashboardUrl);
  }

  return null; // Continue to next middleware
}
