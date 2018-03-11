'use strict'

var express = require('express');
var uploadController = require('../controllers/upload.controller');

var auth = require('../middlewares/authentication');

var api = express.Router();

//  =====================================
//  RUTAS DE LOS USUARIOS
//  =====================================
api.put('/collections/:collection/:id', uploadController.uploadImage);
api.put('/user/:id', uploadController.uploadUserImage);
api.put('/hospital/:id', uploadController.uploadHospitalImage);
api.put('/doctor/:id', uploadController.uploadDoctorImage);

module.exports = api;