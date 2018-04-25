const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const Ticket = require('../models/ticket')
const Usuario = require('../models/usuario')
const mdAuth = require('../middlewares/autenticacion')

// Obtener todos los tickets
app.get('/', (req, res, next)=>{

  Ticket.find()
          .exec(
          ( err, tickets )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando Tickets',
            errors: err
        })
    }

    res.status(200).json({
      ok: true,
      tickets: tickets
    })

  })

})

// Crear nuevo ticket
app.post('/', mdAuth.verificaToken ,( req, res, next )=>{

  Usuario.findOne({ role: 'SUPPORT_ROLE' Y estado: false })//Buscar usuario que cumpla condicional, y luego utilizar metodos para insertar tickests en el arreglo como en el ejemplod e fazt


  let body = req.body
  let user = req.query.id

  let ticket = new Ticket({
    titulo: body.titulo,
    descripcion: body.descripcion,
    user_send: req.usuario,
    support_asigned: 
  })

  ticket.save( ( err, ticketGuardado )=>{

    if (err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear ticket',
            errors: err
        })
    }

    res.status(201).json({
      ok: true,
      ticket: ticketGuardado,
      usuario_peticion: req.usuario,
      soporte_asignado: 
    })

  })

})

module.exports = app
