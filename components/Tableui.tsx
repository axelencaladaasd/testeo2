// components/Tableui.tsx
import { memo } from "preact/compat";
import { type ComponentChildren } from "preact";

// --- 1. CONFIGURACIONES Y LÓGICA DE ESTILOS ---
export const TRADUCIR_RANGO: Record<string, string> = {
  DIAMOND: "DIAMANTE",
  EMERALD: "ESMERALDA",
  PLATINUM: "PLATINO",
  GOLD: "ORO",
  SILVER: "PLATA",
  BRONZE: "BRONCE",
  IRON: "HIERRO",
};

export const getWRStyles = (wrStr: string) => {
  const wr = parseFloat(wrStr);
  if (isNaN(wr)) return "text-Blanco/60";
  if (wr >= 61) return "text-Dorado ";
  if (wr >= 56) return "text-[#a2ffb3] ";
  if (wr >= 52) return "text-[#26de81] ";
  if (wr >= 49) return "text-[#d1d8e0] ";
  if (wr >= 45) return "text-[#fd9644] ";
  return;
};

// --- 2. OBJETO DE INTERFAZ (UI) Contendor  ---
export const UI = {
  wrapper: "w-full max-w-[80vw] mx-auto mb-[10vh] relative px-[2vw] py-[3vw] group bg-Negro/30 rounded-[2vw] backdrop-blur-xl border-[0.15vw] border-Dorado/40 shadow-2xl mt-[15vh] overflow-hidden select-none",
  tableCard: "overflow-x-auto rounded-[1.5vw] border border-Dorado/60 bg-Negro/70 relative z-10 mb-[2vw] backdrop-blur-md",
  nav: "flex items-center justify-between gap-[1vw] bg-Azul/40 p-[0.8vw] rounded-t-[1.2vw] border-x border-t border-Blanco/20",
  searchBar: (active: boolean) => `
    relative h-[3vw] transition-all duration-700 ease-in-out flex items-center
    bg-Azul/60 border border-Dorado/30 rounded-full overflow-hidden
    ${active ? "w-full pl-[3vw]" : "w-[3vw] focus-within:w-full focus-within:pl-[3vw]"}
    focus-within:border-Dorado focus-within:ring-1 focus-within:ring-Dorado/50
  `,
  btnIcon: (active: boolean) => `
    w-[3vw] h-[3vw] flex items-center justify-center rounded-full border transition-all
    ${active ? "bg-orange-500/20 border-orange-500 text-orange-400" : "bg-Azul/60 border-Blanco/20 text-Blanco/40"}
  `,
  btnBadge: (active: boolean, color: string) => `
    h-[3vw] px-[1.2vw] rounded-full border text-[0.8vw] transition-all
    ${active ? `${color} border-transparent` : "bg-Azul/60  border-Blanco/20"}
  `,
};

// --- 3. COMPONENTES VISUALES ---
export const Corner = memo(({ pos }: { pos: string }) => (
  <div className={`absolute ${pos} pointer-events-none p-[1.2vw] opacity-40 transition-all duration-700 group-hover:opacity-100`}>
    <div className={`border-Dorado h-[1.5vw] w-[1.5vw] ${pos.includes("top") ? "border-t-[0.2vw]" : "border-b-[0.2vw]"} ${pos.includes("right") ? "border-r-[0.2vw]" : "border-l-[0.2vw]"} rounded-[0.2vw] shadow-[0_0_1vw_#C4A052]`} />
  </div>
));

export const SearchIcon = () => (
  <svg width="1.2vw" height="1.2vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const BadgeEstado = memo(({ estado, canal }: { estado: string; canal: string }) => {
  const estaEnVivo = estado === "online" || estado === "EN VIVO";
  return (
    <a href={`https://twitch.tv/${canal}`} target="_blank" rel="noopener noreferrer" className="group/status inline-flex justify-center">
      {estaEnVivo ? (
        <div className="flex min-w-[5.5vw] animate-pulse items-center justify-center gap-[0.3vw] rounded-[0.2vw] border border-red-600 bg-red-600/20 px-[0.6vw] py-[0.25vw] text-[0.65vw] font-black text-Blanco italic shadow-[0_0_1vw_rgba(220,38,38,0.4)]">
          <div className="h-[0.4vw] w-[0.4vw] rounded-full bg-red-500 shadow-[0_0_0.3vw_#ff0000]" /> EN VIVO
        </div>
      ) : (
        <div className="flex min-w-[5.5vw] items-center justify-center gap-[0.3vw] rounded-[0.2vw] border border-Blanco/10 bg-Blanco/5 px-[0.6vw] py-[0.25vw] text-[0.65vw] font-bold text-Blanco/40 transition-all group-hover/status:border-Blanco/30 group-hover/status:text-Blanco/60">
          OFFLINE
        </div>
      )}
    </a>
  );
});

export const Th = ({ children, className = "" }: { children?: ComponentChildren; className?: string }) => (
  <th className={`text-Dorado gotham border-b border-Blanco/10 py-[1.2vw] text-[0.7vw] font-bold tracking-widest uppercase ${className}`}>
    {children}
  </th>
);
