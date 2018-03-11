'use strict'

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

var fs = require('fs');
var path = require('path');



//  =====================================
//  OBTENER IMAGEN - NOMBRE IMAGEN
//  =====================================
function getImagesByName(req, res) {

    var collection = req.params.collection;
    var image = req.params.img;
    var validCollection = ['user', 'hospital', 'doctor'];

    if (validCollection.indexOf(collection) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Las colecciones permitidas son: user, hospital y doctor',
            errors: { message: 'Tipo de tabla/colección no válido' }
        });
    }

    var pathImage = `./uploads/${collection}s/${image}`;

    fs.exists(pathImage, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathImage));
        } else {
            res.status(404).send({
                ok: false,
                message: 'La imagen no existe'
            });
        }
    });

}



//  =====================================
//  OBTENER IMAGEN - ID COLECCIÓN
//  =====================================
function getImagesByCollectionId(req, res) {

    var collection = req.params.collection;
    var Id = req.params.id;
    var validCollection = ['user', 'hospital', 'doctor'];

    if (validCollection.indexOf(collection) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Las colecciones permitidas son: user, hospital y doctor',
            errors: { message: 'Tipo de tabla/colección no válido' }
        });
    }


}



//  =====================================
//  EXPORTACIÓN DE FUNCIONES
//  =====================================
module.exports = {
    getImagesByName
}