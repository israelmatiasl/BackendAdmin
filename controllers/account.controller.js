'use strict'

var User = require('../models/user');

var bcrypt = require('bcryptjs');

var jwt = require('../services/jwt.service');

var CLIENT_ID = require('../helpers/constants').CLIENT_ID;
var SECRET_KEY = require('../helpers/constants').SECRET_KEY;

var { OAuth2Client } = require('google-auth-library');


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
                message: 'Error al buscar un usuario',
                errors: err
            });
        }

        if (!foundUser) {
            return res.status(404).send({
                ok: false,
                message: 'Credenciales incorrectas - email'
            });
        }

        if (!bcrypt.compareSync(password, foundUser.password)) {
            return res.status(404).send({
                ok: false,
                message: 'Credenciales incorrectas - password'
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




//  =====================================
//  LOGIN CON GOOGLE
//  =====================================
function loginGoogle(req, res) {

    var token = req.body.token;

    var client = new OAuth2Client(CLIENT_ID, SECRET_KEY, '');

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];

        User.findOne({ email: payload.email }, (err, foundUser) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al buscar el usuario', errors: err });

            // CREAR EL USUARIO
            if (!foundUser) {
                var user = new User();

                user.name = payload.name;
                user.email = payload.email;
                user.password = 'dont_care';
                user.image = null;
                user.google = true;

                user.save((err, userStored) => {
                    if (err) return res.status(500).send({ ok: false, message: 'Error al crear usuario - Google', errors: err });

                    userStored.password = undefined;
                    var token = jwt.createToken(userStored);

                    return res.status(200).send({
                        ok: true,
                        usuario: userStored,
                        token: token
                    });
                });
            } else {

                if (foundUser.google == false) return res.status(400).send({ ok: false, message: 'Debe usar su autenticación normal' });

                foundUser.password = undefined;
                var token = jwt.createToken(foundUser);

                return res.status(200).send({
                    ok: true,
                    usuario: foundUser,
                    token: token
                });
            }
        });
    }
    verify().catch(() => {
        return res.status(400).send({
            ok: false,
            errros: 'Ha ocurrido un problema'
        });
    });
}



module.exports = {
    login,
    loginGoogle
}