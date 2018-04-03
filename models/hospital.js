const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hospitalSchema = new Schema({

  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  img: { type: String },
  usuario: { type: Schema.ObjectId, ref: 'Usuario' }  

}, {collection:'hospitales'})

module.exports = mongoose.model('Hospital', hospitalSchema)