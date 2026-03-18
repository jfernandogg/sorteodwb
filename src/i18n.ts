import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = 'es';
  try {
    const resolved = await requestLocale;
    if (resolved) locale = resolved;
  } catch (error) {
    // Evita que next-intl haga crashear las Server Actions cuando Next.js omite el middleware
    console.warn('[i18n] Contexto de next-intl no encontrado (Server Action). Usando fallback.');
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
