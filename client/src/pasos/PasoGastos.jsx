import { useEffect, useState } from "react";
import { api, pesos } from "../api.js";

// RF-03: Cotizacion de gastos en el destino
function Grupo({ titulo, opciones, valor, onElegir, calcular, unidad }) {
  return (
    <>
      <h2 className="sub">{titulo}</h2>
      <div className="opciones compactas">
        {opciones.map((o) => (
          <label key={o.id} className={valor === o.id ? "opcion elegida" : "opcion"}>
            <input type="radio" checked={valor === o.id} onChange={() => onElegir(o.id)} />
            <div className="opcion-info">
              <strong>{o.nombre}</strong>
              <span>{o.detalle}. {pesos(o.precioDia ?? o.precio)} {unidad}</span>
            </div>
            <div className="opcion-precio"><strong>{pesos(calcular(o))}</strong></div>
          </label>
        ))}
      </div>
    </>
  );
}

export default function PasoGastos({ solicitud, sel, setSel, onAtras, onSiguiente }) {
  const [g, setG] = useState(null);

  useEffect(() => {
    api.gastos(solicitud.destino).then(setG);
  }, [solicitud.destino]);

  if (!g) return <p>Cargando gastos...</p>;
  const { viajeros: n, dias } = solicitud;

  function alternarActividad(id) {
    const ya = sel.actividades.includes(id);
    setSel({ ...sel, actividades: ya ? sel.actividades.filter((x) => x !== id) : [...sel.actividades, id] });
  }

  return (
    <div>
      <h1>Gastos en el destino</h1>
      <p className="intro">Se calculan para {n} viajeros durante {dias} días.</p>

      <Grupo titulo="Transporte local" opciones={g.transporte} valor={sel.transporteId}
        onElegir={(id) => setSel({ ...sel, transporteId: id })}
        calcular={(o) => o.precioDia * dias * n} unidad="por persona al día" />

      <Grupo titulo="Alimentos" opciones={g.alimentos} valor={sel.alimentosId}
        onElegir={(id) => setSel({ ...sel, alimentosId: id })}
        calcular={(o) => o.precioDia * dias * n} unidad="por persona al día" />

      <h2 className="sub">Actividades</h2>
      <div className="opciones compactas">
        {g.actividades.map((a) => (
          <label key={a.id} className={sel.actividades.includes(a.id) ? "opcion elegida" : "opcion"}>
            <input type="checkbox" checked={sel.actividades.includes(a.id)} onChange={() => alternarActividad(a.id)} />
            <div className="opcion-info">
              <strong>{a.nombre}</strong>
              <span>{pesos(a.precio)} por persona</span>
            </div>
            <div className="opcion-precio"><strong>{pesos(a.precio * n)}</strong></div>
          </label>
        ))}
      </div>

      <Grupo titulo="Telefonía" opciones={g.telefonia} valor={sel.telefoniaId}
        onElegir={(id) => setSel({ ...sel, telefoniaId: id })}
        calcular={(o) => o.precio * n} unidad="por persona" />

      <div className="acciones">
        <button className="btn-secundario" onClick={onAtras}>Regresar</button>
        <button className="btn-principal" onClick={onSiguiente}>Calcular presupuesto</button>
      </div>
    </div>
  );
}
