const mongoose = require('mongoose')
const shortid = require('shortid')
const Schema = mongoose.Schema

const ticketSchema = new Schema({

  titulo: { type: String, required: [true, 'El titulo es necesario'] },
  descripcion: { type: String, required: [true, 'La descripcion debe tener algo'] },
  id_validator: { type: String, unique:true, default: shortid.generate()+"A"+new Date().getMilliseconds() },
  user_send: { type: Schema.ObjectId, required: true, ref: 'Usuario' },
  support_asigned: { type: Schema.ObjectId, required: true, ref: 'Usuario' },
  status: { type: Boolean, default:false }  

})

module.exports = mongoose.model('Ticket', ticketSchema)
