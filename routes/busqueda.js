const express = require('express')

const app = express()

const Hospital = require('../models/hospital')
const Medico = require('../models/medico')
const Usuario = require('../models/usuario')


// Busqueda General
app.get('/todo/:busqueda', (req, res, next)=>{

    const busqueda = req.params.busqueda
    const regex = new RegExp( busqueda, 'i')

    Promise.all( [ 
            buscarHospitales(busqueda, regex), 
            buscarMedicos(busqueda, regex),
            buscarUsuarios( busqueda, regex )
        ] )
        .then( respuestas=>{

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
              })

        })
    

})


app.get('/coleccion/:tabla/:busqueda', (req, res)=>{

    const busqueda = req.params.busqueda
    const tabla = req.params.tabla
    const regex = new RegExp( busqueda, 'i')
    let promesa = null //buscarHospitales(busqueda, regex)

    switch (tabla) {
        case "hospitales":
            promesa = buscarHospitales(busqueda, regex)
            break;
        case "medicos":
            promesa = buscarMedicos(busqueda, regex)
            break;
        case "usuarios":
            promesa = buscarUsuarios(busqueda, regex)
            break;
        default:
            return res.status(400).json({
                ok:false,
                mensaje: 'Los tipos de busqueda son unicamente: usuarios, medicos y hospitales'
            })
            break;
    }

    promesa.then( data=>{

        res.status(200).json({
            ok: true,
            [tabla]: data
          })

    })

})








function buscarHospitales( busqueda, regex ) {

    return new Promise( (resolve, reject) =>{

        Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .exec( (err, hospitales)=>{

            if( err ){
                reject('Error al cargar hospitales')
            }else{
                resolve(hospitales)
            }
        })

    })
    
}

function buscarMedicos( busqueda, regex ) {

    return new Promise( (resolve, reject) =>{

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos)=>{

            if( err ){
                reject('Error al cargar medicos')
            }else{
                resolve(medicos)
            }
        })

    })
    
}

function buscarUsuarios( busqueda, regex ) {

    return new Promise( (resolve, reject) =>{

        Usuario.find({}, 'nombre email rol')
                .or( [ {'nombre': regex} , {'email':regex} ] )
                .exec( (err, usuarios)=>{

                    if( err ){
                        reject('Error al cargar usuarios')
                    }else{
                        resolve(usuarios)
                    }

                })

    })
    
}

module.exports = app