// islands/home/Timer.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { TORNEO_CONFIG } from "@/utils/config.ts";

// --- INTERFACES ---
interface TimeState {
  dias: string;
  horas: string;
  minutos: string;
  segundos: string;
  etapa: "espera" | "en_curso" | "finalizado";
  labelDia: string;
}

interface TimeUnitProps {
  label: string;
  val: string;
  prev: string;
  sep?: boolean;
}

// --- LÓGICA DE CÁLCULO ---
const calculateState = (): TimeState => {
  const ahora = Date.now();
  const { fechaInicio, fechaFin, textos } = TORNEO_CONFIG;
  let diffMs = 0, etapa: TimeState["etapa"] = "espera", labelDia = "";

  if (ahora < fechaInicio) {
    diffMs = Math.max(0, fechaInicio - ahora);
    labelDia = textos.antes;
  } else if (ahora < fechaFin) {
    diffMs = Math.max(0, fechaFin - ahora);
    etapa = "en_curso";
    const nDia = Math.floor((ahora - fechaInicio) / 86400000) + 1;
    labelDia = diffMs <= 86400000 ? textos.ultimoDia : `Día ${nDia} del torneo`;
  } else {
    diffMs = 0;
    etapa = "finalizado";
    labelDia = textos.terminado;
  }

  const f = (n: number) => Math.floor(n).toString().padStart(2, "0");
  const totalSeg = Math.round(diffMs / 1000);

  return {
    dias: f(totalSeg / 86400),
    horas: f((totalSeg % 86400) / 3600),
    minutos: f((totalSeg % 3600) / 60),
    segundos: f(totalSeg % 60),
    etapa, labelDia,
  };
};

export default function Timer() {
  const [time, setTime] = useState<TimeState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prevTime = useRef<TimeState | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = calculateState();
      setTime((curr) => {
        if (!curr || next.segundos !== curr.segundos) {
          prevTime.current = curr || next;
          return next;
        }
        return curr;
      });
      setTimeout(() => setIsVisible(true), 100);
    };

    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, []);

  if (!time) return (
    <div className="h-44 w-full bg-Blanco/40 rounded-2xl animate-pulse" />
  );

  const containerClasses = `
    w-full bg-Blanco shadow-2xl rounded-2xl md:rounded-[1.5vw]
    px-4 pt-1 pb-6 md:px-8 md:pt-3 md:pb-8 transform origin-bottom
    transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]
    ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}
  `;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center w-full scale-[78%] sm:scale-90 md:scale-110 origin-center">
        <h3 className="gothamU text-Azul mb-2 text-center font-black uppercase tracking-tight text-[4.5vw] md:text-[2.9vw]">
          {time.labelDia}
        </h3>

        {/* Gap mínimo para ganar espacio horizontal */}
        <div className="flex items-center justify-center gap-[0.2vw]">
          <TimeUnit label="DÍAS" val={time.dias} prev={prevTime.current?.dias || time.dias} sep />
          <TimeUnit label="HORAS" val={time.horas} prev={prevTime.current?.horas || time.horas} sep />
          <TimeUnit label="MINUTOS" val={time.minutos} prev={prevTime.current?.minutos || time.minutos} sep />
          <TimeUnit label="SEGUNDOS" val={time.segundos} prev={prevTime.current?.segundos || time.segundos} />
        </div>

      </div>
    </div>
  );
}

function TimeUnit({ label, val, prev, sep }: TimeUnitProps) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-[0.3vw] md:gap-[0.3vw]">
          <div className="flex gap-[0.3vw]">
            <Digit cur={val[0]} old={prev[0]} />
            <Digit cur={val[1]} old={prev[1]} />
          </div>

          {sep && (
            <div className="flex flex-col gap-[1vw] opacity-30 px-[0.1vw]">
              <div className="h-[0.8vw] w-[0.8vw] min-h-0.75 min-w-0.75 rounded-full bg-Azul" />
              <div className="h-[0.8vw] w-[0.8vw] min-h-0.75 min-w-0.75 rounded-full bg-Azul" />
            </div>
          )}
        </div>

        <span className="raleway uppercase text-Azul/90 mt-2 font-bold text-[2.8vw] md:text-[0.9vw] tracking-tighter md:tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}

function Digit({ cur, old }: { cur: string; old: string }) {
  const isChanging = cur !== old;
  return (
    <div className="fcc-digit">
      <div className="fcc-section fcc-bottom"><span className="fcc-number">{cur}</span></div>
      <div className="fcc-section fcc-top"><span className="fcc-number">{cur}</span></div>
      {isChanging && (
        <>
          <div className="fcc-section fcc-bottom fcc-old"><span className="fcc-number">{old}</span></div>
          <div key={cur} className="fcc-leaf-container" style={{ animationDuration: '0.6s' }}>
            <div className="fcc-leaf-front"><span className="fcc-number">{old}</span></div>
            <div className="fcc-leaf-back"><span className="fcc-number">{cur}</span></div>
          </div>
        </>
      )}
      <div className="fcc-divider-line" />
    </div>
  );
}
