
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
const actualizartHospital = async(req,res = response) =>{
    const hospitalId = req.params.id; 
    const uid =  req.uid;

    try {
        const hospital = await Hospital.findById( hospitalId);
        if(!hospital){
            return res.status(404).json({
                ok:true,
                msg:'hospital no encontrado'
            });
        }
        const cambiosHospital = {//Obtenemos todo el body de la request, lo que permite actualiar varios campos del objeto
            ...req.body,
            usuario:uid,
            
        }
        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId,cambiosHospital,{new:true});
        
        res.json({
        ok:true,
        hospital:hospitalActualizado
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hubo un problema al actualizar el hospital'
        });
    }
   
}

const borrarHospital = async(req,res = response) =>{
    const hospitalId = req.params.id; 

    try {
        const hospital = await Hospital.findById( hospitalId);
        if(!hospital){
            return res.status(404).json({
                ok:true,
                msg:'hospital no encontrado'
            });
        }
        await Hospital.findOneAndDelete(hospitalId);
        res.json({
        ok:true,
        msg:'Hospital eliminado'
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hubo un problema al eliminar el hospital'
        });
    }
}



module.exports = {
    getHospitales,
    borrarHospital,
    actualizartHospital,
    creartHospital
}