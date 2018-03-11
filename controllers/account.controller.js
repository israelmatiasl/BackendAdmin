'use strict'

var User = require('../models/user');

var bcrypt = require('bcryptjs');

var jwt = require('../services/jwt.service');


//  =====================================
//  LOGIN DEL USUARIO
//  =====================================
function login(req, res) {

    var params = req.body;

    var email = params.email;
    var password = params.password;
    var gettoken = params.gettoken;

    User.findOne({ email: email }, (err, foundUser) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar un usuario',
                errors: err
            });
        }

        if (!foundUser) {
            return res.status(404).send({
                ok: false,
                mensaje: 'Credenciales incorrectas - email'
            });
        }

        if (!bcrypt.compareSync(password, foundUser.password)) {
            return res.status(404).send({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            });
        } else {
            foundUser.password = undefined;

            //CREAR UN TOKEN
            var token = jwt.createToken(foundUser);

            return res.status(200).send({
                ok: true,
                usuario: foundUser,
                token: token
            });
        }
    });
}

module.exports = {
    login
}