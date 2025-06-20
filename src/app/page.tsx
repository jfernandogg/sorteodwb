
import RafflePageClientContent from '@/components/RafflePageClientContent';
import AppFooter from '@/components/AppFooter';
// Removed Image from 'next/image' as it's not used for the video directly here

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12">
      {/* Title Added Here */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-6 sm:mb-8">
        Participa para Ganar una Estadía en el Living Center Medellin por 7 días !!!
      </h1>
      
      <div className="mb-8 text-center w-full max-w-2xl"> {/* Container for video and new text */}
        <div className="aspect-video w-full rounded-lg shadow-md overflow-hidden bg-black">
          <video
            src="/Videolivingcenter.mp4"
            controls
            className="w-full h-full object-contain"
            preload="metadata" // Helps load video dimensions and first frame quicker
            playsInline // Important for iOS to play inline
            data-ai-hint="meditation retreat center"
          >
            Tu navegador no soporta la etiqueta de video.
          </video>
        </div>
        {/* Explanatory Text Block Updated */}
        <div className="mt-6 max-w-xl mx-auto text-center">
          <p className="text-lg md:text-xl text-foreground mb-4">
            <strong>¡Ayúdanos a amoblar nuestro nuevo Living Center Medellín y participa por una estadía increíble!</strong>
          </p>
          <p className="text-base md:text-lg text-foreground mb-4">
            Con tu valiosa participación en esta rifa solidaria, podremos adquirir el <strong>comedor</strong> para nuestro centro. Este será un espacio vital para compartir alimentos, enseñanzas y momentos preciosos con nuestra Sangha.
          </p>
          <p className="text-base md:text-lg text-foreground mb-6">
            Como agradecimiento, sortearemos una estadía de <strong>7 días consecutivos</strong> en nuestro nuevo Living Center Medellín, en una cómoda habitación con baño privado y escritorio <span className="text-primary font-semibold">♧</span>.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Te invitamos a vivir la experiencia de la eterna primavera, meditar, y conectar con los amigos de la Sangha local en este espacio que estamos construyendo juntos <span role="img" aria-label="celebration food community meditation emojis">🎉🍽️🤝🧘‍♀️🧘‍♂️🏠</span>.
          </p>
          <div className="text-xs text-muted-foreground/80 border-t border-border pt-4 mt-6">
            <p className="mb-1"><span className="text-primary font-semibold">♧</span> Estadía válida durante todo el año 2025.</p>
            <p className="mb-1"><span className="text-primary font-semibold">♧</span> Si los días escogidos coinciden con un curso programado, es posible que la habitación privada no esté garantizada (se ofrecerá la mejor alternativa disponible).</p>
            <p><span className="text-primary font-semibold">♧</span> La estadía no incluye alimentación.</p>
          </div>
        </div>
      </div>
      <RafflePageClientContent />
      <AppFooter />
    </main>
  );
}

