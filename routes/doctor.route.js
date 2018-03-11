'use strict'

var express = require('express');
var doctorController = require('../controllers/doctor.controller');

var auth = require('../middlewares/authentication');

var api = express.Router();

//  =====================================
//  RUTAS DE LOS MÉDICOS
//  =====================================
api.get('/doctors', auth.tokenVerification, doctorController.getDoctors);
api.get('/doctor/:id', auth.tokenVerification, doctorController.getDoctors);
api.post('/doctor', auth.tokenVerification, doctorController.saveDoctor);
api.put('/doctor/:id', auth.tokenVerification, doctorController.updateDoctor);
api.delete('/doctor/:id', auth.tokenVerification, doctorController.deleteDoctor);

module.exports = api;