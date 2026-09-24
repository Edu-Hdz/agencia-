import { useState } from "react";
import { api } from "../api.js";

// RF-01: Registro de la solicitud de viaje
export default function PasoSolicitud({ catalogo, onListo, onError }) {
  const [datos, setDatos] = useState({
    nombre: "", correo: "", origen: "CDMX", destino: "", salida: "", regreso: "", viajeros: 1,
  });
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    onError([]);
  };

  async function registrar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      const s = await api.crearSolicitud({ ...datos, viajeros: Number(datos.viajeros) });
      onListo(s);
    } catch (err) {
      onError(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={registrar} noValidate>
      <h1>Nueva solicitud de viaje</h1>
      <p className="intro">Captura los datos que da el cliente. Con ellos se calcula todo el presupuesto.</p>

      <fieldset>
        <legend>Datos del cliente</legend>
        <div className="campos dos">
          <label>Nombre completo
            <input name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej. Ana López" />
          </label>
          <label>Correo electrónico
            <input name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ana@correo.com" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Datos del viaje</legend>
        <div className="campos dos">
          <label>Ciudad de origen
            <select name="origen" value={datos.origen} onChange={cambiar}>
              {catalogo?.origenes.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
            </select>
          </label>
          <label>Destino
            <select name="destino" value={datos.destino} onChange={cambiar}>
              <option value="">Elige un destino</option>
              {catalogo?.destinos.map((d) => <option key={d.id} value={d.id}>{d.nombre}, {d.pais}</option>)}
            </select>
          </label>
          <label>Fecha de salida
            <input name="salida" type="date" value={datos.salida} onChange={cambiar} />
          </label>
          <label>Fecha de regreso
            <input name="regreso" type="date" value={datos.regreso} onChange={cambiar} />
          </label>
          <label>Número de viajeros
            <input name="viajeros" type="number" min="1" max="20" value={datos.viajeros} onChange={cambiar} />
          </label>
        </div>
      </fieldset>

      <div className="acciones">
        <span />
        <button className="btn-principal" disabled={enviando || !catalogo}>
          {enviando ? "Registrando..." : "Registrar solicitud"}
        </button>
      </div>
    </form>
  );
}
