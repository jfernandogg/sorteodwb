import {getRequestConfig} from 'next-intl/server';
// Definimos los idiomas válidos que tu aplicación soporta
const supportedLocales = ['es', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = 'es';
  try {
    const resolved = await requestLocale;
    // Solo asigna el idioma si existe y es válido ('es' o 'en')
    if (resolved && supportedLocales.includes(resolved)) {
      locale = resolved;
    }
  } catch (error) {
    console.warn('[i18n] Contexto no encontrado en Server Action. Forzando fallback a "es".');
  }

  return {
    locale, // This is now required
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
