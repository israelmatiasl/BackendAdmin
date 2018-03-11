'use strict'

var express = require('express');
var accountController = require('../controllers/account.controller');

var api = express.Router();


//  =====================================
//  RUTAS DE LA CUENTA
//  =====================================
api.post('/login', accountController.login);
api.post('/login/google', accountController.loginGoogle);

module.exports = api;