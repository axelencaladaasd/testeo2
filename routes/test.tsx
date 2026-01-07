import { type Context } from "@fresh/core";
import ScoreboardIsland from "@/islands/Scoreboard.tsx";
import { type MyState, type Jugador } from "@/routes/_middleware.ts";

export default function ScoreboardPage(_ctx: Context<MyState>) {
  // 1. SIMULACIÓN DE TWITCH
  // Nota: Twitch siempre devuelve los logins en minúsculas
  const STREAMS_VIVOS_LOL = ["zuhwei"];

  const jugadoresRaw: Jugador[] = [
    {
      posición: 1,
      jugador: "",
      invocador: "",
      tag: "LAS",
      rol: "MID",
      region: "LAS",
      victorias: 10,
      derrotas: 5,
      racha: 2,
      cambioPos: 0,
      winrate: "66%",
      rango: "CHALLENGER",
      division: "I",
      LP: 500,
      canal: "",
    },
    {
      posición: 2,
      jugador: "",
      invocador: "",
      tag: "VAL",
      rol: "SUPPORT",
      region: "LAS",
      victorias: 5,
      derrotas: 10,
      racha: -2,
      cambioPos: 0,
      winrate: "33%",
      rango: "DIAMOND",
      division: "IV",
      LP: 20,
      canal: "",
    }
  ] as Jugador[];

  // 2. LOGICA DE COORDINACIÓN CON DEBUG
  const jugadores = jugadoresRaw.map((j) => {
    const canalLimpio = j.canal?.toLowerCase().trim() || "";
    const estaVivo = STREAMS_VIVOS_LOL.includes(canalLimpio);

    // ESTO APARECERÁ EN TU TERMINAL DONDE CORRES DENO
    console.log(`[DEBUG] Buscando: "${canalLimpio}" en lista vivos. Resultado: ${estaVivo}`);

    return {
      ...j,
      estado: estaVivo ? "EN VIVO" : "OFFLINE",
    };
  });

  return (
    <div className="bg-Azul flex min-h-screen w-full flex-col items-center px-[2vw] pt-[12vh] pb-[5vh]">
      <main className="w-full max-w-[95vw]">
        <ScoreboardIsland jugadoresIniciales={jugadores} isFinished={false} />
      </main>
    </div>
  );
}