
const {response} = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req,res = response) =>{

        const medicos = await Medico.find()
                                    .populate('usuario','nombre img')
                                    .populate('hospital', 'nombre');
            res.json({
                ok:true,
                medicos:medicos
            });
            
}

const crearMedico = async(req,res = response) =>{
    
    const uid = req.uid; 
    const medico = new Medico({
        usuario:uid,
        ...req.body
    })

    try {
        const medicoDB = await medico.save();
        res.json({
            ok:true,
            medico:medicoDB
        });
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Ha ocurrido un error, hable con el adminsitrador'
        });
    }
}
const actualizarMedico = async(req,res = response) =>{
    const medicoId = req.params.id;
    const uid = req.uid;
    //console.log(uid);

    try {
        const medico = await Medico.findById(medicoId);
        if(!medico){
            return res.status(404).json({
                ok:false,
                msg:'Médico no encontrado'
            });
        }
        cambiosMedico = {
            ...req.body,//Obtiene los datos del body
            usuario:uid
        }
        const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, {new:true});
        res.json({
            ok:true,
            medico:medicoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hubo un problema al actualizar el médico'
        })
    }

}

const borrarMedico = async (req,res = response) =>{
    const medicoId = req.params.id;
    //console.log(medicoId);
     try {
        const medico = await Medico.findById(medicoId);
        if(!medico){
           return res.status(404).json({ 
                ok:false,
                msg:'Médico no encontrado'
            });
        }
        await Medico.findByIdAndDelete(medicoId);
        res.json({
            ok:true,
            msg:'Médico eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hubo un problema al eliminar el médico'
        });
    } 
}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}