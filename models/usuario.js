const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuarioSchema = new Schema({

  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
  password: { type: String, required: [true, 'La contraseña es necesaria'] },
  img: { type: String},
  role: { type: String, required: true, default: 'USER_ROLE' }

})

module.exports = mongoose.model('Usuario', usuarioSchema)
