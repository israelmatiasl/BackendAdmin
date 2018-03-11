'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var doctorSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    image: { type: String, required: false },
    userCreate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userUpdate: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});

module.exports = mongoose.model('Doctor', doctorSchema);