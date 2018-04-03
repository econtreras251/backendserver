const mongoose = require('mongoose')
const Schema = mongoose.Schema

const medicoSchema = new Schema({

  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  img: { type: String },
  usuario: { type: Schema.ObjectId, ref: 'Usuario', required:true },
  hospital: { type: Schema.ObjectId, ref: 'Hospital', required:[true, 'El id del hospital es Obligatorio'] }    

})

module.exports = mongoose.model('Medico', medicoSchema)