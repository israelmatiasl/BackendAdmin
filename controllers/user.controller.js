'use strict'

var User = require('../models/user');

var bcrypt = require('bcryptjs');
var mongoosePagination = require('mongoose-pagination');

var itemsPerPage = require('../helpers/constants').itemsPerPage;

//  =====================================
//  OBTENER TODOS LOS USUARIOS
//  =====================================
function getUsers(req, res) {

    var page = 1;
    if (req.query.page) {
        page = req.query.page;
    }

    User.find({}, 'name email role')
        .paginate(page, itemsPerPage, (err, users, total) => {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al buscar todos los usuarios',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                page,
                pages: Math.ceil(total / itemsPerPage),
                total,
                users
            });
        });
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
                        mensaje: 'Error al buscar el usuario',
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
    var identifiedUser = req.user.user;

    if (identifiedUser.role != 'ADMIN_ROLE') {

        return res.status(401).send({
            ok: false,
            mensaje: 'No tiene permisos para realizar esta acción'
        });
    }

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
    var identifiedUser = req.user.user;

    if (identifiedUser.role != 'ADMIN_ROLE') {

        return res.status(401).send({
            ok: false,
            mensaje: 'No tiene permisos para realizar esta acción'
        });
    }

    //delete password(seguridad)
    delete userToUpdate.password;

    User.findById(userId, (err, foundUser) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el usuario',
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
                    mensaje: 'Error al actualizar el usuario',
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
    var identifiedUser = req.user.user;

    if (identifiedUser.role != 'ADMIN_ROLE') {

        return res.status(401).send({
            ok: false,
            mensaje: 'No tiene permisos para realizar esta acción'
        });
    }

    User.findById(userId, (err, foundUser) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el usuario',
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