# Desafio API REST - Tienda de Joyas 💎

En este repositorio encontrarás el esarrollo de una API REST para el inventario de la tienda "My Precious Spa". Construida con Node.js, Express y PostgreSQL, implementando paginación, ordenamiento, filtrado dinámico y estructura de datos HATEOAS.

## 🗄️ Configuración de la Base de Datos

Para evaluar este proyecto, debes crear la base de datos localmente.

1. Abre tu terminal de PostgreSQL (`psql`).
2. Ejecuta los siguientes comandos:

```
CREATE DATABASE joyas;
\c joyas;

CREATE TABLE inventario (id SERIAL, nombre VARCHAR(50), categoria VARCHAR(50), metal VARCHAR(50), precio INT, stock INT);

INSERT INTO inventario values
(DEFAULT, 'Collar Heart', 'collar', 'oro', 20000, 2),
(DEFAULT, 'Collar History', 'collar', 'plata', 15000, 5),
(DEFAULT, 'Aros Berry', 'aros', 'oro', 12000, 10),
(DEFAULT, 'Aros Hook Blue', 'aros', 'oro', 25000, 4),
(DEFAULT, 'Anillo Wish', 'aros', 'plata', 30000, 4),
(DEFAULT, 'Anillo Cuarzo Greece', 'anillo', 'oro', 40000, 2);
```

## ⚙️ Configuración y Ejecución del Servidor  

Navega a la carpeta backend e instala las dependencias:  

``` 
cd backend
npm install
```
¡IMPORTANTE! En el archivo backend/index.js, actualiza la configuración del pool de PostgreSQL con tu contraseña local.  

``` 
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'TU_PASSWORD_AQUI',
  database: 'joyas',
  allowExitOnIdle: true
});
``` 

Enciende el servidor:  

```
node index.js
```

### 🚀 Endpoints Disponibles  

- Inventario con HATEOAS, paginación y ordenamiento:  
GET http://localhost:3000/joyas?limits=3&page=2&order_by=stock_ASC

- Filtrado dinámico por precio, categoría y metal:
GET http://localhost:3000/joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata
