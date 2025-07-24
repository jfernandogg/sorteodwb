"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AppFooter() {
  const t = useTranslations('AppFooter');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (year === null) {
    return (
      <footer className="w-full text-center p-4 mt-auto">
        <p className="text-sm text-muted-foreground">&nbsp;</p>
      </footer>
    );
  }

  return (
    <footer className="w-full text-center p-4 mt-auto">
      <p className="text-sm text-muted-foreground">
        {t('copyright', { year })}
      </p>
    </footer>
  );
}
