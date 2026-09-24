// Catalogo de precios del prototipo.
// Los precios son de referencia (en pesos mexicanos) y salen de la
// investigacion que hicimos al planear el viaje. En una version futura
// se podrian consultar directamente con los proveedores.

const origenes = [
  { id: "CDMX", nombre: "Ciudad de México", recargo: 0 },
  { id: "GDL", nombre: "Guadalajara", recargo: 1800 },
  { id: "MTY", nombre: "Monterrey", recargo: 2100 },
];

const destinos = [
  { id: "PAR", nombre: "París", pais: "Francia" },
  { id: "MAD", nombre: "Madrid", pais: "España" },
  { id: "ROM", nombre: "Roma", pais: "Italia" },
];

// precio = boleto redondo por persona saliendo de CDMX
const vuelos = [
  { id: "V1", destino: "PAR", aerolinea: "Air France", salida: "18:40", duracion: "11 h 05 min", escalas: 0, precio: 24500 },
  { id: "V2", destino: "PAR", aerolinea: "Aeroméxico", salida: "21:15", duracion: "11 h 20 min", escalas: 0, precio: 26800 },
  { id: "V3", destino: "PAR", aerolinea: "Iberia", salida: "16:30", duracion: "14 h 10 min", escalas: 1, precio: 19900 },
  { id: "V4", destino: "PAR", aerolinea: "KLM", salida: "13:55", duracion: "15 h 30 min", escalas: 1, precio: 21300 },
  { id: "V5", destino: "MAD", aerolinea: "Iberia", salida: "20:05", duracion: "10 h 40 min", escalas: 0, precio: 21200 },
  { id: "V6", destino: "MAD", aerolinea: "Aeroméxico", salida: "22:30", duracion: "10 h 55 min", escalas: 0, precio: 22900 },
  { id: "V7", destino: "MAD", aerolinea: "Air Europa", salida: "15:20", duracion: "13 h 45 min", escalas: 1, precio: 18400 },
  { id: "V8", destino: "ROM", aerolinea: "ITA Airways", salida: "17:10", duracion: "12 h 50 min", escalas: 0, precio: 25700 },
  { id: "V9", destino: "ROM", aerolinea: "Iberia", salida: "16:30", duracion: "15 h 20 min", escalas: 1, precio: 20600 },
  { id: "V10", destino: "ROM", aerolinea: "Lufthansa", salida: "19:45", duracion: "16 h 05 min", escalas: 1, precio: 22100 },
];

// precio = por noche por unidad (habitacion o departamento)
const hospedajes = [
  { id: "H1", destino: "PAR", nombre: "Hostal Canal Saint-Martin", tipo: "Hostal", zona: "distrito 10", capacidad: 4, precio: 3200 },
  { id: "H2", destino: "PAR", nombre: "Hotel Rue Cler", tipo: "Hotel 3 estrellas", zona: "zona de la Torre Eiffel", capacidad: 2, precio: 3400 },
  { id: "H3", destino: "PAR", nombre: "Departamento Montmartre", tipo: "Departamento", zona: "Montmartre", capacidad: 6, precio: 7100 },
  { id: "H4", destino: "MAD", nombre: "Hostal Malasaña", tipo: "Hostal", zona: "Malasaña", capacidad: 4, precio: 2300 },
  { id: "H5", destino: "MAD", nombre: "Hotel Gran Vía Centro", tipo: "Hotel 3 estrellas", zona: "centro", capacidad: 2, precio: 2600 },
  { id: "H6", destino: "MAD", nombre: "Departamento La Latina", tipo: "Departamento", zona: "La Latina", capacidad: 6, precio: 5200 },
  { id: "H7", destino: "ROM", nombre: "Hostal Termini", tipo: "Hostal", zona: "junto a la estación Termini", capacidad: 4, precio: 2500 },
  { id: "H8", destino: "ROM", nombre: "Hotel Piazza Navona", tipo: "Hotel 3 estrellas", zona: "centro histórico", capacidad: 2, precio: 3100 },
  { id: "H9", destino: "ROM", nombre: "Departamento Trastevere", tipo: "Departamento", zona: "Trastevere", capacidad: 6, precio: 6300 },
];

// Gastos en destino (iguales para los tres destinos salvo las actividades)
const transporte = [
  { id: "T1", nombre: "Transporte público", detalle: "Metro y autobús", precioDia: 110 },
  { id: "T2", nombre: "Transporte público y taxis ocasionales", detalle: "Incluye traslados de noche", precioDia: 260 },
];

const alimentos = [
  { id: "A1", nombre: "Económico", detalle: "Supermercado y comida rápida", precioDia: 450 },
  { id: "A2", nombre: "Medio", detalle: "Cafeterías y restaurantes sencillos", precioDia: 850 },
  { id: "A3", nombre: "Alto", detalle: "Restaurantes todos los días", precioDia: 1500 },
];

const telefonia = [
  { id: "TEL0", nombre: "Sin plan", detalle: "Solo wifi", precio: 0 },
  { id: "TEL1", nombre: "eSIM 10 GB", detalle: "Datos para todo el viaje", precio: 350 },
  { id: "TEL2", nombre: "eSIM 20 GB", detalle: "Datos para todo el viaje", precio: 550 },
];

const actividades = [
  { id: "AC1", destino: "PAR", nombre: "Torre Eiffel (hasta la cima)", precio: 620 },
  { id: "AC2", destino: "PAR", nombre: "Museo del Louvre", precio: 440 },
  { id: "AC3", destino: "PAR", nombre: "Palacio de Versalles", precio: 420 },
  { id: "AC4", destino: "PAR", nombre: "Paseo en barco por el Sena", precio: 360 },
  { id: "AC5", destino: "PAR", nombre: "Arco del Triunfo", precio: 380 },
  { id: "AC6", destino: "MAD", nombre: "Museo del Prado", precio: 330 },
  { id: "AC7", destino: "MAD", nombre: "Palacio Real", precio: 300 },
  { id: "AC8", destino: "MAD", nombre: "Tour del estadio Santiago Bernabéu", precio: 560 },
  { id: "AC9", destino: "MAD", nombre: "Barca en el Parque del Retiro", precio: 120 },
  { id: "AC10", destino: "ROM", nombre: "Coliseo y Foro Romano", precio: 360 },
  { id: "AC11", destino: "ROM", nombre: "Museos Vaticanos", precio: 500 },
  { id: "AC12", destino: "ROM", nombre: "Galería Borghese", precio: 380 },
  { id: "AC13", destino: "ROM", nombre: "Recorrido a pie por Trastevere", precio: 450 },
];

// Documentos de viaje (mismos requisitos para Francia, España e Italia)
const requisitos = [
  { id: "PAS", nombre: "Pasaporte mexicano vigente", detalle: "Debe estar vigente durante todo el viaje", obligatorio: true, precio: 2350, porViajeroSinDocumento: true },
  { id: "SEG", nombre: "Seguro de viaje", detalle: "Gastos médicos durante la estancia", obligatorio: false, precio: 1200, porViajeroSinDocumento: false },
];

const IMPREVISTOS = 0.1; // 10 % sobre el subtotal
const VIGENCIA_DIAS = 7;

module.exports = {
  origenes, destinos, vuelos, hospedajes, transporte, alimentos,
  telefonia, actividades, requisitos, IMPREVISTOS, VIGENCIA_DIAS,
};
