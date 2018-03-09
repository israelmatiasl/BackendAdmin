'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3200;


// Conexión a la base de datos

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/db_admin').then(
    () => {
        console.log('La conexión a la base de datos se ha realizado \x1b[32m%s\x1b[0m', 'correctamente');
        //Crear servidor
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:3800 \x1b[32m%s\x1b[0m', 'correctamente');
        });
    }
).catch(err => console.log(err));