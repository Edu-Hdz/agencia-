import { useEffect, useState } from "react";
import { api, fecha } from "./api.js";
import PasoSolicitud from "./pasos/PasoSolicitud.jsx";
import PasoDocumentos from "./pasos/PasoDocumentos.jsx";
import PasoVueloHospedaje from "./pasos/PasoVueloHospedaje.jsx";
import PasoGastos from "./pasos/PasoGastos.jsx";
import PasoPresupuesto from "./pasos/PasoPresupuesto.jsx";
import Historial from "./Historial.jsx";

const PASOS = ["Solicitud", "Documentos", "Vuelo y hospedaje", "Gastos en destino", "Presupuesto"];

const seleccionInicial = {
  sinPasaporte: 0,
  seguro: true,
  vueloId: "",
  hospedajeId: "",
  unidades: 1,
  transporteId: "T1",
  alimentosId: "A2",
  actividades: [],
  telefoniaId: "TEL1",
};

export default function App() {
  const [vista, setVista] = useState("cotizar");
  const [catalogo, setCatalogo] = useState(null);
  const [paso, setPaso] = useState(1);
  const [solicitud, setSolicitud] = useState(null);
  const [sel, setSel] = useState(seleccionInicial);
  const [presupuesto, setPresupuesto] = useState(null);
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    api.catalogo().then(setCatalogo).catch(() => setErrores(["No se pudo conectar con el servidor. Revisa que esté encendido en el puerto 3001."]));
  }, []);

  function nuevaCotizacion() {
    setSolicitud(null);
    setSel(seleccionInicial);
    setPresupuesto(null);
    setErrores([]);
    setPaso(1);
    setVista("cotizar");
  }

  async function generarPresupuesto() {
    try {
      setErrores([]);
      const p = await api.crearPresupuesto({ folio: solicitud.folio, ...sel });
      setPresupuesto(p);
      setPaso(5);
    } catch (e) {
      setErrores(e);
    }
  }

  const nombreDe = (lista, id) => lista?.find((x) => x.id === id)?.nombre || "";

  return (
    <div className="app">
      <header className="barra">
        <div className="barra-dentro">
          <button className="marca" onClick={nuevaCotizacion}>
            <span className="marca-icono" aria-hidden>✈</span>
            Cotizador de Viajes
          </button>
          <nav>
            <button className={vista === "cotizar" ? "activo" : ""} onClick={() => setVista("cotizar")}>Cotizar viaje</button>
            <button className={vista === "historial" ? "activo" : ""} onClick={() => setVista("historial")}>Historial de presupuestos</button>
          </nav>
        </div>
      </header>

      <main className="contenido">
        {vista === "historial" ? (
          <Historial />
        ) : (
          <>
            <ol className="pasos" aria-label="Pasos de la cotización">
              {PASOS.map((nombre, i) => {
                const n = i + 1;
                const estado = n < paso ? "hecho" : n === paso ? "actual" : "";
                return (
                  <li key={nombre} className={estado}>
                    <span className="pasos-num">{n < paso ? "✓" : n}</span>
                    <span className="pasos-nombre">{nombre}</span>
                  </li>
                );
              })}
            </ol>

            {errores.length > 0 && (
              <div className="aviso-error" role="alert">
                {errores.map((e) => <p key={e}>{e}</p>)}
              </div>
            )}

            <div className={paso === 5 ? "rejilla rejilla-completa" : "rejilla"}>
              <section className="panel">
                {paso === 1 && (
                  <PasoSolicitud
                    catalogo={catalogo}
                    onListo={(s) => { setSolicitud(s); setErrores([]); setPaso(2); }}
                    onError={setErrores}
                  />
                )}
                {paso === 2 && (
                  <PasoDocumentos solicitud={solicitud} sel={sel} setSel={setSel}
                    onAtras={() => setPaso(1)} onSiguiente={() => setPaso(3)} />
                )}
                {paso === 3 && (
                  <PasoVueloHospedaje solicitud={solicitud} sel={sel} setSel={setSel}
                    onAtras={() => setPaso(2)} onSiguiente={() => setPaso(4)} />
                )}
                {paso === 4 && (
                  <PasoGastos solicitud={solicitud} sel={sel} setSel={setSel}
                    onAtras={() => setPaso(3)} onSiguiente={generarPresupuesto} />
                )}
                {paso === 5 && presupuesto && (
                  <PasoPresupuesto presupuesto={presupuesto}
                    onEditar={() => setPaso(4)} onNueva={nuevaCotizacion} />
                )}
              </section>

              {paso < 5 && (
                <aside className="resumen">
                  <h2>Resumen del viaje</h2>
                  {!solicitud ? (
                    <p className="resumen-vacio">Captura los datos del cliente para empezar la cotización.</p>
                  ) : (
                    <dl>
                      <div><dt>Folio</dt><dd className="folio">{solicitud.folio}</dd></div>
                      <div><dt>Cliente</dt><dd>{solicitud.nombre}</dd></div>
                      <div>
                        <dt>Ruta</dt>
                        <dd>{nombreDe(catalogo?.origenes, solicitud.origen)} a {nombreDe(catalogo?.destinos, solicitud.destino)}</dd>
                      </div>
                      <div><dt>Salida</dt><dd>{fecha(solicitud.salida)}</dd></div>
                      <div><dt>Regreso</dt><dd>{fecha(solicitud.regreso)}</dd></div>
                      <div><dt>Viajeros</dt><dd>{solicitud.viajeros}</dd></div>
                      <div><dt>Estancia</dt><dd>{solicitud.dias} días, {solicitud.noches} noches</dd></div>
                    </dl>
                  )}
                </aside>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="pie">
        Proyecto académico de Ingeniería de Software, Equipo 6. Precios de referencia; el envío de correo es simulado.
      </footer>
    </div>
  );
}
