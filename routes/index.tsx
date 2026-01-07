import { Head } from "fresh/runtime";
import Hero from "@/components/home/Hero.tsx";
import AboutSection from "@/components/home/AboutSections.tsx";
import PrizesSection from "@/components/home/PrizeSection.tsx";

export default function Inicio() {
  return (
    <>
      <Head>
        <title>BTOQ | Inicio</title>
        <meta name="description" content="Torneo de SoloQueue BTOQ" />
      </Head>
      <main className="bg-Azul text-Blanco flex flex-col overflow-x-hidden">
        <Hero />
        <AboutSection />
        <PrizesSection />
      </main>
    </>
  );
}