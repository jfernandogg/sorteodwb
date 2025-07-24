import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  // and load the messages for the given locale.
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});