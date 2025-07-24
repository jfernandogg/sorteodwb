"use client";

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function AppFooter() {
  const t = useTranslations('AppFooter');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    setYear(new Date().getFullYear());
  }, []);

  // While rendering on the server or before the client has mounted,
  // we can return a placeholder or null to avoid mismatch.
  if (year === null) {
    // Returning a placeholder with the same structure helps prevent layout shifts.
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