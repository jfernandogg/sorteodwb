"use client";

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function AppFooter() {
  const t = useTranslations('AppFooter');
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full text-center p-4 mt-auto">
      <p className="text-sm text-muted-foreground">
        {t('copyright', { year })}
      </p>
    </footer>
  );
}
