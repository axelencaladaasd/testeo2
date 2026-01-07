// islands/home/InscriptionForm.tsx
import { useState, useEffect } from "preact/hooks";
import Modal from "../../components/modal/Modal.tsx";

const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfpi2FGlmsDNoq-9s2vXQgPM-94sTsG_qRPvkCuEiySGbCMwQ/formResponse";
const STORAGE_KEY = "torneo_btoq2_registrado";

type FormState = {
  riotId: string; region: string; twitch: string;
  streameas: string; discord: string;
};

// --- LÓGICA DE VALIDACIÓN ---

const validate = (name: string, value: string) => {
  if (!value) return "Requerido";

  // --- VALIDACIÓN RIOT ID ---
  if (name === "riotId") {
    if (!value.includes("#")) return "Falta el #TAG";
    const parts = value.split("#");
    const tag = parts[parts.length - 1];
    if (tag.length < 5) return "Debe terminar en: #BTOQ2";
    if (!value.endsWith("#BTOQ2")) {
      return "Debe ser exactamente #BTOQ2";
    }
  }

  // --- VALIDACIÓN TWITCH ---
  if (name === "twitch") {
    const valLow = value.toLowerCase();
    if (valLow.includes("twitch.tv/") || valLow.includes("http")) return "Solo el usuario";
    if (value.startsWith("@")) return "Sin el @";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Nombre inválido";
    if (value.length > 25) return "Demasiado largo";
  }

  // --- VALIDACIÓN DISCORD ---
  if (name === "discord") {
    if (value.includes(" ")) return "Sin espacios";
    const discordRegex = /^[a-z0-9._]+$/;
    if (!discordRegex.test(value)) return "Usuario inválido";
    if (value.length < 2) return "Mínimo 2 caracteres";
  }

  return undefined;
};


// --- SUB-COMPONENTES ---

interface InputFieldProps {
  name: string;
  placeholder: string;
  value: string;
  onInput: (e: Event & { currentTarget: HTMLInputElement }) => void;
  warn?: string;
  className: string;
}

const InputField = ({ name, placeholder, value, onInput, warn, className }: InputFieldProps) => (
  <div className="relative mt-4 w-full md:flex-1">
    <input
      id={name}
      name={name}
      value={value}
      onInput={onInput}
      autoComplete="off"
      placeholder={placeholder}
      className={`${className} peer placeholder-transparent`}
    />

    <label htmlFor={name} className="
      text-Blanco/50 gotham pointer-events-none absolute top-1/2 left-[3vw]
      -translate-y-1/2 text-[4vw] transition-all duration-200 md:left-[1vw] md:text-[0.9vw]
      peer-focus:text-Dorado peer-focus:bg-Azul peer-focus:-translate-y-[5.8vh]
      peer-focus:px-2 peer-focus:text-[3.8vw] md:peer-focus:text-[0.85vw]
      peer-[:not(:placeholder-shown)]:text-Dorado peer-[:not(:placeholder-shown)]:bg-Azul
      peer-[:not(:placeholder-shown)]:-translate-y-[5.8vh]
      peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-[3.8vw]
      md:peer-[:not(:placeholder-shown)]:text-[0.85vw]">
      {placeholder}
    </label>

    {warn && (
      <span className="
        raleway absolute top-1/2 -translate-y-1/2
        right-[1.5vw] md:right-[0.8vw]
        z-20 pointer-events-none font-bold text-red-400
        text-[2.8vw] md:text-[0.8vw]
      ">
        {warn}
      </span>
    )}
  </div>
);

interface RadioGroupProps {
  label: string;
  options: string[];
  name: string;
  current: string;
  onInput: (e: Event & { currentTarget: HTMLInputElement }) => void;
  radioCls: (act: boolean) => string;
}

const RadioGroup = ({ label, options, name, current, onInput, radioCls }: RadioGroupProps) => (
  <div className="relative mt-4 flex w-full flex-col md:w-[12vw]">
    <label className={`
      bg-Azul gotham absolute -top-[1.2vh] left-[2vw] z-10 px-2 text-[2vw]
      font-black tracking-wider transition-colors md:left-[0.8vw]
      md:text-[0.7vw] ${current ? "text-Dorado" : "text-Blanco/50"}`}>
      {label}
    </label>
    <div className={`
      bg-Azul/50 relative flex h-[7vh] items-stretch gap-[0.3vw]
      rounded-[1vw] border-2 p-[0.3vw] transition-all md:h-[7.5vh]
      ${current ? "border-Dorado shadow-[0_0_10px_rgba(212,175,55,0.2)]" : "border-Blanco/10"}`}>
      {options.map((opt) => (
        <label key={opt} className={radioCls(current === opt)}>
          <input type="radio" name={name} value={opt} checked={current === opt}
            onInput={onInput} className="hidden" />
          <span className="flex h-full items-center justify-center">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function InscripcionForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>({
    riotId: "", region: "", streameas: "", discord: "", twitch: ""
  });
  const [warns, setWarns] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<"idle" | "error" | "success" | "loading" | "already_sent">("idle");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setStatus("already_sent");
  }, []);

  const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    const { name, value } = e.currentTarget;
    setForm(p => ({ ...p, [name]: value }));
    setWarns(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (status === "already_sent") return;
    const newWarns: Record<string, string | undefined> = {};
    (Object.keys(form) as Array<keyof FormState>).forEach(k => {
      const err = validate(k, form[k]);
      if (err) newWarns[k] = err;
    });
    if (Object.keys(newWarns).length > 0) return (setWarns(newWarns), setStatus("error"));

    setStatus("loading");
    const payload = new URLSearchParams({
      "entry.1221956897": form.riotId, "entry.1865107259": form.region,
      "entry.996253528": form.discord, "entry.494061001": form.streameas,
      "entry.1448078224": form.twitch,
    });
    try {
      await fetch(FORM_URL, { method: "POST", body: payload, mode: "no-cors" });
      localStorage.setItem(STORAGE_KEY, "true");
      setStatus("success");
    } catch { setStatus("error"); }
  };

  // --- Estilos de UI ---
  const btnBase = "gotham rounded-[1vw] py-[1.5vh] text-[3vw] md:text-[0.9vw] transition-all duration-200";

  const getInputCls = (n: string) => `
    raleway w-full bg-Azul/50 border-2 rounded-[1vw] px-[1vw] md:px-[0.8vw]
    text-Blanco outline-none transition-all h-[7vh] md:h-[7.5vh] pt-[1vh]
    ${warns[n] ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "border-Blanco/10 focus:border-Dorado"}
  `;

  const getRadioCls = (act: boolean) => `
    raleway flex-1 cursor-pointer text-[3vw] md:text-[0.9vw] py-[1vh]
    rounded-[0.5vw] font-black text-center transition-all
    ${act ? "bg-Dorado text-Azul" : "text-Blanco/40 hover:text-Blanco"}
  `;

const FormSuccessOverlay = ({ onFinalize }: { onFinalize: () => void }) => (
  <div className="bg-Azul/95 absolute inset-0 z-100 flex
    items-center justify-center p-[5vw] backdrop-blur-md">

    <div className="bg-Blanco w-full max-w-[80vw] rounded-[2vw]
      border-b-[1vh] border-green-500 p-[6vw] text-center
      md:max-w-[25vw] md:p-[2vw]">

      <p className="gothamU text-Azul mb-[3vh] text-[4vw]
        font-black md:text-[1.2vw]">
        ¡Registro exitoso!
      </p>

      <button
        type="button"
        onClick={onFinalize}
        className="gothamU bg-Azul text-Blanco w-full rounded-[1vw]
          py-[1.5vh] text-[3.5vw] font-black md:text-[0.8vw]"
      >
        Cerrar
      </button>
    </div>
  </div>
);

const AlreadySentView = ({ onClose, btnBase }: { onClose: () => void, btnBase: string }) => (
  <div className="py-[4vh] text-center">
    <p className="gotham text-Blanco mb-[4vh] text-[6.5vw]
      opacity-70 md:text-[1.7vw]">
      Ya te encuentras registrado en el torneo.
    </p>

    <button
      type="button"
      onClick={onClose}
      className={`${btnBase} font-black bg-Dorado text-Azul w-full`}
    >
      Cerrar
    </button>
  </div>
);

return (
  <Modal
    maxWidth="max-w-[95vw] md:max-w-[40vw]"
    isOpen={isOpen}
    onClose={onClose}
  >
    <form
      onSubmit={handleSubmit}
      className="bg-Azul relative w-full max-h-[90vh] overflow-y-auto md:overflow-hidden rounded-xl shadow-2xl"
    >
      <img
        src="/img/FormHeader.webp"
        alt="Encabezado"
        className="border-Dorado/30 h-[12vh] md:h-[20vh] w-full border-b object-cover"
      />

      <div className="flex flex-col gap-[2vh] p-[6vw] md:p-[2.5vw]">
        <h4 className="gothamU text-Dorado relative z-10 -mt-[8vw] md:-mt-[2vw] text-center
          text-[6vw] font-black tracking-[0.2em] md:text-[1.5vw] drop-shadow-lg">
          {status === "already_sent" ? "Registro completado" : "Inscripción"}
        </h4>

        {status === "already_sent" ? (
          <AlreadySentView onClose={onClose} btnBase={btnBase} />
        ) : (
          <>
            {/* Fila 1: Riot ID y Región */}
            <div className="flex flex-col gap-[2vh] md:flex-row md:items-end md:gap-[1.5vw]">
              <div className="flex-1 w-full">
                <InputField
                  name="riotId"
                  placeholder="Riot ID"
                  value={form.riotId}
                  warn={warns.riotId}
                  onInput={handleInput}
                  className={getInputCls("riotId")}
                />
              </div>
              <div className="w-full md:w-auto">
                <RadioGroup
                  name="region"
                  label="Región"
                  options={["LAS", "LAN", "BR"]}
                  current={form.region}
                  onInput={handleInput}
                  radioCls={getRadioCls}
                />
              </div>
            </div>

            {/* Fila 2: Discord y Stream - Stacked en mobile */}
            <div className="flex flex-col gap-[2vh] md:flex-row md:items-end md:gap-[1.5vw]">
              <div className="flex-1 w-full">
                <InputField
                  name="discord"
                  placeholder="Discord/ID"
                  value={form.discord}
                  onInput={handleInput}
                  warn={warns.discord}
                  className={getInputCls("discord")}
                />
              </div>
              <div className="w-full md:w-auto">
                <RadioGroup
                  name="streameas"
                  label="¿Vas a streamear?"
                  options={["SI", "NO"]}
                  current={form.streameas}
                  onInput={handleInput}
                  radioCls={getRadioCls}
                />
              </div>
            </div>

            <InputField
              name="twitch"
              placeholder="Canal de Twitch"
              value={form.twitch}
              warn={warns.twitch}
              onInput={handleInput}
              className={getInputCls("twitch")}
            />

            <img
              src="/img/FormFooter.webp"
              alt="Decoración"
              className="hidden md:block border-Blanco/5 mt-[2vh] h-[12vh] w-full rounded-[1vw]
                border object-cover opacity-80"
            />

            {/* Botones de Acción - Grid de 1 col en mobile, 2 en PC */}
            <div className="mt-[1vh] grid grid-cols-1 md:grid-cols-2 gap-[2vh] md:gap-[1.5vw] pb-[2vh] md:pb-0">
              <button
                type="submit"
                disabled={status === "loading"}
                className={`
                  ${btnBase} bg-Dorado text-Azul shadow-lg font-black py-4 md:py-[1.5vh]
                  ${status === "loading"
                    ? "opacity-50"
                    : "hover:brightness-110 active:scale-95"}
                `}
              >
                {status === "loading" ? "Enviando..." : "Registrarse"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`
                  ${btnBase} border-Blanco/20 text-Blanco py-4 md:py-[1.5vh]
                  hover:bg-Blanco/5 border-2
                `}
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>

      {status === "success" && (
        <FormSuccessOverlay
          onFinalize={() => { setStatus("already_sent"); onClose(); }}
        />
      )}
    </form>
  </Modal>
);
}