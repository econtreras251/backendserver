const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()

app.use(fileUpload());




// Rutas
app.put('/:tipo/:id', (req, res, next)=>{

    const tipo = req.params.tipo
    const id = req.params.id

    //Tipos validos 
    const tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if ( tiposValidos.indexOf(tipo)<0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Coleccion no es valida',
            errors: {message:'Tipo de Coleccion no es valida'}
        })
    }


    if( !req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {message:'debe de seleccionar una imagen'}
        })
    }

    // Obtener nombre del archivo
    let archivo = req.files.imagen
    let nombreCortado = archivo.name.split('.')
    let extensionArchivo = nombreCortado[nombreCortado.length - 1]

    //Validar extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if( extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {message:'Las extensiones validas son '+extensionesValidas.join(', ')}
        })
    }

    // Nombre de archivo personalizado
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`


    // Mover el archivo del temporal a un PATH
    const PATH = `./uploads/${tipo}/${nombreArchivo}`

    archivo.mv(PATH,(err)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover arcivo',
                errors: err
            })
        }
    })


    res.status(200).json({
        ok: true,
         mensaje: 'Archivo Movido'
     })

})

module.exports = app
