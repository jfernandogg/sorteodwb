
"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLocale = (nextLocale: 'en' | 'es') => {
    // This will replace the locale in the URL, but keep the rest of the path.
    // e.g., /es/about -> /en/about
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.replace(newPath, { scroll: false });
  };

  return (
    <div className="flex justify-center items-center gap-2 py-2 bg-background">
      <Button
        variant={locale === 'es' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => changeLocale('es')}
        aria-pressed={locale === 'es'}
      >
        <span role="img" aria-label="Bandera de Colombia" className="mr-2">🇨🇴</span> Español
      </Button>
      <Button
        variant={locale === 'en' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => changeLocale('en')}
        aria-pressed={locale === 'en'}
      >
        <span role="img" aria-label="Bandera de Estados Unidos" className="mr-2">🇺🇸</span> English
      </Button>
    </div>
  );
}
