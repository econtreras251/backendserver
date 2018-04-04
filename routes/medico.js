const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const Medico = require('../models/medico')
const mdAuth = require('../middlewares/autenticacion')



//Obtener todos los medicos
app.get('/', (req, res, next)=>{

    Medico.find()
          .exec(
          ( err, medicos )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando Medicos',
            errors: err
        })
    }

    res.status(200).json({
      ok: true,
      medicos: medicos
    })

  })


})


// Actualizar Medico
app.put('/:id', mdAuth.verificaToken, ( req, res, next )=>{
  let id = req.params.id
  let body = req.body

  Medico.findById( id, ( err, medico )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar medico',
            errors: err
        })
    }

    if ( !medico ) {
      return res.status(400).json({
          ok: false,
          mensaje: `El medico con el id: ${id} no existe`,
          errors: { message: 'No existe un medico con ese ID' }
      })
    }

    medico.nombre = body.nombre
    medico.usuario = req.usuario._id
    medico.hospital = body.hospital

    medico.save( ( err, medicoGuardado )=>{

      if (err) {
          return res.status(400).json({
              ok: false,
              mensaje: 'Error al actualizar medico',
              errors: err
          })
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      })

    })

  })

})


//Crear un nuevo Medico
app.post('/', mdAuth.verificaToken ,( req, res, next )=>{

  let body = req.body

  let medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario,
    hospital: body.hospital
  })

  medico.save( ( err, medicoGuardado )=>{

    if (err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear medico',
            errors: err
        })
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado
    })

  })

})


//Eliminar Medico
app.delete('/:id', mdAuth.verificaToken ,(req, res, next)=>{
  let id = req.params.id

  Medico.findByIdAndRemove(id, ( err, medicoBorrado )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar medico',
            errors: err
        })
    }

    if ( !medicoBorrado ) {
      return res.status(400).json({
          ok: false,
          mensaje: `El medico con el id: ${id} no existe`,
          errors: { message: 'No existe un medico con ese ID' }
      })
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    })

  })

})


module.exports = app
