
"use client";

import type * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlayCircle, Trophy, AlertTriangle, SmilePlus, UserCheck, ListChecks, Eye, EyeOff } from 'lucide-react';
import { fetchVerifiedParticipantsForSorteo, type VerifiedParticipant } from './actions';
import AppFooter from '@/components/AppFooter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from 'next-intl';

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function SorteoPage() {
  const t = useTranslations('SorteoPage');
  const [expandedNameList, setExpandedNameList] = useState<string[]>([]);
  const [currentDisplayName, setCurrentDisplayName] = useState("...");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uniqueParticipantCount, setUniqueParticipantCount] = useState(0);
  const [showParticipantList, setShowParticipantList] = useState(false); 

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null); 
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadParticipants() {
      setIsLoading(true);
      setError(null);
      const result = await fetchVerifiedParticipantsForSorteo();
      if (result.success && result.participants) {
        if (result.participants.length === 0) {
          setError(t('noParticipantsError'));
          setExpandedNameList([]);
          setCurrentDisplayName(t('na'));
          setUniqueParticipantCount(0);
        } else {
          const names: string[] = [];
          const uniqueNames = new Set<string>();

          result.participants.forEach(p => {
            const fullName = `${p.nombre} ${p.apellidos}`;
            uniqueNames.add(fullName);
            for (let i = 0; i < p.stars; i++) {
              names.push(fullName);
            }
          });
          const shuffledNames = shuffleArray(names);
          setExpandedNameList(shuffledNames);
          setCurrentDisplayName("..."); 
          setUniqueParticipantCount(uniqueNames.size);
        }
      } else {
        setError(result.message || t('loadingError'));
        setCurrentDisplayName(t('error'));
        setUniqueParticipantCount(0);
      }
      setIsLoading(false);
    }
    loadParticipants();

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spinDurationBase = 3000; 
  const spinDurationRandom = 2000; 

  const handleSpin = () => {
    if (isSpinning || expandedNameList.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setCurrentDisplayName(t('spinning'));

    let currentIndex = 0;
    const startTime = Date.now();
    const totalSpinDuration = spinDurationBase + Math.random() * spinDurationRandom;

    function animate() {
      if (Date.now() - startTime < totalSpinDuration) {
        setCurrentDisplayName(expandedNameList[currentIndex % expandedNameList.length]);
        currentIndex++;
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        const randomIndex = Math.floor(Math.random() * expandedNameList.length);
        const finalWinner = expandedNameList[randomIndex];
        setWinner(finalWinner);
        setCurrentDisplayName(finalWinner);
        setIsSpinning(false);
      }
    }
    
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    setTimeout(() => {
        animationFrameIdRef.current = requestAnimationFrame(animate);
    }, 50); 
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">{t('loadingParticipants')}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12">
      <Card className="w-full max-w-2xl shadow-xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-md sm:text-lg text-muted-foreground pt-2">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {error && !isLoading && (
            <Alert variant="destructive" className="text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div 
            className="h-28 sm:h-36 flex items-center justify-center border-4 border-primary rounded-lg bg-secondary/30 p-4 transition-all duration-100 ease-in-out"
            aria-live="polite"
          >
            <span className="text-3xl sm:text-5xl font-bold text-accent truncate px-2">
              {currentDisplayName}
            </span>
          </div>

          <Button
            onClick={handleSpin}
            disabled={isSpinning || expandedNameList.length === 0 || isLoading || !!error}
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSpinning ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : winner ? (
              <PlayCircle className="mr-2 h-6 w-6" />
            ) : (
              <SmilePlus className="mr-2 h-6 w-6" />
            )}
            {isSpinning ? t('spinningButton') : winner ? t('spinAgainButton') : t('spinButton')}
          </Button>

          {winner && !isSpinning && (
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-400 rounded-lg shadow-md animate-in fade-in-50 zoom-in-90 duration-500">
              <div className="flex flex-col items-center">
                <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
                <p className="text-xl sm:text-2xl font-semibold text-green-700">{t('congratsWinner')}</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary mt-2">{winner}</p>
              </div>
            </div>
          )}
          
          {!error && !isLoading && expandedNameList.length > 0 && (
            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center">
                <UserCheck className="inline mr-2 h-5 w-5" />
                {t('totalUniqueParticipants', {count: uniqueParticipantCount})}
              </div>
              <div className="flex items-center justify-center">
                <ListChecks className="inline mr-2 h-5 w-5" />
                {t('totalEntries', {count: expandedNameList.length})}
              </div>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowParticipantList(!showParticipantList)}
                >
                  {showParticipantList ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showParticipantList ? t('hideListButton') : t('showListButton')}
                </Button>
              </div>
            </div>
          )}

          {showParticipantList && expandedNameList.length > 0 && (
            <Card className="mt-6 text-left">
              <CardHeader>
                <CardTitle className="text-lg">{t('listTitle')}</CardTitle>
                <CardDescription>{t('listDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60 w-full rounded-md border p-2">
                  <div className="p-2">
                    {expandedNameList.map((name, index) => (
                      <div key={index} className="text-sm py-0.5">
                        {index + 1}. {name}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <AppFooter />
    </main>
  );
}
