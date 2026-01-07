import { useState, useMemo, useEffect, useRef } from "preact/hooks";
import { Jugador } from "@/routes/_middleware.ts";

export function useScoreboard(jugadoresIniciales: Jugador[]) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [criterioOrden, setCriterioOrden] = useState("DEFAULT");
  const [rolesExpandido, setRolesExpandido] = useState(false);
  const [efectosActivos, setEfectosActivos] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado para buscar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        globalThis.document?.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, []);

  const filtrados = useMemo(() => {
    // 1. Empezamos con la lista base
    let res = [...(jugadoresIniciales || [])];

    // 2. Filtro por búsqueda
    if (busqueda.trim() !== "") {
      const term = busqueda.toLowerCase();
      res = res.filter(
        (j) =>
          j.jugador.toLowerCase().includes(term) ||
          j.invocador.toLowerCase().includes(term),
      );
    }

    // 3. Filtro por Rol
    if (filtroRol !== "TODOS") {
      res = res.filter((j) => j.rol.toUpperCase() === filtroRol.toUpperCase());
    }

    // 4. Ordenación
    if (criterioOrden === "VIVO") {
      res = res.filter((j) => j.estado === "online");
    } else if (criterioOrden === "WR") {
      res.sort((a, b) => parseFloat(b.winrate) - parseFloat(a.winrate));
    } else {
      // Orden por posición por defecto
      res.sort((a, b) => (a.posición || 0) - (b.posición || 0));
    }

    return res;
  }, [busqueda, filtroRol, criterioOrden, jugadoresIniciales]);

  const resetFiltros = () => {
    setCriterioOrden("DEFAULT");
    setFiltroRol("TODOS");
    setBusqueda("");
    setRolesExpandido(false);
  };

  return {
    busqueda,
    setBusqueda,
    filtroRol,
    setFiltroRol,
    criterioOrden,
    setCriterioOrden,
    rolesExpandido,
    efectosActivos,
    filtrados,
    inputRef,
    resetFiltros,
    toggleEfectos: () => setEfectosActivos(!efectosActivos),
    toggleRoles: () => setRolesExpandido(!rolesExpandido),
  };
}
