const express = require('express')
const bcrypt = require('bcryptjs')
const app = express()
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const mdAuth = require('../middlewares/autenticacion')



//Obtener todos los usuarios
app.get('/', (req, res, next)=>{

  Usuario.find({ }, 'nombre email img role')
          .exec(
          ( err, usuarios )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando Usuarios',
            errors: err
        })
    }

    res.status(200).json({
      ok: true,
      usuarios: usuarios
    })

  })


})


// Actualizar usuario
app.put('/:id', mdAuth.verificaToken, ( req, res, next )=>{
  let id = req.params.id
  let body = req.body

  Usuario.findById( id, ( err, usuario )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            errors: err
        })
    }

    if ( !usuario ) {
      return res.status(400).json({
          ok: false,
          mensaje: `El usuario con el id: ${id} no existe`,
          errors: { message: 'No existe un usuario con ese ID' }
      })
    }

    usuario.nombre = body.nombre,
    usuario.email = body.email,
    usuario.role = body.role

    usuario.save( ( err, usuarioGuardado )=>{

      if (err) {
          return res.status(400).json({
              ok: false,
              mensaje: 'Error al actualizar usuario',
              errors: err
          })
      }

      usuarioGuardado.password = ':)'

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      })

    })

  })

})


//Crear un nuevo Usuario
app.post('/', mdAuth.verificaToken ,( req, res, next )=>{

  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10),
    img: body.img,
    role: body.role
  })

  usuario.save( ( err, usuarioGuardado )=>{

    if (err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear usuario',
            errors: err
        })
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuarioToken: req.usuario
    })

  })

})


//Eliminar Usuario
app.delete('/:id', mdAuth.verificaToken ,(req, res, next)=>{
  let id = req.params.id

  Usuario.findByIdAndRemove(id, ( err, usuarioBorrado )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar usuario',
            errors: err
        })
    }

    if ( !usuarioBorrado ) {
      return res.status(400).json({
          ok: false,
          mensaje: `El usuario con el id: ${id} no existe`,
          errors: { message: 'No existe un usuario con ese ID' }
      })
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    })

  })

})


module.exports = app
