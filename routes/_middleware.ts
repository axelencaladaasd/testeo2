import { type Context } from "@fresh/core";
import { TORNEO_CONFIG } from "@/utils/config.ts";

// --- INTERFACES ---
export interface Jugador {
  posición: number;
  jugador: string;
  invocador: string;
  tag: string;
  rol: string;
  region: string;
  estado: string;
  victorias: number;
  derrotas: number;
  winrate: string;
  rango: string;
  division: string;
  LP: number;
  canal: string;
  racha: number;
  cambioPos: number;
}

export interface StreamTwitch {
  user_login: string;
  user_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
}

interface TwitchAPIResponse extends StreamTwitch {
  game_id: string;
}

export interface MyState {
  jugadores: Jugador[];
  vivos: StreamTwitch[];
}

// --- CACHÉ Y PERSISTENCIA ---
const CACHE = {
  jugadores: { data: [] as Jugador[], last: 0 },
  canales: { data: [] as string[], last: 0 },
  vivos: { data: [] as StreamTwitch[], last: 0 },
};

// Persistencia de posiciones para la tendencia
const POSICIONES_HISTORICAS: Record<string, number> = {};
let ULTIMA_FOTO_24H = 0;

const TTL = {
  BACKEND: 300_000,             // 5 min
  TWITCH: 180_000,              // 3 min
  CANALES: 24 * 60 * 60 * 1000,   // 24 horas
  TENDENCIA: 24 * 60 * 60 * 1000, // 24 horas
};

export async function handler(ctx: Context<MyState>) {
  const url = new URL(ctx.req.url);
  const path = url.pathname;

  if (!path.startsWith("/clasificacion") && !path.startsWith("/streams")) {
    return await ctx.next();
  }

  const ahora = Date.now();
  const backendUrl = Deno.env.get("BACKEND_URL") || "";
  const isFinished = ahora >= TORNEO_CONFIG.fechaFin;

  try {
    // 1. ACTUALIZAR JUGADORES Y TENDENCIAS
    if ((!isFinished && ahora - CACHE.jugadores.last > TTL.BACKEND) || CACHE.jugadores.data.length === 0) {
      if (backendUrl) {
        const resB = await fetch(backendUrl);
        if (resB.ok) {
          const nuevosDatos = (await resB.json()) as Jugador[];

          // Lógica de Foto de Tendencia (Cada 24h)
          if (ahora - ULTIMA_FOTO_24H > TTL.TENDENCIA || ULTIMA_FOTO_24H === 0) {
            nuevosDatos.forEach((j) => {
              POSICIONES_HISTORICAS[j.invocador] = j.posición;
            });
            ULTIMA_FOTO_24H = ahora;
            console.log("%c[TENDENCIA] Nueva foto de posiciones guardada", "color: magenta");
          }

          // Inyectamos el cálculo de cambioPos
          CACHE.jugadores.data = nuevosDatos.map((j) => ({
            ...j,
            cambioPos: POSICIONES_HISTORICAS[j.invocador]
              ? POSICIONES_HISTORICAS[j.invocador] - j.posición
              : 0,
          }));

          CACHE.jugadores.last = ahora;
          console.log("%c[BACKEND] Jugadores y tendencias actualizados", "color: yellow");
        }
      }
    }

    // 2. ACTUALIZAR LISTA DE CANALES (Caché 24h)
    if ((ahora - CACHE.canales.last > TTL.CANALES || CACHE.canales.data.length === 0) && CACHE.jugadores.data.length > 0) {
      CACHE.canales.data = CACHE.jugadores.data
        .filter((j) => j.canal)
        .map((j) => j.canal.toLowerCase().trim());
      CACHE.canales.last = ahora;
      console.log("%c[CANALES] Lista de Twitch regenerada por 24h", "color: blue");
    }

    // 3. ACTUALIZAR TWITCH (Cada 3 min)
    if (ahora - CACHE.vivos.last > TTL.TWITCH && CACHE.canales.data.length > 0) {
      const clientId = Deno.env.get("TWITCH_CLIENT_ID") || "";
      const token = Deno.env.get("TWITCH_TOKEN") || "";
      const gameId = Deno.env.get("LOL_GAME_ID") || "";

      const queryParams = CACHE.canales.data.slice(0, 100).map((c) => `user_login=${c}`).join("&");
      const resT = await fetch(`https://api.twitch.tv/helix/streams?${queryParams}`, {
        headers: { "Client-ID": clientId, Authorization: `Bearer ${token}` },
      });

      if (resT.ok) {
        const json = await resT.json();
        const data = (json.data as TwitchAPIResponse[]) || [];
        CACHE.vivos.data = data
          .filter((s) => !gameId || s.game_id === gameId)
          .map((s) => ({
            user_login: s.user_login.toLowerCase(),
            user_name: s.user_name,
            title: s.title,
            viewer_count: s.viewer_count,
            thumbnail_url: s.thumbnail_url,
          }));
        CACHE.vivos.last = ahora;
      }
    }

    // 4. MERGE FINAL (Estado en vivo + Jugadores + Tendencia)
    ctx.state.vivos = CACHE.vivos.data;
    ctx.state.jugadores = CACHE.jugadores.data.map(j => ({
      ...j,
      estado: CACHE.vivos.data.some(v => v.user_login === j.canal?.toLowerCase().trim())
              ? "EN VIVO"
              : "OFFLINE"
    }));

  } catch (e) {
    console.error("Error Middleware:", e);
    ctx.state.jugadores = CACHE.jugadores.data;
    ctx.state.vivos = CACHE.vivos.data;
  }

  return await ctx.next();

}
