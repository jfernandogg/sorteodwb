import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  console.log('[Middleware] Resolving locale for:', request.nextUrl.pathname);
  return createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'es'],
   
    // Used when no locale matches
    defaultLocale: 'es',
  
    // The `pathnames` object holds translations for pages using dynamic routes.
    // This is required even if you don't have any dynamic routes.
    pathnames: {},
  
    // If this is specified, the middleware will redirect users from '/' to '/es'
    localePrefix: 'always'
  })(request);
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // Match the root
    '/((?!api|_next|_vercel|adminview-rxedbs|.*\\..*).*)'
  ]
};