"use client";

import { useState, useEffect } from 'react';

export default function AppFooter() {
  const [displayYear, setDisplayYear] = useState<number | string>('...');

  useEffect(() => {
    setDisplayYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full text-center p-4 mt-auto">
      <p className="text-sm text-muted-foreground">
        &copy; {displayYear} Living Center Medellín. Todos los derechos reservados.
      </p>
    </footer>
  );
}
