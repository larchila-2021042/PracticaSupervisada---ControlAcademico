const { Router } = require('express');
const { check } = require('express-validator');
const { putAsignacion } = require('../controllers/asignacion');

//Controllers
const { getCursos, getCursoPorID, postCurso, putCurso, deleteCurso } = require('../controllers/curso');
const { existeCursoPorId, esRoleValido } = require('../helpers/db-validators');
const { existeCursoAsignado, limiteAsignaciones, borrarDatos } = require('../middlewares/validar-asignacion');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const router = Router();

//Manejo de rutas
router.get('/', getCursos);


router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCursoPorId),
    validarCampos
], getCursoPorID);

//Crear Curso
router.post('/agregar', [
    validarJWT,
    esAdminRole,
    tieneRole('ROLE_MAESTRO'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCurso);

// Acturalizar Curso - privado cualquier persona con un token valido
router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ROLE_MAESTRO'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCursoPorId),
    validarCampos
], putCurso);

// Borrar una categoria - privado - solo el admin ouede eliminar categorias
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    borrarDatos,
    //tieneRole('ROLE_MAESTRO'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCursoPorId),
    validarCampos
], deleteCurso);


module.exports = router;