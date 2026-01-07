// routes/clasificacion.tsx
import { Head } from "fresh/runtime";
import { PageProps } from "@fresh/core";
import { TORNEO_CONFIG } from "@/utils/config.ts";
import { type MyState } from "@/routes/_middleware.ts";
import Gate from "@/components/Gate.tsx";
import Scoreboard from "@/islands/Scoreboard.tsx";

export default function Clasificacion({ state }: PageProps<unknown, MyState>) {
  const ahora = Date.now();
  const { fechaInicio, fechaFin } = TORNEO_CONFIG;
  const isBefore = ahora < fechaInicio;
  const isFinished = ahora >= fechaFin;
  const isLive = ahora >= fechaInicio && ahora < fechaFin;
  const jugadores = state.jugadores ?? [];

  return (
    <>
      <Head>
        <title>BTOQ | Clasificación</title>
        <meta name="description"
        content="Consulta la tabla de posiciones del BTOQ 2026." />
      </Head>
      <div className="bg-Azul relative min-h-screen overflow-hidden">
        {/* CASO A: Antes del torneo - Ocupa TODO el alto de la pantalla */}
        {isBefore && (
          <section className="flex h-screen w-full items-center justify-center">
            <Gate type="clasificacion" />
          </section>
        )}

        {/* CASO B: Durante o Finalizado */}
        {(isLive || isFinished) && (
          <main className="animate-fade-in relative z-10 flex w-full flex-col items-center px-[2vw] pt-[12vh] pb-[10vh]">
            <div className="w-full max-w-[95vw]">
              <Scoreboard
                jugadoresIniciales={jugadores}
                isFinished={isFinished}
              />
            </div>
          </main>
        )}
      </div>
    </>
  );
}
