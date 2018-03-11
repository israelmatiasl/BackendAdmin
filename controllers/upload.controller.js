'use strict'

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

var fs = require('fs');

var pathUser = './uploads/users';
var pathHospital = './uploads/hospitals';
var pathDoctor = './uploads/doctors';



//  =====================================
//  SUBIDA DE IMAGEN - TODOS
//  =====================================
function uploadImage(req, res) {

    var collection = req.params.collection;
    var Id = req.params.id;
    var validCollection = ['user', 'hospital', 'doctor'];

    if (validCollection.indexOf(collection) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Las colecciones permitidas son: user, hospital y doctor',
            errors: { message: 'Tipo de tabla/colección no válido' }
        });
    }

    if (!req.files) {
        return res.status(400).send({
            ok: false,
            message: 'No seleccionó ninguna imagen',
            erros: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var img = req.files.image;
    var imgArr = img.name.split('.');
    var imgExt = imgArr[imgArr.length - 1];

    var validExt = ['png', 'jpg', 'gif', 'jpeg'];
    if (validExt.indexOf(imgExt.toLowerCase()) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Extensión no válida',
            erros: { message: 'Las extensiones válidas son: ' + validExt.join(', ') }
        });
    }

    return uploadPerType(collection, Id, img, imgExt, res);
}


//  =====================================
//  SUBIDA DE IMAGEN - USUARIO
//  =====================================
function uploadUserImage(req, res) {

    var userId = req.params.id;

    if (!req.files) {
        return res.status(400).send({
            ok: false,
            message: 'No seleccionó ninguna imagen',
            erros: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var img = req.files.image;
    var imgArr = img.name.split('.');
    var imgExt = imgArr[imgArr.length - 1];

    var validExt = ['png', 'jpg', 'gif', 'jpeg'];
    if (validExt.indexOf(imgExt.toLowerCase()) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Extensión no válida',
            erros: { message: 'Las extensiones válidas son: ' + validExt.join(', ') }
        });
    }

    return uploadPerType('user', userId, img, imgExt, res);
}



//  =====================================
//  SUBIDA DE IMAGEN - HOSPITAL
//  =====================================
function uploadHospitalImage(req, res) {

    var hospitalId = req.params.id;

    if (!req.files) {
        return res.status(400).send({
            ok: false,
            message: 'No seleccionó ninguna imagen',
            erros: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var img = req.files.image;
    var imgArr = img.name.split('.');
    var imgExt = imgArr[imgArr.length - 1];

    var validExt = ['png', 'jpg', 'gif', 'jpeg'];
    if (validExt.indexOf(imgExt.toLowerCase()) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Extensión no válida',
            erros: { message: 'Las extensiones válidas son: ' + validExt.join(', ') }
        });
    }

    return uploadPerType('hospital', hospitalId, img, imgExt, res);
}



//  =====================================
//  SUBIDA DE IMAGEN - MÉDICO
//  =====================================
function uploadDoctorImage(req, res) {

    var doctorId = req.params.id;

    if (!req.files) {
        return res.status(400).send({
            ok: false,
            message: 'No seleccionó ninguna imagen',
            erros: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var img = req.files.image;
    var imgArr = img.name.split('.');
    var imgExt = imgArr[imgArr.length - 1];

    var validExt = ['png', 'jpg', 'gif', 'jpeg'];
    if (validExt.indexOf(imgExt.toLowerCase()) < 0) {
        return res.status(400).send({
            ok: false,
            message: 'Extensión no válida',
            erros: { message: 'Las extensiones válidas son: ' + validExt.join(', ') }
        });
    }

    return uploadPerType('doctor', doctorId, img, imgExt, res);
}



//  =====================================
//  SUBIDA DE IMAGEN - FUNCIÓN
//  =====================================
function uploadPerType(type, id, img, imgExt, res) {

    if (type == 'user') {
        var exists_user;
        User.findById(id, (err, user) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al buscar el usuario', errors: err });

            if (!user) return res.status(400).send({ ok: false, message: 'No se encuentra ningún usuario con ese Id' });

            exists_user = user;

            // Personalizar el nombre del archivo
            var imgName = `${id}-${new Date().getMilliseconds()}.${imgExt}`;
            // Mover el archivo a una ruta
            var path = `${pathUser}/${imgName}`;

            img.mv(path, (err) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al mover la imagen', errors: err });

                User.findByIdAndUpdate(id, { image: imgName }, { new: true }, (err, userUpdated) => {
                    if (err) return res.status(500).send({ ok: false, message: 'Error al guardar la imagen', errors: err });

                    if (exists_user.image) {
                        var pathExists = `${pathUser}/${exists_user.image}`;
                        //Si existe, elimina la imagen anterior
                        if (fs.existsSync(pathExists)) { fs.unlink(pathExists); }
                    }
                    return res.status(200).send({ ok: true, message: 'Imagen guardada correctamente ', user: userUpdated });
                });

            });
        });
    }

    if (type == 'hospital') {
        var exists_hospital;
        Hospital.findById(id, (err, hospital) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al buscar el hospital', errors: err });

            if (!hospital) return res.status(400).send({ ok: false, message: 'No se encuentra ningún hospital con ese Id' });

            exists_hospital = hospital;

            // Personalizar el nombre del archivo
            var imgName = `${id}-${new Date().getMilliseconds()}.${imgExt}`;
            // Mover el archivo a una ruta
            var path = `${pathHospital}/${imgName}`;

            img.mv(path, (err) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al mover la imagen', errors: err });

                Hospital.findByIdAndUpdate(id, { image: imgName }, { new: true }, (err, hospitalUpdated) => {
                    if (err) return res.status(500).send({ ok: false, message: 'Error al guardar la imagen', errors: err });

                    if (exists_hospital.image) {
                        var pathExists = `${pathHospital}/${exists_hospital.image}`;
                        //Si existe, elimina la imagen anterior
                        if (fs.existsSync(pathExists)) { fs.unlink(pathExists); }
                    }
                    return res.status(200).send({ ok: true, message: 'Imagen guardada correctamente ', hospital: hospitalUpdated });
                });

            });
        });
    }

    if (type == 'doctor') {
        var exists_doctor;
        Doctor.findById(id, (err, doctor) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al buscar el médico', errors: err });

            if (!doctor) return res.status(400).send({ ok: false, message: 'No se encuentra ningún médico con ese Id' });

            exists_doctor = doctor;

            // Personalizar el nombre del archivo
            var imgName = `${id}-${new Date().getMilliseconds()}.${imgExt}`;
            // Mover el archivo a una ruta
            var path = `${pathDoctor}/${imgName}`;

            img.mv(path, (err) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al mover la imagen', errors: err });

                Doctor.findByIdAndUpdate(id, { image: imgName }, { new: true }, (err, doctorUpdated) => {
                    if (err) return res.status(500).send({ ok: false, message: 'Error al guardar la imagen', errors: err });

                    if (exists_doctor.image) {
                        var pathExists = `${pathDoctor}/${exists_doctor.image}`;
                        //Si existe, elimina la imagen anterior
                        if (fs.existsSync(pathExists)) { fs.unlink(pathExists); }
                    }
                    return res.status(200).send({ ok: true, message: 'Imagen guardada correctamente ', doctor: doctorUpdated });
                });

            });
        });
    }
}





//  =====================================
//  EXPORTACIÓN DE FUNCIONES
//  =====================================
module.exports = {
    uploadImage,
    uploadUserImage,
    uploadHospitalImage,
    uploadDoctorImage
}