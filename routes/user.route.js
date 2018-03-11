'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');

var auth = require('../middlewares/authentication');

var api = express.Router();

//  =====================================
//  RUTAS DE LOS USUARIOS
//  =====================================
api.get('/users', auth.tokenVerification, userController.getUsers);
//api.get('/users', userController.getUsers);
api.get('/user/:id', auth.tokenVerification, userController.getUser);
api.post('/user', auth.tokenVerification, userController.saveUser);
api.put('/user/:id', auth.tokenVerification, userController.updateUser);
api.delete('/user/:id', auth.tokenVerification, userController.deleteUser);

module.exports = api;