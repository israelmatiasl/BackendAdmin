'use strict'

var express = require('express');
var hospitalController = require('../controllers/hospital.controller');

var auth = require('../middlewares/authentication');

var api = express.Router();

//  =====================================
//  RUTAS DE LOS HOSPITALES
//  =====================================
api.get('/hospitals', auth.tokenVerification, hospitalController.getHospitals);
api.get('/hospital/:id', auth.tokenVerification, hospitalController.getHospital);
api.post('/hospital', auth.tokenVerification, hospitalController.saveHospital);
api.put('/hospital/:id', auth.tokenVerification, hospitalController.updateHospital);
api.delete('/hospital/:id', auth.tokenVerification, hospitalController.deleteHospital);

module.exports = api;