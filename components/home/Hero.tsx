// components/home/Hero.tsx

export default function Hero() {
  return (
    <div className="bg-Azul relative h-screen w-full shrink-0">
      <img
        src="/img/Hero.webp"
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover object-[50%_10%]"
        alt="Hero Btoq - Torneo SoloQueue"
      />
      <div className="relative flex h-full flex-col items-center justify-center"></div>
      {/* Degradado inferior n */}
      <div className="from-Azul absolute bottom-0 h-32 w-full bg-linear-to-t to-transparent" />
    </div>
  );
}
