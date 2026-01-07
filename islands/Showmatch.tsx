import { useEffect, useState } from "preact/hooks";

export default function Showmatchs({ videoId }: { videoId: string }) {
  const [parent, setParent] = useState("");

  useEffect(() => {
    // Detectamos el dominio para evitar errores de conexión
    setParent(globalThis.location.hostname);
  }, []);

  // Mientras carga el dominio, mostramos un espacio vacío con la misma proporción
  if (!parent) return <div className="aspect-video w-[55vw] bg-white/5 animate-pulse rounded-[0.8vw]" />;

  return (
    <div className="animate-fade-in flex flex-col items-center">
      {/* SOLO EL VIDEO */}
      <div className="relative aspect-video w-[55vw] overflow-hidden rounded-[0.8vw] border border-white/10 bg-black shadow-2xl transition-all duration-500 hover:border-white/20">
        <iframe
          src={`https://player.twitch.tv/?video=${videoId}&parent=${parent}&autoplay=false`}
          height="100%"
          width="100%"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}