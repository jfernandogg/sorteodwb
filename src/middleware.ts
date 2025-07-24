import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es'],
 
  // Used when no locale matches
  defaultLocale: 'es',

  // The `pathnames` object holds translations for pages using dynamic routes.
  // This is required even if you don't have any dynamic routes.
  pathnames: {}
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // - … the ones that are for admin pages
    '/((?!api|_next|_vercel|adminview-rxedbs|.*\\..*).*)'
  ]
};