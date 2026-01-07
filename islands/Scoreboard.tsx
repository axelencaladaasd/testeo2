// ScoreboardIsland.tsx
import { memo } from "preact/compat";
import { Jugador } from "@/routes/_middleware.ts";
import { useScoreboard } from "@/utils/useScoreboard.ts";
import {
  Corner,
  BadgeEstado,
  Th,
  SearchIcon,
  TRADUCIR_RANGO,
  getWRStyles,
  UI,
} from "@/components/Tableui.tsx";

interface ScoreboardProps {
  jugadoresIniciales: Jugador[];
  isFinished: boolean;
}

const ROLES = ["TOP", "JUNGLA", "MID", "ADC", "SUPPORT"];

const PlayerRow = memo(
  ({
    p,
    index,
    isFinished,
  }: {
    p: Jugador;
    index: number;
    isFinished: boolean;
  }) => {
    return (
      <tr
        className="group/row hover:bg-Azul/30 animate-fade-in-up border-b border-Blanco/10 transition-all duration-300 last:border-0 hover:translate-x-1"
        style={{
          animationDelay: `${index * 30}ms`,
          animationFillMode: "both",
        }}
      >
        {/* POSICIÓN */}
        <td className="gotham w-[6vw] py-[0.8vw] pl-[1.5vw] text-left font-bold">
          <div className="flex items-center gap-[0.5vw]">
            <div
              className="flex min-w-[1vw] flex-col items-center"
              role="img"
              aria-label={`Cambio de posición: ${p.cambioPos}`}
            >
              {p.cambioPos !== 0 ? (
                <>
                  <span className={`text-[0.97vw] leading-none font-black ${p.cambioPos > 0 ? "text-green-400" : "text-red-500"}`} aria-hidden="true">
                    {p.cambioPos > 0 ? "▲" : "▼"}
                  </span>
                  <span className={`text-[0.97vw] leading-none font-bold ${p.cambioPos > 0 ? "text-green-400/70" : "text-red-500/70"}`}>
                    {Math.abs(p.cambioPos)}
                  </span>
                </>
              ) : (
                <span className="text-[0.6vw] font-black text-Blanco/10" aria-hidden="true">—</span>
              )}
            </div>
            <span className="text-Blanco ml-[0.2vw] text-[1.2vw] leading-none">
              {String(p.posición || index + 1).padStart(2, "0")}
            </span>
          </div>
        </td>

        {/* JUGADOR */}
        <td className="w-[16%] truncate px-[0.5vw]">
          <span className="text-[1vw] text-Blanco/90 transition-all duration-700 group-hover/row:text-Dorado/70">
            {p.jugador}
          </span>
        </td>

        {/* CUENTA */}
        <td className="w-[20%] overflow-hidden px-[1vw]">
          <div className="flex items-baseline gap-[0.3vw]">
            <span className="truncate text-[1vw] text-Blanco/90">
              {p.invocador}
            </span>
            <span className="text-Dorado shrink-0 text-[1vw]">
              #{p.tag}
            </span>
          </div>
        </td>

        {/* ROL */}
        <td className="w-[5vw] py-[0.8vw] text-center">
          <img
            src={`/img/${p.rol.toLowerCase()}.svg`}
            className="mx-auto h-[1.5vw] w-[1.5vw] opacity-80 brightness-0 invert"
            alt={`Rol ${p.rol}`}
            draggable={false}
          />
        </td>

        {/* W/L */}
      <td className="w-[7vw] py-[0.8vw] text-center">
        <div
          className="gotham flex items-center justify-center gap-[0.4vw] text-[0.85vw] font-bold"
          role="group"
          aria-label={`${p.victorias} victorias y ${p.derrotas} derrotas`}
        >
          <span className="text-green-400" aria-hidden="true">{p.victorias}V</span>
          <span className="text-Blanco/20" aria-hidden="true">|</span>
          <span className="text-red-400" aria-hidden="true">{p.derrotas}D</span>
        </div>
      </td>

        {!isFinished && (
          <td className="w-[8vw] py-[0.8vw] text-center">
            <BadgeEstado estado={p.estado} canal={p.canal} />
          </td>
        )}

        {/* WINRATE */}
        <td className={`gotham w-[5vw] py-[0.8vw] text-center text-[1vw] ${getWRStyles(p.winrate)}`} aria-label={`Winrate: ${p.winrate}`}>
          {p.winrate}
        </td>

        {/* RANGO */}
        <td className="w-[11vw] py-[0.9vw] text-center">
          <div className="flex flex-col items-center">
            <img
              src={`/img/${p.rango.toLowerCase()}.webp`}
              className="h-[2.2vw] w-[2.2vw] object-contain"
              alt={`Rango ${p.rango}`}
              draggable={false}
            />
            <div className="gotham mt-1 text-[0.8vw] leading-none text-Blanco/50 uppercase">
              {TRADUCIR_RANGO[p.rango.toUpperCase()] || p.rango} {p.division}
            </div>
          </div>
        </td>

        {/* LP */}
        <td className="raleway w-[6vw] py-[0.8vw] text-center text-[1.1vw] font-black text-Blanco">
          {p.LP}
        </td>

        {/* OP.GG */}
        <td className="w-[4vw] py-[0.8vw] text-center">
          <a
            href={`https://op.gg/es/lol/summoners/${p.region}/${encodeURIComponent(p.invocador)}-${p.tag}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-[2vw] transition-transform hover:scale-125"
            aria-label={`Ver perfil de ${p.jugador} en OP.GG`}
          >
            <img src="/img/opgg.svg" alt="Icono OP.GG" className="w-full opacity-70 hover:opacity-100" draggable={false} />
          </a>
        </td>
      </tr>
    );
  },
);

export default function Scoreboard({ jugadoresIniciales, isFinished }: ScoreboardProps) {
  const {
    busqueda,
    setBusqueda,
    filtroRol,
    setFiltroRol,
    filtrados,
    inputRef,
    rolesExpandido,
    toggleRoles,
    resetFiltros,
    criterioOrden,
    setCriterioOrden,
  } = useScoreboard(jugadoresIniciales);

  return (
    <div className={`${UI.wrapper} ${isFinished ? "border-Dorado shadow-[0_0_3vw_rgba(196,160,82,0.3)]" : "border-Dorado/40"}`}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
      `}</style>

      <div className="bg-Azul/20 pointer-events-none absolute top-0 left-0 h-full w-full blur-[12vw]" aria-hidden="true" />

      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
        <Corner key={pos} pos={pos} />
      ))}

      <header className="relative z-10 mb-[2.5vw] text-center">
        <h1 className="gothamU text-[3.8vw] tracking-tighter uppercase text-Blanco">
          {isFinished ? "Cuadro de Honor" : "Tabla de Clasificación"} <span className="text-Dorado">BTQ</span>
        </h1>
        <div className="mx-auto mt-[0.5vw] h-[0.15vw] w-[10vw] bg-linear-to-r from-transparent via-Blanco to-transparent opacity-40 transition-all duration-1000 group-hover:w-[25vw]" aria-hidden="true" />
      </header>

      <div className={UI.tableCard}>
        <div className="flex min-w-250 flex-col p-[0.2vw]">
          <nav className={UI.nav} aria-label="Filtros de tabla">
            {/* BUSCADOR */}
            <div className="relative flex flex-1 items-center justify-center">
              <div className={UI.searchBar(!!busqueda)}>
                <label htmlFor="search-player" className="sr-only">Buscar jugador</label>
                <input
                  id="search-player"
                  ref={inputRef}
                  type="text"
                  placeholder="BUSCAR JUGADOR.. (/)"
                  className={`peer raleway z-10 h-full w-full bg-transparent pr-[1vw] text-[1vw] text-Blanco outline-none placeholder:text-Blanco/20 ${busqueda ? "opacity-100" : "opacity-0 focus:opacity-100"}`}
                  value={busqueda}
                  onInput={(e) => setBusqueda(e.currentTarget.value)}
                />
                <div className={`pointer-events-none absolute flex items-center justify-center transition-all duration-500 ${busqueda ? "text-Dorado left-[0.8vw] scale-110" : "peer-focus:text-Dorado right-0 left-0 mx-auto text-Blanco/40 peer-focus:right-auto peer-focus:left-[0.8vw] peer-focus:mx-0"}`}>
                  <div className="h-[1.2vw] w-[1.2vw]"><SearchIcon /></div>
                </div>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="relative z-20 flex shrink-0 items-center gap-[0.8vw]">
              {/* SELECTOR DE ROLES */}
              <div className={`bg-Azul/60 relative flex h-[3vw] items-center rounded-full border transition-all duration-500 ${rolesExpandido ? "border-Dorado w-[22vw] px-[0.5vw]" : "w-[3vw] justify-center border-Blanco/20"}`}>
                <button
                  type="button"
                  onClick={toggleRoles}
                  className="absolute left-0 z-10 flex h-[3vw] w-[3vw] items-center justify-center"
                  aria-label={rolesExpandido ? "Cerrar menú de roles" : "Filtrar por rol"}
                >
                  {rolesExpandido ? (
                    <span className="text-Dorado text-[1.2vw]" aria-hidden="true">✕</span>
                  ) : (
                    <img
                      src={`/img/${filtroRol === "TODOS" ? "all" : filtroRol.toLowerCase()}.svg`}
                      className="h-[1.4vw] w-[1.4vw] brightness-0 invert"
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                </button>
                <div className={`ml-[2.5vw] flex w-full items-center justify-around ${rolesExpandido ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!rolesExpandido}>
                  {["TODOS", ...ROLES].map((rol) => (
                    <button
                      key={rol}
                      type="button"
                      onClick={() => { setFiltroRol(rol); if(rolesExpandido) toggleRoles(); }}
                      className={`transition-all hover:scale-125 ${filtroRol === rol ? "opacity-100" : "opacity-40"}`}
                      aria-label={`Filtrar por ${rol}`}
                    >
                      <img
                        src={`/img/${rol === "TODOS" ? "all" : rol.toLowerCase()}.svg`}
                        className="h-[1.4vw] w-[1.4vw] brightness-0 invert"
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTÓN ORDEN WR */}
              <button
                type="button"
                onClick={() => setCriterioOrden(criterioOrden === "WR" ? "DEFAULT" : "WR")}
                className={UI.btnBadge(criterioOrden === "WR", "bg-Dorado text-Azul")}
                aria-label={criterioOrden === "WR" ? "Quitar orden por Winrate" : "Ordenar por Winrate"}
              >
                WR
              </button>

              {/* RESET */}
              <button
                type="button"
                onClick={resetFiltros}
                className="bg-Azul/60 text-Dorado text-[1.5vw] flex h-[3vw] w-[3vw] items-center justify-center rounded-full border border-Blanco/20 transition-all duration-500 hover:rotate-180"
                aria-label="Restablecer filtros"
              >
                <span aria-hidden="true">↺</span>
              </button>
            </div>
          </nav>

          <div className="bg-Azul/20 overflow-hidden rounded-b-[1.2vw] border-x border-b border-Blanco/10">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-Azul/50 text-Dorado">
                  <Th className="w-[6vw] pl-[3.5vw] text-left">#</Th>
                  <Th className="w-[16%] px-[1vw] text-left">Jugador</Th>
                  <Th className="w-[20%] px-[1vw] text-left">Cuenta</Th>
                  <Th className="w-[5vw] text-center">Rol</Th>
                  <Th className="w-[7vw] text-center">W / L</Th>
                  {!isFinished && <Th className="w-[8vw] text-center">Estado</Th>}
                  <Th className="w-[6vw] text-center">WR</Th>
                  <Th className="w-[7vw] text-center">Rango</Th>
                  <Th className="w-[4vw] text-center">LP</Th>
                  <Th className="w-[4vw] text-center" aria-label="Acciones"></Th>
                </tr>
              </thead>
              <tbody className="raleway font-medium text-Blanco">
                {filtrados.length > 0 ? (
                  filtrados.map((p, idx) => (
                    <PlayerRow key={`${p.invocador}-${p.tag}`} p={p} index={idx} isFinished={isFinished} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={isFinished ? 9 : 10} className="py-[10vw] text-center font-bold tracking-widest text-Blanco/40 uppercase">
                      Sin resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}