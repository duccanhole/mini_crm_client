import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { authMiddleware } from './middleware/auth';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // Run auth logic first
  const authResponse = authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  // Then run intl logic
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (static files)
  // - /_vercel (Vercel internals)
  // - All files with an extension (e.g. favicon.ico, logo.png)
  matcher: [
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
