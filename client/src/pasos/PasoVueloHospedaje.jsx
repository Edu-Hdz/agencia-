import { useEffect, useState } from "react";
import { api, pesos } from "../api.js";

// RF-02: Cotizacion de vuelos y hospedaje
export default function PasoVueloHospedaje({ solicitud, sel, setSel, onAtras, onSiguiente }) {
  const [vuelos, setVuelos] = useState([]);
  const [hospedajes, setHospedajes] = useState([]);

  useEffect(() => {
    api.vuelos(solicitud.origen, solicitud.destino).then(setVuelos);
    api.hospedajes(solicitud.destino).then(setHospedajes);
  }, [solicitud]);

  const n = solicitud.viajeros;
  const hosp = hospedajes.find((h) => h.id === sel.hospedajeId);
  const minimo = hosp ? Math.ceil(n / hosp.capacidad) : 1;

  function elegirHospedaje(h) {
    setSel({ ...sel, hospedajeId: h.id, unidades: Math.ceil(n / h.capacidad) });
  }

  return (
    <div>
      <h1>Vuelo y hospedaje</h1>
      <p className="intro">Las opciones están ordenadas de menor a mayor precio. Los totales ya consideran a los {n} viajeros.</p>

      <h2 className="sub">Vuelo redondo</h2>
      <div className="opciones">
        {vuelos.map((v) => (
          <label key={v.id} className={sel.vueloId === v.id ? "opcion elegida" : "opcion"}>
            <input type="radio" name="vuelo" checked={sel.vueloId === v.id} onChange={() => setSel({ ...sel, vueloId: v.id })} />
            <div className="opcion-info">
              <strong>{v.aerolinea}</strong>
              <span>Sale {v.salida} hrs, {v.duracion}, {v.escalas === 0 ? "directo" : `${v.escalas} escala`}</span>
            </div>
            <div className="opcion-precio">
              <span>{pesos(v.precio)} por persona</span>
              <strong>{pesos(v.precio * n)}</strong>
            </div>
          </label>
        ))}
      </div>

      <h2 className="sub">Hospedaje por {solicitud.noches} noches</h2>
      <div className="opciones">
        {hospedajes.map((h) => {
          const unidades = Math.ceil(n / h.capacidad);
          return (
            <label key={h.id} className={sel.hospedajeId === h.id ? "opcion elegida" : "opcion"}>
              <input type="radio" name="hospedaje" checked={sel.hospedajeId === h.id} onChange={() => elegirHospedaje(h)} />
              <div className="opcion-info">
                <strong>{h.nombre}</strong>
                <span>{h.tipo}, {h.zona}, hasta {h.capacidad} personas</span>
              </div>
              <div className="opcion-precio">
                <span>{pesos(h.precio)} por noche</span>
                <strong>{pesos(h.precio * solicitud.noches * unidades)}</strong>
              </div>
            </label>
          );
        })}
      </div>

      {hosp && (
        <label className="campo-corto">
          {hosp.tipo === "Departamento" ? "Departamentos necesarios" : "Habitaciones necesarias"} (mínimo {minimo})
          <input type="number" min={minimo} value={sel.unidades}
            onChange={(e) => setSel({ ...sel, unidades: Math.max(Number(e.target.value), minimo) })} />
        </label>
      )}

      <div className="acciones">
        <button className="btn-secundario" onClick={onAtras}>Regresar</button>
        <button className="btn-principal" disabled={!sel.vueloId || !sel.hospedajeId} onClick={onSiguiente}>
          Continuar a gastos en destino
        </button>
      </div>
    </div>
  );
}
