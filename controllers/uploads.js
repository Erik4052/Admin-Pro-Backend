const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualiarImagen } = require("../helpers/actualizar-imagen");
const path = require('path');
const fs = require('fs')
const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;//tipo:medicos/hospitales/usuarios
    const id = req.params.id;
    //Validar tipo 
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)'
        })
    }
    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay ningún archivo"
        });
    }
    //Procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: "No es una extensión válida"
        });
    }
    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la imagen
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen'
            });
        }

        //Actualiar base de datos
        actualiarImagen(tipo,id,nombreArchivo);

        res.json({
        ok: true,
        msg:'Archivo subido',
        nombreArchivo 
    });
    });

}

const retornarImagen = (req,res = response) =>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    
    //Imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/noImg.jpg`);
        res.sendFile(pathImg);

    }
    
}


module.exports = {
    fileUpload,
    retornarImagen
}