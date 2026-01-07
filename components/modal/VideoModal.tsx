import { useEffect, useRef, useState, useMemo } from "preact/hooks";
import Modal from "@/components/modal/Modal.tsx";

// Constantes
const VIDEOS = [
  {
    id: 1,
    title: "Trailer Oficial",
    src: "https://cdn.jsdelivr.net/gh/Neithan2/assets@main/trailer1.mp4",
    thumb: "/img/thumb1.webp",
  },
  {
    id: 2,
    title: "Ahora es Personal",
    src: "https://cdn.jsdelivr.net/gh/Neithan2/assets@main/trailer2.mp4",
    thumb: "/img/thumb2.webp",
  },
  {
    id: 3,
    title: "Sener vs la BTO",
    src: "https://cdn.jsdelivr.net/gh/Neithan2/assets@main/trailer3.mp4",
    thumb: "/img/thumb3.webp",
  },
  {
    id: 4,
    title: "Betomin Cae",
    src: "https://cdn.jsdelivr.net/gh/Neithan2/assets@main/trailer4.mp4",
    thumb: "/img/thumb4.webp",
  }
];

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

// Iconos
const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const VolIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);
const MuteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.38.29-.81.52-1.25.68v2.06c1.02-.22 1.95-.66 2.75-1.25L19.73 21 21 19.73l-8.47-8.47L4.27 3z" />
  </svg>
);
const FullscreenIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);

export default function VideoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const vRef = useRef<HTMLVideoElement>(null);
  const cRef = useRef<HTMLDivElement>(null);

  const [cur, setCur] = useState(VIDEOS[0]);
  const [isP, setIsP] = useState(false);
  const [vol, setVol] = useState(0.5);
  const [prevVol, setPrevVol] = useState(0.5);
  const [prog, setProg] = useState(0);
  const [times, setTimes] = useState({
    current: "0:00",
    total: "0:00",
  });
  const [showPreview, setShowPreview] = useState(true);

  const handleTogglePlay = () =>
    vRef.current?.paused ? vRef.current.play() : vRef.current?.pause();

  const handleToggleMute = () => {
    if (vol > 0) {
      setPrevVol(vol);
      setVol(0);
    } else setVol(prevVol || 0.5);
  };

  // Efecto: Teclado y Volumen
  useEffect(() => {
    if (vRef.current) vRef.current.volume = vol;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setVol((v) => Math.min(v + 0.1, 1));
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setVol((v) => Math.max(v - 0.1, 0));
      }
      if (e.key.toLowerCase() === "m") handleToggleMute();
    };

    //
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, vol]);

  useEffect(() => {
    if (!isOpen) {
      vRef.current?.pause();
      setIsP(false);
      return;
    }
    setShowPreview(true);
  }, [isOpen, cur]);

  const volumeProgress = useMemo(
    () =>
      ({
        "--p": `${vol * 100}%`,
      }) as Record<string, string>,
    [vol],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[90vw] md:max-w-[80vw]"
    >
      <div
        ref={cRef}
        className="bg-Azul border-Dorado/10 flex h-auto w-full flex-col overflow-hidden rounded-xl border shadow-2xl md:h-[82vh] md:flex-row"
      >
        {/* PLAYER AREA */}
        <div className="relative flex flex-2 flex-col lg:flex-3">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
            {showPreview && (
              <img
                src={cur.thumb}
                className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain transition-opacity duration-300"
                alt="preview"
              />
            )}

            <video
              ref={vRef}
              src={cur.src}
              autoPlay
              playsInline
              onLoadedMetadata={(e) =>
                setTimes((prev) => ({
                  ...prev,
                  total: formatTime(e.currentTarget.duration),
                }))
              }
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                setProg((v.currentTime / v.duration) * 100 || 0);
                setTimes((prev) => ({
                  ...prev,
                  current: formatTime(v.currentTime),
                }));
              }}
              onPlay={() => {
                setIsP(true);
                setShowPreview(false);
              }}
              onPause={() => setIsP(false)}
              className="h-full w-full -translate-y-[12.5%] scale-[1.35] transform cursor-pointer object-contain transition-transform duration-500"
              onClick={handleTogglePlay}
            />
          </div>

          {/* CONTROLES */}
          <div className="bg-Azul border-Blanco/10 relative flex h-20 w-full shrink-0 flex-col justify-center border-t md:h-[10vh]">
            <div className="bg-Blanco/10 absolute top-0 left-0 h-1 w-full -translate-y-full overflow-hidden">
              <input
                type="range"
                step="0.1"
                value={prog}
                onInput={(e) => {
                  if (vRef.current)
                    vRef.current.currentTime =
                      (parseFloat(e.currentTarget.value) / 100) *
                      vRef.current.duration;
                }}
                className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0"
              />
              <div
                className="bg-Dorado h-full transition-all duration-100 ease-out"
                style={{
                  width: `${prog}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between px-6 md:px-[1.5vw]">
              <div className="flex items-center gap-4 md:gap-[1.5vw]">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="text-Dorado shrink-0 transition-transform hover:scale-110"
                >
                  {isP ? (
                    <PauseIcon className="h-8 w-8 md:h-[2.2vw] md:w-[2.2vw]" />
                  ) : (
                    <PlayIcon className="h-8 w-8 md:h-[2.2vw] md:w-[2.2vw]" />
                  )}
                </button>

                <div className="gotham text-Blanco text-sm font-black uppercase italic tabular-nums md:text-[1vw]">
                  <span className="text-Dorado">{times.current}</span>
                  <span className="mx-1 opacity-30">/</span>
                  <span className="opacity-60">{times.total}</span>
                </div>

                <div className="hidden items-center gap-[0.8vw] rounded-full bg-black/30 px-[1vw] py-[0.5vh] lg:flex">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-Dorado transition-colors hover:text-white"
                  >
                    {vol === 0 ? (
                      <MuteIcon className="h-[1.5vw] w-[1.5vw]" />
                    ) : (
                      <VolIcon className="h-[1.5vw] w-[1.5vw]" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={vol}
                    onInput={(e) => setVol(parseFloat(e.currentTarget.value))}
                    className="bg-Blanco/20 h-1 w-[6vw] min-w-15 cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,var(--color-Dorado)_var(--p),transparent_0%)] bg-no-repeat"
                    style={volumeProgress}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    !globalThis.document?.fullscreenElement
                      ? cRef.current?.requestFullscreen()
                      : globalThis.document?.exitFullscreen()
                  }
                  className="text-Blanco/40 hover:text-Dorado transition-colors"
                >
                  <FullscreenIcon className="h-6 w-6 md:h-[1.5vw] md:w-[1.5vw]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="gothamU border-Blanco/20 hover:border-Dorado hover:text-Dorado text-Blanco border px-[1.2vw] py-[0.5vh] text-[10px] font-bold tracking-tighter uppercase italic transition-all md:text-[0.7vw]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYLIST */}
        <aside className="bg-Azul/50 border-Dorado/10 flex w-full shrink-0 flex-col border-t backdrop-blur-md md:w-[22vw] md:border-t-0 md:border-l">
          <div className="border-Dorado/10 border-b p-[1.5vw]">
            <h3 className="text-Dorado gothamU text-center text-[3.5vw] tracking-[0.2em] uppercase italic md:text-[0.9vw]">
              Playlist
            </h3>
          </div>
          <div className="custom-scrollbar max-h-[40vh] flex-1 space-y-[1vh] overflow-y-auto p-[1vw] md:max-h-none">
            {VIDEOS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setCur(v)}
                className={`group flex w-full items-center gap-[1vw] rounded-lg border p-[0.5vw] transition-all ${
                  cur.id === v.id
                    ? "border-Dorado/50 bg-Dorado/5"
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <div className="relative aspect-video w-[20vw] shrink-0 overflow-hidden rounded bg-black shadow-inner md:w-[6vw]">
                  <img
                    src={v.thumb}
                    alt={`Miniatura de ${v.title}`}
                    width="279"
                    height="165"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {cur.id === v.id && (
                    <div className="bg-Dorado/10 absolute inset-0 flex items-center justify-center">
                      <div className="bg-Dorado h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_8px_#dfb760]" />
                    </div>
                  )}
                </div>
                <p
                  className={`raleway truncate text-left text-[3vw] font-bold uppercase italic md:text-[0.75vw] ${cur.id === v.id ? "text-Dorado" : "text-Blanco/50 group-hover:text-Blanco"}`}
                >
                  {v.title}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </Modal>
  );
}
