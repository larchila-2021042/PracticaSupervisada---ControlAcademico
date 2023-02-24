const { request, response } = require('express');

// Verificar si es admin
const esAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token proiemrp'
        });
    }

    // Verificar que el rol sea ADMIN_ROLE
    const { rol, nombre } = req.usuario;

    if (rol !== 'ROLE_MAESTRO') {
        return res.status(500).json({
            msg: `${nombre} no es maestro - No tiene acceso a esta funcion`
        });
    }
    next();
}


//Operador rest u operador spread 
const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        next();
    }
}


module.exports = {
    tieneRole,
    esAdminRole
}