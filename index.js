const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "joyas",
  allowExitOnIdle: true,
});

app.use(cors());
app.use(express.json());

const reporteRutas = (req, res, next) => {
  const url = req.url;
  const metodo = req.method;
  console.log(`[REPORTE] Hoy se hizo una consulta ${metodo} a la ruta: ${url}`);
  next();
};
app.use(reporteRutas);

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((j) => {
    return {
      name: j.nombre,
      href: `/joyas/joya/${j.id}`,
    };
  });
  const totalJoyas = joyas.length;
  const stockTotal = joyas.reduce((acc, j) => acc + j.stock, 0);
  return { totalJoyas, stockTotal, results };
};

app.get("/joyas", async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;

    const [campo, direccion] = order_by.split("_");

    const offset = (page - 1) * limits;

    const consulta = `SELECT * FROM inventario ORDER BY ${campo} ${direccion} LIMIT $1 OFFSET $2`;
    const { rows: joyas } = await pool.query(consulta, [limits, offset]);

    const HATEOAS = prepararHATEOAS(joyas);
    res.json(HATEOAS);
  } catch (error) {
    console.error("Error al obtener las joyas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/joyas/filtros", async (req, res) => {
  try {
    const { precio_max, precio_min, categoria, metal } = req.query;

    let filtros = [];
    const values = [];

    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = values;
      filtros.push(`${campo} ${comparador} $${length}`);
    };

    if (precio_max) agregarFiltro("precio", "<=", precio_max);
    if (precio_min) agregarFiltro("precio", ">=", precio_min);
    if (categoria) agregarFiltro("categoria", "=", categoria);
    if (metal) agregarFiltro("metal", "=", metal);

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      consulta += ` WHERE ${filtros.join(" AND ")}`;
    }

    const { rows: joyas } = await pool.query(consulta, values);
    res.json(joyas);
  } catch (error) {
    console.error("Error al filtrar las joyas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`¡Servidor encendido en el puerto ${PORT}!`);
});
