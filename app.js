'use strict'

// Requires
var express = require('express');

// Inicializar variables
var app = express();


// Cargar rutas
var home_routes = require('./routes/home.route');


// Cargar middlewares



// Cors



// Rutas
app.use('/api', home_routes);
// app.get('/', (req, res, next) => {

//     res.status(200).json({ ok: true, message: 'Petición correcta' });
// });


// Exportar
module.exports = app;