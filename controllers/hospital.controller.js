'use strict'

var Hospital = require('../models/hospital');

var mongoosePagination = require('mongoose-pagination');

var itemsPerPage = require('../helpers/constants').itemsPerPage;

//  =====================================
//  OBTENER TODOS LOS HOSPITALES
//  =====================================
function getHospitals(req, res) {

    var page = 1;
    if (req.query.page) {
        page = req.query.page;
    }

    Hospital.find({})
        .populate('user', 'name email image')
        .paginate(page, itemsPerPage, (err, hospitals, total) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al buscar todos los hospitales',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                page,
                pages: Math.ceil(total / itemsPerPage),
                total,
                hospitals
            });
        });
}



//  =====================================
//  OBTENER UN HOSPITAL
//  =====================================
function getHospital(req, res) {

    var hospitalId = req.params.id;

    Hospital.findById(hospitalId).populate('user', 'name email image')
        .exec((err, hospital) => {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al buscar el hospital',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                hospital
            });
        });
}



//  =====================================
//  CREAR UN NUEVO HOSPITAL
//  =====================================
function saveHospital(req, res) {

    var params = req.body;
    var identifiedUser = req.user.user;

    if (identifiedUser.role != 'ADMIN_ROLE') {

        return res.status(401).send({
            ok: false,
            mensaje: 'No tiene permisos para realizar esta acción'
        });
    }

    var hospital = new Hospital({
        name: params.name,
        image: null,
        user: identifiedUser._id
    });

    hospital.save((err, hospitalStored) => {

        if (err) {
            return res.status(400).send({
                ok: false,
                mensaje: 'Error al crear un hospital',
                errors: err
            });
        }

        return res.status(201).send({
            ok: true,
            hospitalStored
        });
    });

}



//  =====================================
//  ACTUALIZAR HOSPITAL
//  =====================================
function updateHospital(req, res) {

    var hospitalId = req.params.id;
    var hospitalToUpdate = req.body;
    var identifiedUser = req.user.user;

    if (identifiedUser.role != 'ADMIN_ROLE') {

        return res.status(401).send({
            ok: false,
            mensaje: 'No tiene permisos para realizar esta acción'
        });
    }

    Hospital.findById(hospitalId, (err, foundHospital) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!foundHospital) {
            return res.status(400).send({
                ok: false,
                mensaje: 'El hospital con el id: ' + hospitalId + ', no existe'
            });
        }

        Hospital.findByIdAndUpdate(hospitalId, hospitalToUpdate, { new: true }, (err, hospitalUpdated) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                hospitalUpdated
            });
        })
    });
}



//  =====================================
//  ELIMINAR HOSPITAL
//  =====================================
function deleteHospital(req, res) {

    var hospitalId = req.params.id;
    var identifiedUser = req.user.user;

    if (identifiedUser.role != 'ADMIN_ROLE') {

        return res.status(401).send({
            ok: false,
            mensaje: 'No tiene permisos para realizar esta acción'
        });
    }

    Hospital.findById(hospitalId, (err, foundHospital) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!foundHospital) {
            return res.status(400).send({
                ok: false,
                mensaje: 'El hospital con el id: ' + hospitalId + ', no existe'
            });
        }

        Hospital.findByIdAndRemove(hospitalId, (err, hospitalDeleted) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'Error al eliminar el hospital',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                hospitalDeleted
            });
        });
    });
}



//  =====================================
//  EXPORTACIÓN DE FUNCIONES
//  =====================================
module.exports = {
    getHospitals,
    getHospital,
    saveHospital,
    updateHospital,
    deleteHospital
}