# Sistema de Cotización de Viajes

Prototipo del proyecto de Ingeniería de Software (Grupo 1552, Equipo 6, FES Acatlán).

El sistema ayuda a un agente de viajes a elaborar el presupuesto de un viaje a partir de la solicitud de un cliente. Considera vuelos, hospedaje, transporte local, alimentos, actividades, telefonía y documentos de viaje.

## Tecnologías

- **React** (con Vite) para las pantallas.
- **Node.js con Express** para el servidor y los cálculos del presupuesto.

## Cómo ejecutarlo

Se necesita tener instalado Node.js 18 o superior.

```bash
npm run instalar   # instala dependencias de la raíz, el servidor y el cliente
npm run dev        # levanta el servidor (puerto 3001) y el cliente (puerto 5173)
```

Después abrir http://localhost:5173 en el navegador.

## Flujo del sistema

| Paso | Pantalla | Requerimiento |
|------|----------|---------------|
| 1 | Solicitud del cliente | RF-01 Registro de la solicitud de viaje |
| 2 | Documentos y requisitos | RF-04 Documentos y requisitos de viaje |
| 3 | Vuelo y hospedaje | RF-02 Cotización de vuelos y hospedaje |
| 4 | Gastos en destino | RF-03 Cotización de gastos en el destino |
| 5 | Presupuesto | RF-05 Cálculo y entrega del presupuesto |

También hay una pantalla de **Historial de presupuestos** para que el gerente de la agencia consulte los presupuestos generados.

## Estructura

```
client/            Aplicación en React
  src/pasos/       Una pantalla por cada paso de la cotización
  src/api.js       Llamadas al servidor
server/
  index.js         Rutas de la API y cálculo del presupuesto
  data/catalogo.js Precios de referencia (vuelos, hoteles, gastos, requisitos)
```

## Notas del prototipo

- Los precios son de referencia y están guardados en `server/data/catalogo.js`.
- Las solicitudes y presupuestos se guardan en memoria; se borran al reiniciar el servidor.
- El botón "Descargar PDF" usa la opción de imprimir del navegador (Guardar como PDF).
- El envío por correo es simulado.
