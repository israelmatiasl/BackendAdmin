'use strict'

var express = require('express');
var imageController = require('../controllers/image.controller');

var auth = require('../middlewares/authentication');

var api = express.Router();

//  =====================================
//  RUTAS DE LOS USUARIOS
//  =====================================
api.get('/collections/:collection/:img', imageController.getImagesByName);

module.exports = api;