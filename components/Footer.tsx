export default function Footer() {
  const socialLinks = [
    { href: "https://www.twitch.tv/betomin", src: "/img/Twitch.svg", label: "Twitch" },
    { href: "https://www.instagram.com/betomin._", src: "/img/Instagram.svg", label: "Instagram" },
    { href: "https://www.tiktok.com/@betominok", src: "/img/TikTok.svg", label: "TikTok" },
    { href: "https://www.youtube.com/@betomin23", src: "/img/YouTube.svg", label: "YouTube" },
  ];

  const labelCls = `gotham text-sm tracking-tight text-Blanco mb-1
    md:text-[1.1vw] md:mb-[0.2vw]`;

  const textCls = `raleway font-light text-xs text-Blanco
    md:text-[1vw]`;

  const dotSpan = "font-bold text-Dorado/60 md:text-[1vw] inline-block mx-2";

  return (
    <footer className="mt-auto w-full shrink-0 border-t border-Blanco/20 bg-Azul
    shadow-[0_-8px_20px_rgba(0,0,0,0.3)]">

      <div className={`mx-auto flex w-[90vw] flex-col items-center
        justify-between gap-6 py-8 md:relative md:h-[10vw]
        md:flex-row md:items-center md:py-0`}>

        {/* 1. BRANDING */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left shrink-0">
          <div className="w-32 md:w-[10vw]">
            <img src="/img/Logo.svg" alt="Logo" className="h-auto w-full brightness-110" />
          </div>
          <p className="raleway text-[7px] tracking-widest text-Blanco md:text-[0.6vw]">
            ORGANIZADO POR BETOMIN
          </p>
        </div>

        {/* 2. CRÉDITOS */}
        <section className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-[5vw]">
          <div className="flex flex-col items-center md:items-start">
            <span className={labelCls}>EMAIL</span>
            <span className={textCls}>betomindelpueblo@gmail.com</span>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <span className={labelCls}>ART & DESIGN</span>
            <span className={textCls}>
              Beto <span className={dotSpan}>•</span> Lummy
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <span className={labelCls}>DEVELOPMENT</span>
            <span className={textCls}>
              Neithan <span className={dotSpan}>•</span> Pop
            </span>
          </div>
        </section>

      <div className="flex items-center gap-1 md:gap-[1.3vw] shrink-0 md:translate-y-[0.7vw]">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener"
            aria-label={link.label}
            className="group relative flex items-center justify-center transition-all duration-700 hover:rotate-360 hover:scale-110 hover:brightness-125"
          >
            <img
              src={link.src}
              alt=""
              className="h-auto w-6 md:w-[1.3vw]"
            />
          </a>
        ))}
      </div>

        {/* PISO: COPYRIGHT */}
        <div className="w-full text-center mt-6 md:absolute md:bottom-[0.4vw]
        md:left-0 md:flex md:justify-center md:mt-0">
          <p className="raleway text-[8px] tracking-[0.3em] text-Blanco/50 md:text-[0.55vw]">
            © BTOQ CHALLENGE 2026 — TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>

      </div>
    </footer>
  );
}