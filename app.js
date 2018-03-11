'use strict'

// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// Cargar rutas
var home_routes = require('./routes/home.route');
var user_routes = require('./routes/user.route');
var account_routes = require('./routes/account.route');
var hospital_routes = require('./routes/hospital.route');
var doctor_routes = require('./routes/doctor.route');
var search_routes = require('./routes/search.route');
var upload_routes = require('./routes/upload.route');
var image_routes = require('./routes/image.route');


// Cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());


// Cors



// Rutas
app.use('/api', home_routes);
app.use('/api', user_routes);
app.use('/api', account_routes);
app.use('/api', hospital_routes);
app.use('/api', doctor_routes);

app.use('/api/search', search_routes);
app.use('/api/upload', upload_routes);
app.use('/api/image', image_routes);



// Exportar
module.exports = app;