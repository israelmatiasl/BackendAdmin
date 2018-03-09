'use strict'

var express = require('express');

var api = express.Router();

api.get('/home', (req, res) => { res.status(200).send({ message: 'Home controller' }) });

module.exports = api;