// components/home/AboutSections.tsx

import Timer from "@/islands/home/Timer.tsx";
import AboutButtons from "@/islands/home/AboutButtons.tsx";

export default function AboutSection() {
  return (
    <div className="bg-Azul w-full flex flex-col items-center">
      <section className="relative w-full py-4 md:py-12 overflow-hidden flex flex-col items-center">

        <div className="relative z-10 w-full max-w-[85vw] flex flex-col gap-8 md:gap-14 px-4">
          {/* Timer */}
          <div className="w-full min-h-30 md:min-h-40 flex justify-center">
            <Timer />
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Columna Izquierda */}
            <div className="w-full flex justify-center md:justify-start">
              <AboutButtons />
            </div>

            {/* Columna Derecha */}
            <div className="raleway flex flex-col justify-center text-Blanco py-2 md:pl-4">
              <h2 className="gothamU text-[9.5vw] font-black leading-[0.85]
                md:text-[3.6vw] mb-6 md:mb-4">
                ¿EN QUÉ CONSISTE?
              </h2>

              <div className="text-[3.5vw] leading-relaxed md:text-[1.27vw] md:space-y-2">
                <p>Este torneo está pensado para todo aquel que quiera medir sus habilidades
                  en SoloQueue contra otros jugadores.</p>
                <p>Streamers, mods, vips, viewers, etc. Absolutamente todos contra todos.</p>
              </div>

              <p className="gothamU mt-6 text-[3.5vw] font-bold tracking-wide text-Dorado md:text-[1.5vw]">
                Dos semanas para decidir quién ganará.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARADOR */}
      <div className="w-[85%] h-px bg-linear-to-r from-transparent via-Blanco/40 to-transparent mt-12 md:mt-24 mb-10" />
    </div>
  );
}