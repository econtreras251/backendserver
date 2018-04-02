const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const Ticket = require('../models/ticket')
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

  let body = req.body
  let user = req.query.id

  let ticket = new Ticket({
    titulo: body.titulo,
    descripcion: body.descripcion,
    user_send: req.usuario,
    support_asigned: req.query.id
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
      soporte_asignado: req.query.id
    })

  })

})

module.exports = app
