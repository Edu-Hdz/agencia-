import { useEffect, useState } from "react";
import { api, pesos } from "../api.js";

// RF-04: Documentos y requisitos de viaje
export default function PasoDocumentos({ solicitud, sel, setSel, onAtras, onSiguiente }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.requisitos(solicitud.destino).then(setInfo);
  }, [solicitud.destino]);

  if (!info) return <p>Cargando requisitos...</p>;
  const pas = info.requisitos.find((r) => r.id === "PAS");
  const seg = info.requisitos.find((r) => r.id === "SEG");

  return (
    <div>
      <h1>Documentos y requisitos de viaje</h1>
      <p className="intro">Para viajar a {info.pais} con pasaporte mexicano se necesita lo siguiente.</p>

      <ul className="lista-requisitos">
        {info.requisitos.map((r) => (
          <li key={r.id}>
            <div>
              <strong>{r.nombre}</strong>
              <span className={r.obligatorio ? "etiqueta obligatorio" : "etiqueta"}>{r.obligatorio ? "Obligatorio" : "Recomendado"}</span>
              <p>{r.detalle}</p>
            </div>
            <span className="precio">{pesos(r.precio)} <small>por persona</small></span>
          </li>
        ))}
      </ul>

      <fieldset>
        <legend>Trámites que hay que sumar al presupuesto</legend>
        <div className="campos dos">
          <label>¿Cuántos viajeros no tienen pasaporte vigente?
            <input type="number" min="0" max={solicitud.viajeros} value={sel.sinPasaporte}
              onChange={(e) => setSel({ ...sel, sinPasaporte: Math.min(Math.max(Number(e.target.value), 0), solicitud.viajeros) })} />
          </label>
          <label className="casilla">
            <input type="checkbox" checked={sel.seguro} onChange={(e) => setSel({ ...sel, seguro: e.target.checked })} />
            Incluir seguro de viaje para los {solicitud.viajeros} viajeros
          </label>
        </div>
      </fieldset>

      <p className="subtotal">
        Costo de documentos: <strong>{pesos(pas.precio * sel.sinPasaporte + (sel.seguro ? seg.precio * solicitud.viajeros : 0))}</strong>
      </p>

      <div className="acciones">
        <button className="btn-secundario" onClick={onAtras}>Regresar</button>
        <button className="btn-principal" onClick={onSiguiente}>Continuar a vuelo y hospedaje</button>
      </div>
    </div>
  );
}
