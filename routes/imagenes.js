const express = require('express')
const fs = require('fs')
const app = express()


// Rutas
app.get('/:tipo/:img', (req, res, next)=>{

    let tipo = req.params.tipo
    let img = req.params.img

    let path = `./uploads/${ tipo }/${ img }`


    fs.exists(path, existe =>{

        if(!existe){
            path = './assets/no-image.jpg'
        }

        res.sendfile(path)

    })

    

    

})

module.exports = app
