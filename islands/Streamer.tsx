import { StreamTwitch, Jugador } from "../routes/_middleware.ts";
import { Corner, UI } from "@/components/Tableui.tsx";

interface Props {
  vivos: StreamTwitch[];
  jugadores: Jugador[];
}

const ANIMATIONS = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
`;

const ViewersIcon = () => (
  <svg width="1vw" height="1vw" viewBox="0 0 24 24" fill="currentColor" className="text-Dorado/80">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

function Card({ user, title, viewers, thumb, index }: { user: string; title: string; viewers: number; thumb: string; index: number }) {
  return (
    <div
      className="group/card animate-fade-in-up relative"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <div className="relative overflow-hidden rounded-[1vw] border border-Blanco/10 bg-Azul/20 transition-all duration-500 hover:border-Dorado/60 hover:bg-Azul/30 shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <img src={thumb} alt={user} className="h-full w-full object-cover opacity-90 transition-transform duration-1000 group-hover/card:scale-110" />

          {/* Badge EN VIVO */}
          <div className="absolute top-[0.6vw] left-[0.6vw] z-20 flex animate-pulse items-center gap-[0.3vw] rounded-[0.2vw] border border-red-600 bg-red-600/20 px-[0.5vw] py-[0.15vw]">
            <div className="h-[0.35vw] w-[0.35vw] rounded-full bg-red-500 shadow-[0_0_0.3vw_#ff0000]" />
            <span className="text-[0.55vw] font-black text-Blanco">EN VIVO</span>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-Azul/80 via-transparent to-transparent opacity-90" />
        </div>

        <div className="flex flex-col gap-[0.1vw] px-[1vw] py-[0.7vw]">
          <div className="flex items-center justify-between gap-[0.5vw]">
            <span className="raleway text-Blanco text-[1.1vw] font-bold uppercase transition-all group-hover/card:text-Dorado truncate">
              {user}
            </span>

            <div className="flex items-center gap-[0.4vw] text-Blanco shrink-0">
               <ViewersIcon />
               <span className="raleway text-[1.1vw] font-black leading-none tabular-nums">
                 {viewers.toLocaleString()}
               </span>
            </div>
          </div>

          <p className="raleway truncate text-[0.7vw] font-medium tracking-wide text-Blanco/30 uppercase leading-tight">
            {title}
          </p>
        </div>
        <a href={`https://www.twitch.tv/${user}`} target="_blank" className="absolute inset-0 z-30" />
      </div>
    </div>
  );
}

export default function Streamers({ vivos = [], jugadores = [] }: Props) {
  // Suma total de viewers de todos los streams activos
  const totalViewers = vivos.reduce((acc, curr) => acc + curr.viewer_count, 0);

  return (
    <div className={`group ${UI.wrapper}`}>
      <style>{ANIMATIONS}</style>

      <div className="bg-Azul/20 pointer-events-none absolute top-0 left-0 h-full w-full blur-[12vw]" />

      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
        <Corner key={pos} pos={pos} />
      ))}

      <header className="relative z-10 mb-[2.5vw] text-center">
        <h1 className="gothamU text-[3.8vw] tracking-tighter text-Blanco uppercase">
          STREAMS EN VIVO
        </h1>
        {/* Animación de la línea: crece de 10vw a 25vw al hacer hover en el componente */}
        <div className="mx-auto mt-[0.5vw] h-[0.15vw] w-[10vw] bg-linear-to-r from-transparent via-Blanco to-transparent opacity-40 transition-all duration-700 group-hover:w-[25vw]" />
      </header>

      <div className={UI.tableCard}>
        <div className="flex flex-col p-[0.2vw]">

          {/* Nav con contador de personas viendo el evento */}
          <div className="bg-Azul/40 p-[1vw] rounded-t-[1.2vw] border-x border-t border-Blanco/20">
             <div className="h-[1.5vw] flex items-center justify-between">
                <span className="gotham text-Blanco text-[0.9vw] font-bold tracking-[0.3em] uppercase opacity-60">
                  Personas viendo el evento
                </span>
                <div className="flex items-center gap-[0.5vw] tracking-widest  bg-Azul/20 px-[0.8vw] py-[0.2vw] rounded-full border border-Blanco/5">
                  <div className="h-[0.4vw] w-[0.4vw] rounded-full bg-red-500 animate-pulse" />
                  <span className="raleway text-Blanco text-[1vw] font-black tabular-nums">
                    {totalViewers.toLocaleString()}
                  </span>
                </div>
             </div>
          </div>

          <div className="bg-Azul/20 overflow-hidden rounded-b-[1.2vw] border-x border-b border-Blanco/10 p-[2vw] min-h-[40vh]">
            {vivos.length === 0 ? (
              <div className="py-[10vw] text-center font-bold tracking-widest text-Blanco/20 uppercase raleway italic">
                Sin transmisiones detectadas
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-[1.5vw] md:grid-cols-2 lg:grid-cols-3 relative z-10">
                {vivos.map((s, idx) => {
                  const j = jugadores.find(jug => jug.canal?.toLowerCase().trim() === s.user_login.toLowerCase());
                  return (
                    <Card
                      key={s.user_login}
                      index={idx}
                      user={j ? j.jugador : s.user_name}
                      title={s.title}
                      viewers={s.viewer_count}
                      thumb={s.thumbnail_url.replace("{width}", "800").replace("{height}", "450")}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}