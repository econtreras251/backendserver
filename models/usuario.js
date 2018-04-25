const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE', 'SUPPORT_ROLE'],
  message: '{VALUE} no es un rol permitido'
}

const usuarioSchema = new Schema({

  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
  password: { type: String, required: [true, 'La contraseña es necesaria'] },
  img: { type: String},
  role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
  tickets: [
    { 
      type: Schema.ObjectId, required: true, ref: 'Ticket'
    }
  ],
  estado: { type: Boolean, default: false}
  
})

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema)