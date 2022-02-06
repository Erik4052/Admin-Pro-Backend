/* 
Path:'/api/hospitales'
*/
/* 
Path:'/api/hospitales'
*/
const {Router} = require('express');
const {check}= require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getMedicos,
    crearMedico,
    actualizartMedico,
    borrarMedico
} = require('../controllers/medicos')
const router = Router();

 router.get('/',getMedicos );
 router.post(
        '/', 
        [
            validarJWT,
            check('nombre', 'El nombre es un campo requerido').not().isEmpty(),
            check('hospital', 'El hospital del id debe ser válido').isMongoId(),
            validarCampos

        ], 
        crearMedico);
 router.put(
     '/:id',
     [ ],
    actualizartMedico);

router.delete('/:id', borrarMedico);






module.exports = router;
