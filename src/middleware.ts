import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es'],
 
  // Used when no locale matches
  defaultLocale: 'es',

  // The `pathnames` object holds translations for pages using dynamic routes.
  // This is required even if you don't have any dynamic routes.
  pathnames: {},

  // If this is specified, the middleware will redirect users from '/' to '/es'
  localePrefix: 'always'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // Match the root
    '/((?!api|_next|_vercel|adminview-rxedbs|.*\\..*).*)'
  ]
};