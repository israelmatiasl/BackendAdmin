'use strict'

var express = require('express');
var searchController = require('../controllers/search.controller');

var auth = require('../middlewares/authentication');

var api = express.Router();

//  =====================================
//  RUTAS DE LOS USUARIOS
//  =====================================
api.get('/all/:word', searchController.searchGeneral);
api.get('/collections/:collection/:word', searchController.searchCollection);
api.get('/users/:word', searchController.searchJustUser);
api.get('/hospitals/:word', searchController.searchJustHospitals);
api.get('/doctors/:word', searchController.searchJustDoctors);

module.exports = api;