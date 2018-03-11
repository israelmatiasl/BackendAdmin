'use strict'

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

var mongoosePagination = require('mongoose-pagination');

var itemsPerPage = require('../helpers/constants').itemsPerPage;


//  =====================================
//  BÚSQUEDA GENERAL - MEDICO/HOSPITAL
//  =====================================
function searchGeneral(req, res) {

    var search = req.params.word;
    // PRIMERA MANERA
    /*searchAllModels(search).then((value) => {

        return res.status(200).send({
            busqueda_en_hospitales: value.searchInHospitals,
            busqueda_en_doctores: value.searchInDoctors
        });
    });*/

    // SEGUNDA MANERA
    Promise.all([searchHospitals(search), searchDoctors(search), searchUsers(search)])
        .then((value) => {
            return res.status(200).send({
                ok: true,
                busqueda_en_hospitales: value[0],
                busqueda_en_medicos: value[1],
                busqueda_en_usuarios: value[2]
            });
        });
}




//  =====================================
//  BÚSQUEDA GENERAL - MEDICO/HOSPITAL
//  =====================================
function searchCollection(req, res) {

    var collection = req.params.collection;
    var search = req.params.word;
    // var page = 1;
    // if (req.query.page) {
    //     page = req.query.page;
    // }

    var promise;

    switch (collection) {
        case 'users':
            promise = searchUsers(search);
            break;

        case 'hospitals':
            promise = searchHospitals(search);
            break;

        case 'doctors':
            promise = searchDoctors(search);
            break;

        default:
            return res.status(400).send({
                ok: false,
                message: 'Los tipos de búsqueda únicamente son: users, hospitals y doctors',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    promise.then((value) => {
        return res.status(200).send({
            ok: true,
            [collection]: value
        });
    });
}



//  =====================================
//  FUNCIÓN ASÍNCRONA - BÚSQUEDA GENERAL
//  =====================================
async function searchAllModels(wordToSearch) {

    var regex = new RegExp(wordToSearch, 'i');

    var searchInHospitals = await Hospital.find({ name: regex }, (err, hospitals) => {
        return hospitals;
    });

    var searchInDoctors = await Doctor.find({ name: regex }, (err, doctors) => {
        return doctors;
    });

    return {
        searchInHospitals,
        searchInDoctors
    }
}


//  =====================================
//  USO DE PROMESAS - BÚSQUEDA GENERAL
//  MÉTODO 2
//  =====================================
function searchHospitals(wordToSearch) {

    var regex = new RegExp(wordToSearch, 'i');
    return new Promise((resolve, reject) => {

        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitals) => {

                if (err) {
                    reject('Error al cargar los hospitales', err);
                } else {
                    resolve(hospitals);
                }
            });
    });
}

function searchDoctors(wordToSearch) {

    var regex = new RegExp(wordToSearch, 'i');
    return new Promise((resolve, reject) => {

        Doctor.find({ name: regex })
            .populate('userCreate userUpdate', 'name email')
            .populate('hospital', 'name image')
            .exec((err, doctors) => {

                if (err) {
                    reject('Error al cargar los médicos', err);
                } else {
                    resolve(doctors);
                }
            });
    });
}

function searchUsers(wordToSearch) {

    var regex = new RegExp(wordToSearch, 'i');
    return new Promise((resolve, reject) => {

        User.find({}, 'name email image')
            .or([{ 'name': regex },
                { 'email': regex }
            ])
            .exec((err, users) => {

                if (err) {
                    reject('Error al cargar los usuarios', err);
                } else {
                    resolve(users);
                }
            });
    });
}

function searchUsers2(wordToSearch, page) {

    var regex = new RegExp(wordToSearch, 'i');
    return new Promise((resolve, reject) => {

        User.find({}, 'name email image')
            .or([{ 'name': regex },
                { 'email': regex }
            ])
            .paginate(page, itemsPerPage, (err, users, total) => {
                if (err) {
                    reject('Error al cargar los usuarios', err);
                } else {
                    resolve({
                        users,
                        total
                    });
                }
            });
    });
}



//  =====================================
//  BÚSQUEDA DE USUARIOS NOMBRE/EMAIL
//  =====================================
function searchJustUser(req, res) {

    var search = req.params.word;

    Promise.all([searchUsers(search)])
        .then((value) => {

            return res.status(200).send({
                ok: true,
                busqueda_en_usuarios: value[0]
            });
        });
}




//  =====================================
//  BÚSQUEDA DE HOSPITALES NOMBRE
//  =====================================
function searchJustHospitals(req, res) {

    var search = req.params.word;

    Promise.all([searchHospitals(search)])
        .then((value) => {

            return res.status(200).send({
                ok: true,
                busqueda_en_hospitales: value[0]
            });
        });
}




//  =====================================
//  BÚSQUEDA DE MÉDICOS NOMBRE
//  =====================================
function searchJustDoctors(req, res) {

    var search = req.params.word;

    Promise.all([searchDoctors(search)])
        .then((value) => {

            return res.status(200).send({
                ok: true,
                busqueda_en_medicos: value[0]
            });
        });
}


//  =====================================
//  EXPORTACIÓN DE FUNCIONES
//  =====================================
module.exports = {
    searchGeneral,
    searchJustUser,
    searchJustHospitals,
    searchJustDoctors,
    searchCollection
}