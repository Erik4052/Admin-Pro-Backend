const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario'); 
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res = response) => {
    //user: erik4052
    //contraseña: kakiko99
    const desde = Number(req.query.desde) || 0;
    
    const [usuarios,total] = await Promise.all([
         Usuario.find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),
        Usuario.countDocuments()

    ]);
    res.json({
        ok:true,
        usuarios:usuarios,
        total:total
    });



}
const crearUsuario = async (req, res = response) => {
    //user: erik4052
    //contraseña: kakiko99
    //console.log(req.body); //Se consulta la información del Body
    const { email,password} = req.body;

   
    
    try {

        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya está registrado'
            });
        }
        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();
         //Generar token = JWT
         const token = await generarJWT(usuario.id);     
        res.json({
            ok:true,
            usuario:usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... revisar logs'
        });
    }  
}
const actualizarUsuario = async(req, res = response) =>{
     //TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    
try {
    const usuarioDB = await Usuario.findById(uid);
    if(!usuarioDB){
        return res.status(404).json({
            ok:false,
            msg:'No existe un usuario con ese id'
        });
    }
    
    //Actualizaciones
    const {password, google, email, ...campos} = req.body;
    
    if(usuarioDB.email !== email){
        const existeEmail = await Usuario.findOne({email:email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe un usuario con ese email'
            });
        }
    }
    campos.email = email;

   const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true});


    res.json({
        ok:true,
        usuario:usuarioActualizado
    })
    
} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:'error inesperado'
    });
}

}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok:true,
            mgs:'El usuario se fue a chingar a su madre'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }

   

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}