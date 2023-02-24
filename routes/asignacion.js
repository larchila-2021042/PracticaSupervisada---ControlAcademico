const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getAsignaciones, getAsignacionPorID, postAsignacion, putAsignacion, deleteAsignacion } = require('../controllers/asignacion');
const { existeProductoPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');
const { existeCursoAsignado, limiteAsignaciones } = require('../middlewares/validar-asignacion');

const router = Router();

//Manejo de rutas
router.get('/', getAsignaciones);

router.get('/:id', [
    validarJWT,
    tieneRole('ROLE_MAESTRO','ROLE_ALUMNO'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getAsignacionPorID);

//Crear Asignacion
router.post('/agregar', [
    validarJWT,
    tieneRole('ROLE_ALUMNO'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    existeCursoAsignado,
    limiteAsignaciones,
    validarCampos
], postAsignacion);

// Acturalizar Asignacion - privado cualquier persona con un token valido
router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    existeCursoAsignado,
    validarCampos
], putAsignacion);

// Borrar una Asignacion - privado - solo el admin ouede eliminar categorias
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ROLE_MAESTRO'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteAsignacion);


module.exports = router;