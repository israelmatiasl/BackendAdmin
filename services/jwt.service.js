'use strict'

var jwt = require('jsonwebtoken');
var secretKey = require('../helpers/constants').secretKey;
var expiredTime = 3600; //SEGUNDOS

exports.createToken = function(user) {
    return jwt.sign({ user: user }, secretKey, { expiresIn: expiredTime });
}