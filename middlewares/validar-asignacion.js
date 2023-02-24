const { response, request } = require('express');
const Asignacion = require('../models/asignacion');



const existeCursoAsignado = async (req = request, res = response, next) => {
    const { ...body } = req.body;
    const _id = req.usuario.id
    const query = { curso: body.curso, usuario: _id };

    const existeCurso = await Asignacion.find(query);
    if (existeCurso.length != 0) {
        res.json({
            msg: `El curso con el id:${body.curso} ya esta registrado en este usuario`,
            existeCurso
        })

    } else {
        next();
    }
}



const limiteAsignaciones = async (req = request, res = response, next) => {
    const _id = req.usuario.id
    const query = { usuario: _id };
    const existeAsignacion = await Asignacion.countDocuments(query);
    if (existeAsignacion >= 3) {
        res.json({
            msg: `El usuario con el id:${_id} ya esta asignado a tres cursos diferentes`,
        })
    } else {
        next();
    }
}

const borrarDatos = async (req = request, res = response, next) => { 
    const { ...body } = req.body;
    const query = { curso: body.curso }; 
    const eliminacionCurso = await Asignacion.find(query); 
    if (eliminacionCurso) { 
        const usuarioEliminadoCurso = await Asignacion.deleteOne({ curso: body.curso }) 
                next() 
    } else { 
        next() 
    } }


module.exports = {
    existeCursoAsignado,
    borrarDatos,
    limiteAsignaciones
}