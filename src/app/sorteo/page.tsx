
"use client";

import type * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlayCircle, Trophy, Users, AlertTriangle, SmilePlus } from 'lucide-react';
import { fetchVerifiedParticipantsForSorteo, type VerifiedParticipant } from './actions';
import AppFooter from '@/components/AppFooter';

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
  const [expandedNameList, setExpandedNameList] = useState<string[]>([]);
  // currentDisplayIndex is not directly used for display, but for logic inside spin
  // const [currentDisplayIndex, setCurrentDisplayIndex] = useState(0); 
  const [currentDisplayName, setCurrentDisplayName] = useState("...");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null); // Kept if other interval logic is added later
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadParticipants() {
      setIsLoading(true);
      setError(null);
      const result = await fetchVerifiedParticipantsForSorteo();
      if (result.success && result.participants) {
        if (result.participants.length === 0) {
          setError("No hay participantes verificados para realizar el sorteo.");
          setExpandedNameList([]);
          setCurrentDisplayName("N/A");
        } else {
          const names: string[] = [];
          result.participants.forEach(p => {
            const fullName = `${p.nombre} ${p.apellidos}`;
            for (let i = 0; i < p.stars; i++) {
              names.push(fullName);
            }
          });
          const shuffledNames = shuffleArray(names);
          setExpandedNameList(shuffledNames);
          setCurrentDisplayName(shuffledNames[0] || "¡Listo!");
        }
      } else {
        setError(result.message || "Error cargando participantes.");
        setCurrentDisplayName("Error");
      }
      setIsLoading(false);
    }
    loadParticipants();

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  const spinDurationBase = 3000; // 3 seconds base
  const spinDurationRandom = 2000; // up to 2 additional random seconds

  const handleSpin = () => {
    if (isSpinning || expandedNameList.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setCurrentDisplayName("Girando..."); // Set to "Girando..." immediately

    let currentIndex = 0;
    const startTime = Date.now();
    const totalSpinDuration = spinDurationBase + Math.random() * spinDurationRandom;

    function animate() {
      if (Date.now() - startTime < totalSpinDuration) {
        setCurrentDisplayName(expandedNameList[currentIndex % expandedNameList.length]);
        currentIndex++;
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Stop spinning and select winner
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        const randomIndex = Math.floor(Math.random() * expandedNameList.length);
        const finalWinner = expandedNameList[randomIndex];
        setWinner(finalWinner);
        setCurrentDisplayName(finalWinner);
        setIsSpinning(false);
      }
    }
    
    // Give a brief moment for "Girando..." to render before starting the fast animation.
    // Also, cancel any pre-existing animation frame.
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    setTimeout(() => {
        animationFrameIdRef.current = requestAnimationFrame(animate);
    }, 50); // 50ms delay, adjust as needed
  };


  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando participantes...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12">
      <Card className="w-full max-w-2xl shadow-xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
            ¡Sorteo Rifa Solidaria!
          </CardTitle>
          <CardDescription className="text-md sm:text-lg text-muted-foreground pt-2">
            Presiona el botón para iniciar el sorteo y descubrir al ganador. ¡Mucha suerte a todos!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {error && !isLoading && (
            <Alert variant="destructive" className="text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
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
            {isSpinning ? 'Sorteando...' : winner ? 'Sortear de Nuevo' : '¡Realizar Sorteo!'}
          </Button>

          {winner && !isSpinning && (
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-400 rounded-lg shadow-md animate-in fade-in-50 zoom-in-90 duration-500">
              <div className="flex flex-col items-center">
                <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
                <p className="text-xl sm:text-2xl font-semibold text-green-700">¡Felicidades al Ganador!</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary mt-2">{winner}</p>
              </div>
            </div>
          )}
          
          {!error && !isLoading && expandedNameList.length > 0 && (
            <div className="pt-4 text-sm text-muted-foreground">
              <Users className="inline mr-2 h-5 w-5" />
              Total de participaciones en el sorteo: {expandedNameList.length}
            </div>
          )}
        </CardContent>
      </Card>
      <AppFooter />
    </main>
  );
}
