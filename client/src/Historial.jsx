import { useEffect, useState } from "react";
import { api, pesos, fecha } from "./api.js";

// Consulta de presupuestos para el gerente de la agencia
export default function Historial() {
  const [lista, setLista] = useState(null);

  useEffect(() => {
    api.historial().then(setLista).catch(() => setLista([]));
  }, []);

  if (!lista) return <p>Cargando historial...</p>;

  return (
    <section className="panel">
      <h1>Historial de presupuestos</h1>
      <p className="intro">Todos los presupuestos generados en la agencia.</p>
      {lista.length === 0 ? (
        <p className="vacio">Todavía no hay presupuestos. Genera uno desde Cotizar viaje y aparecerá aquí.</p>
      ) : (
        <div className="tabla-scroll">
          <table className="historial">
            <thead>
              <tr>
                <th>Folio</th><th>Cliente</th><th>Destino</th><th>Salida</th>
                <th className="num">Viajeros</th><th className="num">Total</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.folio}>
                  <td className="folio">{p.folio}</td>
                  <td>{p.cliente}</td>
                  <td>{p.destino}</td>
                  <td>{fecha(p.salida)}</td>
                  <td className="num">{p.viajeros}</td>
                  <td className="num">{pesos(p.total)}</td>
                  <td><span className={p.enviado ? "etiqueta enviado" : "etiqueta"}>{p.enviado ? "Enviado" : "Generado"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
