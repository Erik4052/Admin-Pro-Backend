
const {response} = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async(req,res = response) =>{

    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre img',);


    res.json({
        ok:true,
        hospitales:hospitales
    })
}

const creartHospital = async(req,res = response) =>{
    
    const uid = req.uid;
    const hospital = new Hospital({
    
        usuario:uid,
        ...req.body
    
    });
    try {

       const hospitalDB = await hospital.save();
        res.json({
            ok:true,
            hospital:hospitalDB
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            mgs:'Hable con el adminstrador'
        })
    }

   
}
const actualizartHospital = (req,res = response) =>{
    res.json({
        ok:true,
        msg:'actualizar Hospital'
    })
}

const borrartHospital = (req,res = response) =>{
    res.json({
        ok:true,
        msg:'borrar Hospital'
    })
}



module.exports = {
    getHospitales,
    borrartHospital,
    actualizartHospital,
    creartHospital
}