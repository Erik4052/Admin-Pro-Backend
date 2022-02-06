const bcrypt = require("bcryptjs");
const { response } = require("express");
const { googleVerify } = require("../helpers/google-verify");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require('../models/usuario');

const login = async(req, res = response) => {
    const {email, password} = req.body
    try {
        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }
        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña no válida'
            });
        }
        //Generar token = JWT

        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok:true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }


}

const googleSignIn = async(req, res = response) => {

    const googleToken =  req.body.token;
    try {
        const {name, email, picture} = await googleVerify(googleToken);
        
        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if(!usuarioDB){
            usuario = new Usuario({
                //Si no existe el usuario
                nombre:name,
                email:email,
                password:'@@@',
                img:picture,
                google:true
            });
        }else{
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en DB
        await usuario.save();

         //Generar token = JWT
         const token = await generarJWT(usuario.id);
         res.json({
             ok:true,
             token
         });
/*              
        res.json({
            ok:true,
            msg:'Google Signin',
            name,
            email,
            picture
        }); */
        
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg:'Token no válido',
            
        });
    }

}

module.exports = {
    login,
    googleSignIn
}