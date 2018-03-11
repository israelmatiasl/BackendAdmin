'use strict'

var Doctor = require('../models/doctor');

var mongoosePagination = require('mongoose-pagination');

var itemsPerPage = require('../helpers/constants').itemsPerPage;

//  =====================================
//  OBTENER TODOS LOS MÉDICOS
//  =====================================
function getDoctors(req, res) {

    var page = 1;
    if (req.query.page) {
        page = req.query.page;
    }

    Doctor.find({})
        .populate('userCreate userUpdate', 'name email image')
        .populate('hospital')
        .paginate(page, itemsPerPage, (err, doctors, total) => {

            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al buscar todos los médicos',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                page,
                pages: Math.ceil(total / itemsPerPage),
                total,
                doctors
            });
        });
}



//  =====================================
//  OBTENER UN MÉDICO
//  =====================================
function getDoctor(req, res) {

    var doctorId = req.params.id;

    Doctor.findById(doctorId).exec((err, doctor) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el médico',
                errors: err
            });
        }

        return res.status(200).send({
            ok: true,
            doctor
        });
    });
}



//  =====================================
//  CREAR UN NUEVO MÉDICO
//  =====================================
function saveDoctor(req, res) {

    var params = req.body;
    var identifiedUser = req.user.user;

    var doctor = new Doctor({
        name: params.name,
        image: null,
        userCreate: identifiedUser._id,
        userUpdate: null,
        hospital: params.hospital
    });

    doctor.save((err, doctorStored) => {

        if (err) {
            return res.status(400).send({
                ok: false,
                mensaje: 'Error al crear un médico',
                errors: err
            });
        }

        return res.status(201).send({
            ok: true,
            doctorStored
        });
    });

}



//  =====================================
//  ACTUALIZAR MÉDICO
//  =====================================
function updateDoctor(req, res) {

    var doctorId = req.params.id;
    var doctorToUpdate = req.body;
    var identifiedUser = req.user.user;

    Doctor.findById(doctorId, (err, foundDoctor) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el médico',
                errors: err
            });
        }

        if (!foundDoctor) {
            return res.status(400).send({
                ok: false,
                mensaje: 'El médico con el id: ' + doctorId + ', no existe'
            });
        }

        foundDoctor.name = doctorToUpdate.name;
        foundDoctor.userUpdate = identifiedUser._id;

        foundDoctor.save((err, doctorStored) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    mensaje: 'Error al actualizar el médico',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                doctorStored
            });
        });
    });
}



//  =====================================
//  ELIMINAR MÉDICO
//  =====================================
function deleteDoctor(req, res) {

    var doctorId = req.params.id;
    var identifiedUser = req.user.user;

    Doctor.findById(doctorId, (err, foundDoctor) => {

        if (err) {
            return res.status(500).send({
                ok: false,
                mensaje: 'Error al buscar el médico',
                errors: err
            });
        }

        if (!foundDoctor) {
            return res.status(400).send({
                ok: false,
                mensaje: 'El médico con el id: ' + doctorId + ', no existe'
            });
        }

        Doctor.findByIdAndRemove(doctorId, (err, doctorDeleted) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    mensaje: 'Error al eliminar al médico',
                    errors: err
                });
            }

            return res.status(200).send({
                ok: true,
                doctorDeleted
            });
        });
    });
}



//  =====================================
//  EXPORTACIÓN DE FUNCIONES
//  =====================================
module.exports = {
    getDoctors,
    getDoctor,
    saveDoctor,
    updateDoctor,
    deleteDoctor
}