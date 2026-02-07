import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Identify public routes (auth pages)
  const isPublicPage = pathname.includes('/auth/login') || pathname.includes('/auth/register');
  
  // 2. Check for token in cookies
  const token = req.cookies.get('token')?.value;

  // 3. Auth logic for protected routes
  if (!token && !isPublicPage) {
    const isApiRoute = pathname.startsWith('/api');
    const isAsset = pathname.includes('.') || pathname.startsWith('/_next');

    // Only redirect valid app routes that are not public
    if (!isApiRoute && !isAsset) {
        const locale = req.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;
        const loginUrl = new URL(`/${locale}/auth/login`, req.url);
        return NextResponse.redirect(loginUrl);
    }
  }

  // 4. If token exists and on public page, redirect to dashboard
  if (token && isPublicPage) {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;
    const dashboardUrl = new URL(`/${locale}/admin`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return null; // Continue to next middleware
}
