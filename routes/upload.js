const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')
const fs = require('fs')

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


    subirPorTipo( tipo, id, nombreArchivo, res )

    /*res.status(200).json({
        ok: true,
         mensaje: 'Archivo Movido'
     })*/

})


function subirPorTipo( tipo, id, nombreArchivo, res ) {
    
    if ( tipo === 'usuarios' ) {

        Usuario.findById( id, (err, usuario)=>{

            if ( !usuario ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: err
                })
            }

            let pathViejo = './uploads/usuarios/'+usuario.img

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink( pathViejo, (err) => {
                    if (err) throw err;
                  })
            }

            usuario.img = nombreArchivo

            usuario.save( (err, usuarioActualizado) =>{

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar Usuario',
                        errors: err
                    })
                }

                usuarioActualizado.password = ':)'

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })


            })

        })

    }

    if ( tipo === 'medicos' ) {

        Medico.findById( id, (err, medico)=>{

            if ( !medico ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: err
                })
            }

            let pathViejo = './uploads/medicos/'+medico.img

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink( pathViejo, (err) => {
                    if (err) throw err;
                  })
            }

            medico.img = nombreArchivo

            medico.save( (err, medicoActualizado) =>{

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar Medico',
                        errors: err
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de medico actualizada',
                    medico: medicoActualizado
                })


            })

        })
        
    }

    if ( tipo === 'hospitales' ) {
        
        Hospital.findById( id, (err, hospital)=>{

            if ( !hospital ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: err
                })
            }

            let pathViejo = './uploads/hospitales/'+hospital.img

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink( pathViejo, (err) => {
                    if (err) throw err;
                  })
            }

            hospital.img = nombreArchivo

            hospital.save( (err, hospitalActualizado) =>{

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                })


            })

        })
    }

}



module.exports = app
