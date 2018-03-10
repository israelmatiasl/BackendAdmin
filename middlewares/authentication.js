'use strict'

var jwt = require('jsonwebtoken');
var secretKey = require('../helpers/constants').secretKey;


//  ======================================
//  VERIFICACIÓN DEL TOKEN - AUTENTICACIÓN
//  ======================================
exports.tokenVerification = function(req, res, next) {

    var token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({
            ok: false,
            message: 'La petición no tiene la cabecera de autenticación'
        });
    }

    jwt.verify(token, secretKey, (err, userDecoded) => {

        if (err) {
            return res.status(401).send({
                ok: false,
                message: 'Token incorrecto',
                errors: err
            });
        }

        req.user = userDecoded;
        next();
    });
}