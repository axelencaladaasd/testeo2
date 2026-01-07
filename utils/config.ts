// utils/config.ts

export interface Premio {
  num?: string;
  suffix?: string;
  sponsor: string;
  img: string;
  title: string;
  desc: string;
  pos?: string;
  isSpecial?: boolean;
  label?: readonly string[];
  footer?: string;
}
export const TORNEO_CONFIG = {
  fechaInicio: new Date("2026-01-15T20:00:00-03:00").getTime(),
  fechaFin: new Date("2026-01-29T00:00:00-03:00").getTime(),

  textos: {
    antes: "El torneo empieza en",
    terminado: "El torneo terminó, muchas gracias por participar",
    ultimoDia: "Último día del torneo",
  },

  // Base de datos de Premios
  premios: [
    {
      num: "1",
      suffix: "ER",
      sponsor: "CARPINCHO",
      img: "/img/Carpincho.webp",
      title: "SKIN",
      desc: "LEGENDARIA",
      pos: "1",
    },
    {
      num: "2",
      suffix: "DO",
      sponsor: "MIDDAS",
      img: "/img/Middas.webp",
      title: "SKIN",
      desc: "1350 RP",
      pos: "2",
    },
    {
      num: "3",
      suffix: "ER",
      sponsor: "BETOMIN",
      img: "/img/Betomin.webp",
      title: "PREMIO",
      desc: "SORPRESA",
      pos: "3",
    },
    {
      isSpecial: true,
      label: ["PREMIO", "ESPECIAL"],
      sponsor: "REICH",
      img: "/img/Reich.webp",
      title: "PASE DE",
      desc: "BATALLA",
      footer: "PRIMERO EN SUBIR A DIAMANTE",
    },
    {
      isSpecial: true,
      label: ["PREMIO", "ESPECIAL"],
      sponsor: "AHRE",
      img: "/img/Ahre.webp",
      title: "CÓDIGO RP",
      desc: "3000",
      footer: "JUGADOR CON MÁS PARTIDAS JUGADAS "
    },
  ],
} as const;
