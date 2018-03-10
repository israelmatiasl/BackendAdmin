'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// Cargar rutas
var home_routes = require('./routes/home.route');
var user_routes = require('./routes/user.route');
var account_routes = require('./routes/account.route')


// Cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Cors



// Rutas
app.use('/api', home_routes);
app.use('/api', user_routes);
app.use('/api', account_routes);



// Exportar
module.exports = app;