import { TORNEO_CONFIG } from "@/utils/config.ts";

// --- CONFIGURACIÓN DE CONTENIDO ---
const GATE_CONTENT: Record<string, { title: string; subtitle: string }> = {
  clasificacion: {
    title: "CLASIFICACIÓN",
    subtitle: "Tabla de posiciones y estadísticas",
  },
  showmatch: {
    title: "SHOWMATCH",
    subtitle: "Partidas de Exhibición de la comunidad",
  },
  streams: {
    title: "STREAMS",
    subtitle: "Transmisiones en vivo",
  },
};

export default function Gate({
  type,
}: {
  type: "clasificacion" | "showmatch" | "streams";
}) {
  const { title, subtitle } = GATE_CONTENT[type] || GATE_CONTENT.showmatch;

  // --- PROCESAMIENTO DE FECHAS ---
  const fecha = new Date(TORNEO_CONFIG.fechaInicio);
    const diaMes = fecha
      .toLocaleDateString("es-AR", { day: "numeric", month: "long" })
      .toUpperCase();
    const hora = fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
  // --- SUB-COMPONENTE: ESQUINAS DECORATIVAS ---
  const Corner = ({ pos }: { pos: string }) => {
    const isTop = pos.includes("top");
    const isRight = pos.includes("right");

    return (
      <div className={`absolute ${pos} p-[1.2vw] opacity-20
        transition-opacity group-hover:opacity-50`}>
        <div className={`
          border-Dorado h-[1vw] w-[1vw]
          ${isTop ? "border-t-[0.15vw]" : "border-b-[0.15vw]"}
          ${isRight ? "border-r-[0.15vw]" : "border-l-[0.15vw]"}
          ${isRight ? "rounded-tr-[0.2vw]" : "rounded-bl-[0.2vw]"}
        `} />
      </div>
    );
  };

  return (
    <section className={`
      bg-Azul/80 border-Dorado/30 animate-fade-in group relative
      w-full max-w-[45vw] overflow-hidden rounded-[1.4vw]
      border-[0.15vw] p-[2.8vw] text-center backdrop-blur-md
      shadow-[0_2vw_5vw_-1vw_rgba(0,0,0,0.8)]
    `}>
      {/* Efecto de luz ambiental (Glow) */}
      <div className={`
        bg-Dorado/5 group-hover:bg-Dorado/10 pointer-events-none
        absolute -top-[10vw] -left-[10vw] h-[25vw] w-[25vw]
        rounded-full blur-[6vw] transition-colors duration-700
      `} />

      {/* Título Principal */}
      <h1 className={`
        gothamU text-Dorado mb-[0.5vw] text-[2.8vw] leading-none
        font-black tracking-tighter italic
      `}>
        {title}
      </h1>

      {/* Divisor Animado */}
      <div className={`
        bg-Dorado mx-auto mb-[1.5vw] h-[0.2vw] w-[5vw] opacity-60
        transition-all duration-500 group-hover:w-[10vw]
      `} />

      {/* Descripción del Portal */}
      <p className={`
        raleway text-Blanco/70 mb-[2.5vw] px-[2vw] text-[1.1vw]
        font-medium italic
      `}>
        "{subtitle}"
      </p>

      {/* Bloque de Información de Fecha */}
      <footer className={`
        border-Blanco/10 group-hover:border-Dorado/20 relative
        overflow-hidden rounded-[1.2vw] border-[0.1vw] bg-black/40
        px-[2vw] py-[1.8vw] transition-colors
      `}>
        <p className={`
          gothamM text-Blanco/30 mb-[1vw] text-[0.7vw]
          font-bold tracking-[0.5em]
        `}>
          FECHA DE INICIO
        </p>

        <div className="flex items-center justify-center gap-[0.8vw]">
          <time className={`
            gotham text-Blanco text-[1.5vw] font-black
            tracking-tighter italic
          `}>
            {diaMes} <span className="text-Dorado">/</span> {hora}
          </time>

          {/* Icono de Bandera */}
          <div className={`
            w-[2vw] translate-y-[-0.1vw]
            drop-shadow-[0_0_0.3vw_rgba(116,172,223,0.4)]
          `}>
            <svg viewBox="0 0 768 480" className="h-auto w-full rounded-[0.1vw]">
              <path fill="#74acdf" d="M0 0h768v160H0z" />
              <path fill="#fff" d="M0 160h768v160H0z" />
              <path fill="#74acdf" d="M0 320h768v160H0z" />
              <circle fill="#f6b433" cx="384" cy="240" r="34" />
              <g fill="#f6b433">
                <path d="M384 193l6 31h-12zM384 287l6-31h-12zM431 240l-31 6v-12zM337 240l31 6v-12z" />
              </g>
            </svg>
          </div>
        </div>
      </footer>

      {/* Elementos Decorativos Esquinas */}
      <Corner pos="top-0 right-0" />
      <Corner pos="bottom-0 left-0" />
    </section>
  );
}
