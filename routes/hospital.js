const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const Hospital = require('../models/hospital')
const mdAuth = require('../middlewares/autenticacion')



//Obtener todos los hospitales
app.get('/', (req, res, next)=>{

  Hospital.find()
          .exec(
          ( err, hospitales )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando Hospitales',
            errors: err
        })
    }

    res.status(200).json({
      ok: true,
      hospitales: hospitales
    })

  })


})


// Actualizar Hospital
app.put('/:id', mdAuth.verificaToken, ( req, res, next )=>{
  let id = req.params.id
  let body = req.body

  Hospital.findById( id, ( err, hospital )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar hospital',
            errors: err
        })
    }

    if ( !hospital ) {
      return res.status(400).json({
          ok: false,
          mensaje: `El hospital con el id: ${id} no existe`,
          errors: { message: 'No existe un hospital con ese ID' }
      })
    }

    hospital.nombre = body.nombre,
    hospital.usuario =  req.usuario._id

    hospital.save( ( err, hospitalGuardado )=>{

      if (err) {
          return res.status(400).json({
              ok: false,
              mensaje: 'Error al actualizar hospital',
              errors: err
          })
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      })

    })

  })

})


//Crear un nuevo Hospital
app.post('/', mdAuth.verificaToken ,( req, res, next )=>{

  let body = req.body

  let hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id,
  })

  hospital.save( ( err, hospitalGuardado )=>{

    if (err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear Hospital',
            errors: err
        })
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    })

  })

})


//Eliminar Hospital
app.delete('/:id', mdAuth.verificaToken ,(req, res, next)=>{
  let id = req.params.id

  Hospital.findByIdAndRemove(id, ( err, hospitalBorrado )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar hospital',
            errors: err
        })
    }

    if ( !hospitalBorrado ) {
      return res.status(400).json({
          ok: false,
          mensaje: `El hospital con el id: ${id} no existe`,
          errors: { message: 'No existe un hospital con ese ID' }
      })
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    })

  })

})


module.exports = app
