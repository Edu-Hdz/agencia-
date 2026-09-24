const express = require("express");
const cors = require("cors");
const path = require("path");
const cat = require("./data/catalogo");

const app = express();
app.use(cors());
app.use(express.json());

// En el prototipo los datos se guardan en memoria.
// Al reiniciar el servidor se borran las solicitudes y presupuestos.
const solicitudes = [];
const presupuestos = [];
let contador = 0;

const MS_DIA = 24 * 60 * 60 * 1000;

function buscar(lista, id) {
  return lista.find((x) => x.id === id);
}

// ---------- Catalogos ----------
app.get("/api/catalogo", (req, res) => {
  res.json({ origenes: cat.origenes, destinos: cat.destinos });
});

// ---------- RF-01: Registro de la solicitud de viaje ----------
app.post("/api/solicitudes", (req, res) => {
  const { nombre, correo, origen, destino, salida, regreso, viajeros } = req.body;
  const errores = [];

  if (!nombre || !nombre.trim()) errores.push("Escribe el nombre del cliente.");
  if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.push("Escribe un correo válido.");
  if (!buscar(cat.origenes, origen)) errores.push("Elige la ciudad de origen.");
  if (!buscar(cat.destinos, destino)) errores.push("Elige un destino del catálogo.");
  if (!salida || !regreso) errores.push("Indica la fecha de salida y la de regreso.");

  const fSalida = new Date(salida + "T00:00:00");
  const fRegreso = new Date(regreso + "T00:00:00");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (salida && fSalida < hoy) errores.push("La fecha de salida no puede ser anterior a hoy.");
  if (salida && regreso && fRegreso <= fSalida) errores.push("La fecha de regreso debe ser posterior a la de salida.");

  const n = Number(viajeros);
  if (!Number.isInteger(n) || n < 1 || n > 20) errores.push("El número de viajeros debe estar entre 1 y 20.");

  if (errores.length) return res.status(400).json({ errores });

  const noches = Math.round((fRegreso - fSalida) / MS_DIA);
  contador++;
  const solicitud = {
    folio: `COT-${new Date().getFullYear()}-${String(contador).padStart(4, "0")}`,
    nombre: nombre.trim(),
    correo,
    origen,
    destino,
    salida,
    regreso,
    viajeros: n,
    noches,
    dias: noches + 1,
    fecha: new Date().toISOString(),
  };
  solicitudes.push(solicitud);
  res.status(201).json(solicitud);
});

app.get("/api/solicitudes/:folio", (req, res) => {
  const s = solicitudes.find((x) => x.folio === req.params.folio);
  if (!s) return res.status(404).json({ errores: ["No existe una solicitud con ese folio."] });
  res.json(s);
});

// ---------- RF-02: Vuelos y hospedaje ----------
app.get("/api/vuelos", (req, res) => {
  const origen = buscar(cat.origenes, req.query.origen);
  const recargo = origen ? origen.recargo : 0;
  const lista = cat.vuelos
    .filter((v) => v.destino === req.query.destino)
    .map((v) => ({ ...v, precio: v.precio + recargo }))
    .sort((a, b) => a.precio - b.precio);
  res.json(lista);
});

app.get("/api/hospedajes", (req, res) => {
  const lista = cat.hospedajes
    .filter((h) => h.destino === req.query.destino)
    .sort((a, b) => a.precio - b.precio);
  res.json(lista);
});

// ---------- RF-03: Gastos en el destino ----------
app.get("/api/gastos/:destino", (req, res) => {
  res.json({
    transporte: cat.transporte,
    alimentos: cat.alimentos,
    telefonia: cat.telefonia,
    actividades: cat.actividades.filter((a) => a.destino === req.params.destino),
  });
});

// ---------- RF-04: Documentos y requisitos ----------
app.get("/api/requisitos/:destino", (req, res) => {
  const d = buscar(cat.destinos, req.params.destino);
  if (!d) return res.status(404).json({ errores: ["Destino no encontrado."] });
  res.json({ pais: d.pais, requisitos: cat.requisitos });
});

// ---------- RF-05: Calculo y entrega del presupuesto ----------
function calcular(s, sel) {
  const origen = buscar(cat.origenes, s.origen);
  const vuelo = buscar(cat.vuelos, sel.vueloId);
  const hosp = buscar(cat.hospedajes, sel.hospedajeId);
  if (!vuelo || !hosp) return { errores: ["Falta elegir el vuelo y el hospedaje."] };

  const unidades = Math.max(Number(sel.unidades) || 0, Math.ceil(s.viajeros / hosp.capacidad));
  const conceptos = [];
  const agregar = (grupo, concepto, detalle, importe) => {
    if (importe > 0) conceptos.push({ grupo, concepto, detalle, importe });
  };

  const precioVuelo = vuelo.precio + origen.recargo;
  agregar("Vuelos", `${vuelo.aerolinea}, ${vuelo.escalas === 0 ? "directo" : vuelo.escalas + " escala"}`,
    `$${precioVuelo.toLocaleString("es-MX")} × ${s.viajeros} viajeros`, precioVuelo * s.viajeros);

  agregar("Hospedaje", hosp.nombre,
    `$${hosp.precio.toLocaleString("es-MX")} × ${s.noches} noches × ${unidades} ${hosp.tipo === "Departamento" ? "departamento(s)" : "habitación(es)"}`,
    hosp.precio * s.noches * unidades);

  const t = buscar(cat.transporte, sel.transporteId);
  if (t) agregar("Transporte local", t.nombre, `$${t.precioDia} × ${s.dias} días × ${s.viajeros} viajeros`, t.precioDia * s.dias * s.viajeros);

  const a = buscar(cat.alimentos, sel.alimentosId);
  if (a) agregar("Alimentos", `Nivel ${a.nombre.toLowerCase()}`, `$${a.precioDia} × ${s.dias} días × ${s.viajeros} viajeros`, a.precioDia * s.dias * s.viajeros);

  (sel.actividades || []).forEach((id) => {
    const ac = buscar(cat.actividades, id);
    if (ac) agregar("Actividades", ac.nombre, `$${ac.precio} × ${s.viajeros} viajeros`, ac.precio * s.viajeros);
  });

  const tel = buscar(cat.telefonia, sel.telefoniaId);
  if (tel) agregar("Telefonía", tel.nombre, `$${tel.precio} × ${s.viajeros} viajeros`, tel.precio * s.viajeros);

  const sinPasaporte = Math.min(Math.max(Number(sel.sinPasaporte) || 0, 0), s.viajeros);
  const pas = buscar(cat.requisitos, "PAS");
  agregar("Documentos", "Trámite de pasaporte", `$${pas.precio.toLocaleString("es-MX")} × ${sinPasaporte} viajeros`, pas.precio * sinPasaporte);
  if (sel.seguro) {
    const seg = buscar(cat.requisitos, "SEG");
    agregar("Documentos", "Seguro de viaje", `$${seg.precio.toLocaleString("es-MX")} × ${s.viajeros} viajeros`, seg.precio * s.viajeros);
  }

  const subtotal = conceptos.reduce((acc, c) => acc + c.importe, 0);
  const imprevistos = Math.round(subtotal * cat.IMPREVISTOS);
  const total = subtotal + imprevistos;
  const vigencia = new Date(Date.now() + cat.VIGENCIA_DIAS * MS_DIA);

  return {
    folio: s.folio,
    cliente: s.nombre,
    correo: s.correo,
    origen: origen.nombre,
    destino: buscar(cat.destinos, s.destino).nombre,
    salida: s.salida,
    regreso: s.regreso,
    viajeros: s.viajeros,
    noches: s.noches,
    dias: s.dias,
    conceptos,
    subtotal,
    porcentajeImprevistos: cat.IMPREVISTOS * 100,
    imprevistos,
    total,
    porPersona: Math.round(total / s.viajeros),
    vigencia: vigencia.toISOString().slice(0, 10),
    creado: new Date().toISOString(),
    enviado: false,
  };
}

app.post("/api/presupuestos", (req, res) => {
  const s = solicitudes.find((x) => x.folio === req.body.folio);
  if (!s) return res.status(404).json({ errores: ["No existe una solicitud con ese folio."] });

  const p = calcular(s, req.body);
  if (p.errores) return res.status(400).json(p);

  const i = presupuestos.findIndex((x) => x.folio === p.folio);
  if (i >= 0) presupuestos[i] = p;
  else presupuestos.push(p);
  res.status(201).json(p);
});

app.get("/api/presupuestos", (req, res) => {
  res.json([...presupuestos].reverse());
});

// Envio por correo: en el prototipo solo se simula
app.post("/api/presupuestos/:folio/enviar", (req, res) => {
  const p = presupuestos.find((x) => x.folio === req.params.folio);
  if (!p) return res.status(404).json({ errores: ["No existe ese presupuesto."] });
  p.enviado = true;
  res.json({ mensaje: `Presupuesto enviado a ${p.correo}` });
});

// Si existe la version compilada del cliente, el servidor tambien la muestra
const dist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(dist));
app.get(/^\/(?!api).*/, (req, res, next) => {
  res.sendFile(path.join(dist, "index.html"), (err) => err && next());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
