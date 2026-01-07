import { useState, useEffect } from "preact/hooks";
import RulesModal from "@/components/modal/RulesModal.tsx";
import VideoModal from "@/components/modal/VideoModal.tsx";
import InscripcionForm from "@/islands/home/InscripcionForm.tsx";

const DEADLINE = new Date(2026, 0, 14, 23, 59); // mes/dia/hora/minuto

// --- ESTILOS OPTIMIZADOS ---
const UI = {
  box: `bg-Blanco shadow-2xl flex flex-col justify-center
    w-full min-h-[220px] rounded-[2.5rem] p-7 gap-4
    md:w-[42vw] md:h-[16vw] md:rounded-[2.5vw] md:p-[2.5vw] md:gap-[1.2vw]`,

  btnBase: `gothamU tracking-widest flex items-center justify-center
    w-full shrink-0 whitespace-nowrap transition-transform duration-300
    will-change-transform hover:-translate-y-1 active:scale-95`,

  btnDorado: `bg-Dorado text-Azul py-5 text-2xl rounded-2xl shadow-md
    md:py-[1.3vw] md:text-[2.2vw] md:rounded-[1vw]`,

  btnAzul: `flex-1 bg-Azul text-Blanco py-4 text-xl rounded-xl shadow-sm
    md:py-[0.9vw] md:text-[1.1vw] md:rounded-[0.7vw]`,

  btnDisabled: `opacity-60 shadow-none border-none cursor-not-allowed`,
};

export default function AboutButtons() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkDate = () => setIsExpired(new Date() > DEADLINE);
    checkDate();
    const timer = setInterval(checkDate, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section class="flex w-full justify-center md:justify-start items-center">
      <div class={UI.box}>

        {/* Botón Inscripción */}
        <button
          type="button"
          disabled={isExpired}
          onClick={() => setActiveModal("form")}
          aria-label={isExpired ? "Inscripciones cerradas" : "Inscripción al torneo"}
          class={`${UI.btnBase} ${UI.btnDorado} ${isExpired ? UI.btnDisabled : ""}`}
        >
          {isExpired ? "INSCRIPCIÓN CERRADA" : "INSCRIPCIÓN"}
        </button>

        {/* Botones secundarios */}
        <nav class="flex gap-4 md:gap-[1.2vw] w-full">
          <button
            type="button"
            onClick={() => setActiveModal("rules")}
            aria-label="Ver reglas"
            class={`${UI.btnBase} ${UI.btnAzul}`}
          >
            REGLAS
          </button>

          <button
            type="button"
            disabled
            onClick={() => setActiveModal("video")}
            aria-label="Trailer próximamente"
            class={`${UI.btnBase} ${UI.btnAzul} ${UI.btnDisabled}`}
          >
            TRAILER
          </button>
        </nav>
      </div>

      {/* Renderizado de Modales */}
      {activeModal === "rules" && (
        <RulesModal open onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "video" && (
        <VideoModal isOpen onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "form" && !isExpired && (
        <InscripcionForm isOpen onClose={() => setActiveModal(null)} />
      )}
    </section>
  );
}