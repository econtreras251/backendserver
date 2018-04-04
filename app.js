// Requires(Importaciones de lIBRERIAS)
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Inicializar variables
const app = express()
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

// Importar Rutas
const appRoutes = require('./routes/app')
const usuarioRoutes = require('./routes/usuario')
const loginRoutes = require('./routes/login')
const ticketsRoutes = require('./routes/ticket')
const hositalRoutes = require('./routes/hospital')
const medicoRoutes = require('./routes/medico')
const busquedaRoutes = require('./routes/busqueda')

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',( err, res )=>{
  //Si tiene un error se dispara
  if ( err ) throw err
  // Mensaje con expresion regular
  console.log('Base de Datos, port 27017: \x1b[32m%s\x1b[0m','Online');
})

// Middleware
app.use('/usuario', usuarioRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/hospital', hositalRoutes)
app.use('/medico', medicoRoutes)
app.use('/tickets', ticketsRoutes)
app.use('/login', loginRoutes)

app.use('/', appRoutes)

// Escuchar peticiones
app.listen(3000, ()=>{
  // Expression regular para definir color por importancia \x1b[32m%s\x1b[0m
  console.log('Server running, port 3000: \x1b[32m%s\x1b[0m','Online');
})
