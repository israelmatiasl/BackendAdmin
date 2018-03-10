'use strict'

var User = require('../models/user');

var bcrypt = require('bcryptjs');

//  =====================================
//  OBTENER TODOS LOS USUARIOS
//  =====================================
function getUsers(req, res) {

    User.find({}, 'name email role')
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        mensaje: 'Error al obtener todos los usuarios',
                        errors: err
                    });
                }

                return res.status(200).send({
                    ok: true,
                    users
                });
            }
        )
}



//  =====================================
//  OBTENER UN USUARIO 
//  =====================================
function getUser(req, res) {

    var userId = req.params.id;

    User.findById(userId, 'name email role')
        .exec(
            (err, user) => {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        mensaje: 'Error al obtener el usuario que solicitó',
                        errors: err
                    });
                }

                return res.status(200).send({
                    ok: true,
                    user
                });
            }
        )
}



//  =====================================
//  CREAR UN NUEVO USUARIO 
//  =====================================
function saveUser(req, res) {

    var params = req.body;

    var user = new User({
        name: params.name,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        image: null,
        role: params.role
    });

    user.save((err, userStored) => {
        if (err) {
            return res.status(400).send({
                ok: false,
                mensaje: 'Error al crear un usuario',
                errors: err
            });
        }

        return res.status(201).send({
            ok: true,
            userStored
        });
    });
}



//  =====================================
//  ACTUALIZAR UN USUARIO 
//  =====================================
function updateUser(req, res) {

    var userId = req.params.id;
    var userToUpdate = req.body;

    //delete password(seguridad)
    delete userToUpdate.password;

    User.findById(userId, (err, foundUser) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar un usuario',
                errors: err
            });
        }

        if (!foundUser) {
            return res.status(400).send({
                ok: false,
                mensaje: 'El usuario con el id: ' + userId + ', no existe'
            });
        }

        User.findByIdAndUpdate(userId, userToUpdate, { new: true }, (err, userUpdated) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar un usuario',
                    errors: err
                });
            }
            userUpdated.password = undefined;
            return res.status(200).send({
                ok: true,
                userUpdated
            });
        });
    });
}



//  =====================================
//  ELIMINAR UN USUARIO 
//  =====================================
function deleteUser(req, res) {

    var userId = req.params.id;

    User.findById(userId, (err, foundUser) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar un usuario',
                errors: err
            });
        }

        if (!foundUser) {
            return res.status(400).send({
                ok: false,
                mensaje: 'El usuario con el id: ' + userId + ', no existe'
            });
        }

        User.findByIdAndRemove(userId, (err, userDeleted) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'Error al eliminar el usuario',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                userDeleted
            });
        });
    })
}


//  =====================================
//  EXPORTACIÓN DE FUNCIONES
//  =====================================
module.exports = {
    getUser,
    getUsers,
    saveUser,
    updateUser,
    deleteUser
}