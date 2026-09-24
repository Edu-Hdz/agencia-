import { useState } from "react";
import { api, pesos, fecha } from "../api.js";

// RF-05: Calculo y entrega del presupuesto
export default function PasoPresupuesto({ presupuesto: p, onEditar, onNueva }) {
  const [mensaje, setMensaje] = useState("");

  async function enviar() {
    const r = await api.enviar(p.folio);
    setMensaje(r.mensaje);
  }

  const grupos = [...new Set(p.conceptos.map((c) => c.grupo))];

  return (
    <div>
      <div className="no-imprimir encabezado-presupuesto">
        <div>
          <h1>Presupuesto listo</h1>
          <p className="intro">Revísalo con el cliente. Puedes descargarlo en PDF o enviarlo a su correo.</p>
        </div>
        <div className="botones">
          <button className="btn-secundario" onClick={onEditar}>Cambiar opciones</button>
          <button className="btn-secundario" onClick={() => window.print()}>Descargar PDF</button>
          <button className="btn-principal" onClick={enviar}>Enviar por correo</button>
        </div>
      </div>
      {mensaje && <p className="aviso-ok no-imprimir" role="status">{mensaje}</p>}

      <article className="boleto">
        <header className="boleto-cabeza">
          <div>
            <span className="boleto-ruta">{p.origen} a {p.destino}</span>
            <span className="boleto-fechas">{fecha(p.salida)} al {fecha(p.regreso)}</span>
          </div>
          <div className="boleto-folio">
            <span>Folio</span>
            <strong>{p.folio}</strong>
          </div>
        </header>

        <div className="boleto-datos">
          <div><span>Cliente</span><strong>{p.cliente}</strong></div>
          <div><span>Viajeros</span><strong>{p.viajeros}</strong></div>
          <div><span>Estancia</span><strong>{p.dias} días, {p.noches} noches</strong></div>
          <div><span>Válido hasta</span><strong>{fecha(p.vigencia)}</strong></div>
        </div>

        <table className="desglose">
          <thead>
            <tr><th>Concepto</th><th>Cálculo</th><th className="num">Importe</th></tr>
          </thead>
          {grupos.map((gr) => (
            <tbody key={gr}>
              <tr className="grupo"><td colSpan="3">{gr}</td></tr>
              {p.conceptos.filter((c) => c.grupo === gr).map((c, i) => (
                <tr key={i}>
                  <td>{c.concepto}</td>
                  <td className="calculo">{c.detalle}</td>
                  <td className="num">{pesos(c.importe)}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>

        <div className="perforado" aria-hidden />

        <footer className="boleto-totales">
          <div className="linea"><span>Subtotal</span><span>{pesos(p.subtotal)}</span></div>
          <div className="linea"><span>Imprevistos ({p.porcentajeImprevistos}%)</span><span>{pesos(p.imprevistos)}</span></div>
          <div className="total">
            <div>
              <span>Total del viaje</span>
              <strong>{pesos(p.total)}</strong>
            </div>
            <div className="por-persona">
              <span>Por persona</span>
              <strong>{pesos(p.porPersona)}</strong>
            </div>
          </div>
        </footer>
      </article>

      <div className="acciones no-imprimir">
        <span />
        <button className="btn-secundario" onClick={onNueva}>Nueva cotización</button>
      </div>
    </div>
  );
}
