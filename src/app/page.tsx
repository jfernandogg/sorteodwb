import RafflePageClientContent from '@/components/RafflePageClientContent';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12">
      <div className="mb-8 text-center">
        <Image 
            src="https://placehold.co/300x150.png" // Placeholder for a logo or relevant image
            alt="Living Center Medellín Rifa" 
            width={300} 
            height={150}
            data-ai-hint="spiritual center logo"
            className="mx-auto rounded-lg shadow-md"
        />
      </div>
      <RafflePageClientContent />
      <footer className="w-full text-center p-4 mt-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Living Center Medellín. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
