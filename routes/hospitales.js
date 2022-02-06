/* 
Path:'/api/hospitales'
*/
const {Router} = require('express');
const {check}= require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getHospitales,
    borrartHospital,
    actualizartHospital,
    creartHospital
} = require('../controllers/hospitales')
const router = Router();

 router.get('/',getHospitales );
 router.post(
        '/', 
        [ 
            validarJWT,
            check('nombre', 'El nombre del hospital es necesario ').not().isEmpty(),
            validarCampos  
        ], 
        creartHospital);
 router.put(
     '/:id',
     [ ],
     actualizartHospital);

router.delete('/:id', borrartHospital);






module.exports = router;
