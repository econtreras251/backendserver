const express = require('express')

const app = express()

const Usuario = require('../models/usuario')



// Rutas


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

//Crear un nuevo Usuario
app.post('/',( req, res, next )=>{

  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: body.password,
    img: body.img,
    role: body.role
  })


  usuario.save( ( err, usuarioGuardado )=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear usuario',
            errors: err
        })
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    })

  })


})


module.exports = app
