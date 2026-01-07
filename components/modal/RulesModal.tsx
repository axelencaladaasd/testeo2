import Modal from "@/components/modal/Modal.tsx";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RulesModal({ open, onClose }: RulesModalProps) {
  const rules = [
    { text: "Las cuentas corren por cuenta propia (hand level o adquiridas).",
      bold: "cuenta propia" },
    { text: "Está permitido cualquier nick, siempre y cuando el tag sea #BTOQ2.",
      bold: "#BTOQ2" },
    { text: "Los participantes deberán estar suscriptos al canal de Betomin (también son válidas las suscripciones regaladas).",
      bold: "suscriptos al canal" },
    { text: "Está totalmente prohibido cualquier tipo de comportamiento antideportivo (toxicidad, racismo, xenofobia, etc.).",
      bold: "comportamiento antideportivo" },
    { text: "No esta permitido el account sharing o el uso de smurfs durante el torneo.",
      bold: "account sharing" },
  ];

  const faqs = [
    { q: "¿CUÁNTO DURA EL TORNEO?",
      a: "El evento empezará el 15 de enero a las 20:00 hs y finaliza el 29 de enero a las 00:00 hs (ARG).",
      bold: "15 de enero" },
    { q: "¿ESTÁ PERMITIDO HACER DUO?",
      a: "Los duos estarán permitidos los primeros cuatro días del evento (no es necesario que sea con la misma persona).",
      bold: "primeros cuatro días" },
    { q: "¿PUEDE STREAMEARSE?",
      a: "Por supuesto. Eso sí, deberán incluir en el título del stream el hashtag del evento #BTOQ2",
      bold: "#BTOQ2" },
  ];

  const renderText = (fullText: string, boldPart?: string) => {
    if (!boldPart) return fullText;
    const parts = fullText.split(boldPart);
    return (
      <>{parts[0]}<span className="gothamU font-black">{boldPart}</span>{parts[1]}</>
    );
  };

  const h2Base = `gothamU text-[10vw] md:text-[4vw] leading-[0.85] tracking-tight text-left`;
  const spanBase = `block gotham text-[4vw] md:text-[1.5vw] tracking-widest mt-[0.5vh] text-left`;

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-[95vw] md:max-w-[83vw]">
      <button
        type="button"
        onClick={onClose}
        className={`bg-Dorado/50 backdrop-blur-md hover:bg-Dorado hover:text-Azul
          text-Azul z-200 flex items-center justify-center rounded-full
          shadow-lg transition-all fixed top-4 right-4 h-10 w-10
          md:absolute md:top-[2vw] md:right-[2vw] md:h-[3.5vw] md:w-[3.5vw]`}
      >
        <svg className="h-6 w-6 md:h-[1.5vw] md:w-[1.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/*
          CONTENEDOR PRINCIPAL:*/}
      <section className={`flex flex-col md:flex-row w-full h-[80vh] md:h-auto md:max-h-[95vh]
        overflow-y-auto overscroll-contain rounded-xl shadow-2xl bg-Blanco relative`}>

        {/* SECCIÓN REGLAS */}
        <article className={`relative flex flex-col shrink-0 items-center
          bg-Blanco p-6 pt-12 md:p-[2vw] md:pt-[10vh] md:flex-1`}>

          <header className={`mb-8 md:mb-[6vh] flex min-h-[10vh] w-full flex-col
            items-start justify-end md:items-center`}>
            <h2 className={`${h2Base} text-Azul`}>
              REGLAS <span className={`${spanBase} text-Azul`}>GENERALES</span>
            </h2>
          </header>

          <ul className="w-full space-y-6 md:space-y-[3.5vh]">
            {rules.map((item, index) => (
              <li key={index} className="flex items-start md:items-center">
                <div className={`mr-2 md:mr-[0.7vw] flex w-8 md:w-[5vw] shrink-0 justify-end`}>
                  <span className={`gothamU text-Azul text-right text-[8vw] leading-none md:text-[4vw]`}>
                    {index + 1}
                  </span>
                </div>
                <p className={`gotham text-Azul z-10 text-[3.8vw] leading-tight tracking-tight md:text-[0.95vw]`}>
                  {renderText(item.text, item.bold)}
                </p>
              </li>
            ))}
          </ul>
        </article>

        {/* SECCIÓN FAQ */}
        <article className={`bg-Azul flex flex-col shrink-0 p-6 pt-10 pb-[10vh]
          md:border-l md:border-Blanco/10 md:p-[4vw] md:pt-[10vh] md:flex-1`}>

          <header className="mb-8 md:mb-[6vh] flex min-h-[10vh] w-full flex-col items-start justify-end">
            <h2 className={`${h2Base} text-Blanco`}>
              PREGUNTAS <span className={`${spanBase} text-Blanco`}>FRECUENTES</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 md:gap-[7vh]">
            {faqs.map((faq, i) => (
              <div key={i} className={`bg-Dorado rounded-xl p-4 shadow-lg md:rounded-[1vw] md:p-[1.2vw]`}>
                <p className={`gotham text-Azul mb-2 text-[4.2vw] font-black md:text-[1.1vw]`}>
                  {faq.q}
                </p>
                <p className={`raleway text-Azul text-[3.5vw] md:text-[1.0vw]`}>
                  {renderText(faq.a, faq.bold)}
                </p>
              </div>
            ))}
          </div>
        </article>

      </section>
    </Modal>
  );
}
