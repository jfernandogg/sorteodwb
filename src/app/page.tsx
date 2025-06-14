import RafflePageClientContent from '@/components/RafflePageClientContent';
import AppFooter from '@/components/AppFooter';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12">
      <div className="mb-8 text-center"> {/* Container for image and new text */}
        <Image 
            src="https://placehold.co/300x150.png" 
            alt="Living Center Medellín Rifa" 
            width={300} 
            height={150}
            data-ai-hint="spiritual center logo"
            className="mx-auto rounded-lg shadow-md"
        />
        {/* Explanatory Text Block */}
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-base md:text-lg text-foreground mb-4">
            ¿Cómo puedes unirte? Estaremos rifando 5 días sucesivos de estadía en nuestro nuevo Living Center Medellín en habitación con baño privado <span className="text-primary font-semibold">♧</span>
          </p>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Te invitamos a pasar unos días en la ciudad de la eterna primavera para meditar, compartir con nuestra Sangha y por supuesto, comer juntos <span role="img" aria-label="food party meditation emojis">😄🍽💃🕺🧘‍♀🧘🏻🏠</span>. 
          </p>
          <div className="text-xs text-muted-foreground/80 border-t border-border pt-4 mt-6">
            <p className="mb-1"><span className="text-primary font-semibold">♧</span> Válido para el 2025.</p>
            <p className="mb-1">Si los días escogidos coinciden con curso, no podremos garantizar habitación privada.</p>
            <p>No incluye alimentación.</p>
          </div>
        </div>
      </div>
      <RafflePageClientContent />
      <AppFooter />
    </main>
  );
}
