
"use client";

import RafflePageClientContent from '@/components/RafflePageClientContent';
import AppFooter from '@/components/AppFooter';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-6 sm:mb-8">
        {t('pageTitle')}
      </h1>
      
      <div className="mb-8 text-center w-full max-w-2xl">
        <div className="aspect-video w-full rounded-lg shadow-md overflow-hidden bg-black">
          <video
            src="/Videolivingcenter.mp4"
            controls
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
            data-ai-hint="meditation retreat center"
          >
            {t('videoUnsupported')}
          </video>
        </div>
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-lg md:text-xl text-foreground mb-4">
            <strong>{t('introTitle')}</strong>
          </p>
          <p className="text-base md:text-lg text-foreground mb-4">
            {t('introParagraph1')}
          </p>
          <p className="text-base md:text-lg text-foreground mb-6">
            {t('introParagraph2')} <span className="text-primary font-semibold">♧</span>.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            {t('introParagraph3')} <span role="img" aria-label="celebration food community meditation emojis">🎉🍽️🤝🧘‍♀️🧘‍♂️🏠</span>.
          </p>
          <div className="text-xs text-muted-foreground/80 border-t border-border pt-4 mt-6">
            <p className="mb-1"><span className="text-primary font-semibold">♧</span> {t('conditionsRaffleDate')}</p>
            <p className="mb-1"><span className="text-primary font-semibold">♧</span> {t('conditionsStayValidity')}</p>
            <p className="mb-1"><span className="text-primary font-semibold">♧</span> {t('conditionsCourseConflict')}</p>
            <p><span className="text-primary font-semibold">♧</span> {t('conditionsFood')}</p>
          </div>
        </div>
      </div>
      <RafflePageClientContent />
      <AppFooter />
    </main>
  );
}