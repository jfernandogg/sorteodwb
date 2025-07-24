
"use client";

import { useState, useEffect } from 'react';

export default function AppFooter() {
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

  // Simplified copyright notice that does not require translations.
  const copyrightText = `© ${year} Living Center Medellín. All rights reserved.`;

  return (
    <footer className="w-full text-center p-4 mt-auto">
      <p className="text-sm text-muted-foreground">
        {copyrightText}
      </p>
    </footer>
  );
}
