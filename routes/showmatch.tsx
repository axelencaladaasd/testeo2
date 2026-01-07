// routes/showmatch.tsx
import { Head } from "fresh/runtime";
import { PageProps } from "@fresh/core";
import { TORNEO_CONFIG } from "@/utils/config.ts";
import { type MyState } from "@/routes/_middleware.ts";
import Gate from "@/components/Gate.tsx";
import ShowVideo from "@/islands/Show.tsx";

export default function Showmatch({ state: _state }: PageProps<unknown, MyState>) {
  const ahora = Date.now();
  const { fechaInicio } = TORNEO_CONFIG;
  const isBefore = ahora < fechaInicio;

  return (
    <>
      <Head>
        <title>BTOQ | Showmatch</title>
      </Head>

      <div className="bg-Azul relative min-h-screen overflow-hidden">
        {/* CASO A: Antes del torneo - Portal pantalla completa */}
        {isBefore && (
          <section className="flex h-screen w-full items-center justify-center">
            <Gate type="showmatch" />
          </section>
        )}

        {/* CASO B: Durante o después del torneo - Video */}
        {!isBefore && (
          <main className="animate-fade-in relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-[2vw]">
            <ShowVideo videoId="2663128379" />
          </main>
        )}
      </div>
    </>
  );
}