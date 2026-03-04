import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip assets and internal next paths
  const isAsset = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/public');
  if (isAsset) return null;

  const locale = req.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;
  
  // Identify locale prefix if present
  let pathWithoutLocale = pathname;
  const localeInPath = routing.locales.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);
  if (localeInPath) {
    pathWithoutLocale = pathname.replace(`/${localeInPath}`, '') || '/';
  }

  // 1. Identify public routes
  const isPublicPage = pathWithoutLocale.startsWith('/auth/login') || 
                       pathWithoutLocale.startsWith('/auth/register') || 
                       pathWithoutLocale.startsWith('/error');

  // 2. Check for token and role in cookies
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  // 3. Root path handling: redirect to login if not authed, otherwise to dashboard
  if (pathWithoutLocale === '/') {
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
    } else {
      const dashboardPath = role === 'admin' ? '/admin/users' : role === 'sale' ? '/sale/customers' : role === 'manager' ? '/manager/overview' : '/error?code=404';
      return NextResponse.redirect(new URL(`/${locale}${dashboardPath}`, req.url));
    }
  }

  // 4. Auth logic for protected routes
  if (!token && !isPublicPage) {
    const isApiRoute = pathname.startsWith('/api');
    if (!isApiRoute) {
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
    return null;
  }

  // 5. RBAC and 404 for unknown/unauthorized routes
  if (!isPublicPage && !pathname.startsWith('/api')) {
    const accessDefinition: Record<string, string[]> = {
      admin: ['/admin', '/manager', '/sale'],
      manager: ['/manager', '/sale'],
      sale: ['/sale'],
    };

    const allPrivatePrefixes = ['/admin', '/manager', '/sale'];
    const isPrivatePath = allPrivatePrefixes.some(prefix => pathWithoutLocale.startsWith(prefix));

    if (isPrivatePath) {
      // If no token or role, redirect to login (handled in step 4, but here as safety)
      if (!token || !role || !(role in accessDefinition)) {
        return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
      }
      
      const isAuthorized = accessDefinition[role].some((path) => pathWithoutLocale.startsWith(path));
      if (!isAuthorized) {
        // Forbidden - access to existing area but no permission
        return NextResponse.redirect(new URL(`/${locale}/error?code=403&message=permission denied`, req.url));
      }
    } else {
      // Not found - path does not match any known application area
      return NextResponse.redirect(new URL(`/${locale}/error?code=404&message=page not found`, req.url));
    }
  }

  // 6. Redirect auth pages to dashboard if already logged in
  if (token && isPublicPage && !pathWithoutLocale.startsWith('/error')) {
    const dashboardPath = role === 'admin' ? '/admin/users' : role === 'sale' ? '/sale/customers' : role === 'manager' ? '/manager/overview' : '/';
    const dashboardUrl = new URL(`/${locale}${dashboardPath}`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return null;
}
