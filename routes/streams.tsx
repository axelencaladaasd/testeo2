// routes/streams.tsx
import { Head } from "fresh/runtime";
import { PageProps } from "@fresh/core";
import { TORNEO_CONFIG } from "@/utils/config.ts";
import { type MyState } from "@/routes/_middleware.ts";
import Gate from "@/components/Gate.tsx";
import Streamers from "@/islands/Streamer.tsx";

export default function StreamsPage({ state }: PageProps<unknown, MyState>) {
  const ahora = Date.now();
  const { fechaInicio } = TORNEO_CONFIG;
  const isBefore = ahora < fechaInicio;
  const { vivos, jugadores } = state;

  return (
    <>
      <Head>
        <title>BTOQ | Streams en Vivo</title>
        <meta name="description"
        content="Mira las transmisiones en vivo de los participantes de BTOQ 2026 en Twitch." />
      </Head>

      {/* Usamos bg-Azul para que el fondo sea idéntico a clasificación */}
      <div className="bg-Azul relative min-h-screen overflow-hidden">

        {/* CASO A: Antes del torneo - Portal centralizado */}
        {isBefore && (
          <section className="flex h-screen w-full items-center justify-center">
            <Gate type="streams" />
          </section>
        )}

        {/* CASO B: Durante el torneo - Grid de Streamers */}
        {!isBefore && (
          <main className="animate-fade-in relative z-10 flex w-full flex-col items-center px-[2vw] pt-[12vh] pb-[10vh]">
            <div className="w-full max-w-[95vw]">
              <Streamers
                vivos={vivos}
                jugadores={jugadores}
              />
            </div>
          </main>
        )}
      </div>
    </>
  );
}