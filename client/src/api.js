// Funciones para comunicarse con el servidor
async function pedir(url, opciones = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const datos = await res.json();
  if (!res.ok) throw datos.errores || ["Ocurrió un error en el servidor."];
  return datos;
}

export const api = {
  catalogo: () => pedir("/api/catalogo"),
  crearSolicitud: (datos) => pedir("/api/solicitudes", { method: "POST", body: JSON.stringify(datos) }),
  requisitos: (destino) => pedir(`/api/requisitos/${destino}`),
  vuelos: (origen, destino) => pedir(`/api/vuelos?origen=${origen}&destino=${destino}`),
  hospedajes: (destino) => pedir(`/api/hospedajes?destino=${destino}`),
  gastos: (destino) => pedir(`/api/gastos/${destino}`),
  crearPresupuesto: (datos) => pedir("/api/presupuestos", { method: "POST", body: JSON.stringify(datos) }),
  historial: () => pedir("/api/presupuestos"),
  enviar: (folio) => pedir(`/api/presupuestos/${folio}/enviar`, { method: "POST" }),
};

export const pesos = (n) =>
  "$" + Number(n).toLocaleString("es-MX", { maximumFractionDigits: 0 });

export const fecha = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
