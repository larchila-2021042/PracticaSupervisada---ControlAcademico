const { request, response } = require('express');
const Curso = require('../models/curso');

const getCursos = async (req = request, res = response) => {
    //condiciones del get
    const query = { estado: true };

    const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query).populate('usuario', 'nombre')
    ]);
    res.json({
        msg: 'get Api - Controlador Curso',
        listaCursos
    });

}

const getCursoPorID = async (req = request, res = response) => {
    const { id } = req.params;
    const cursoById = await Curso.findById(id).populate('usuario', 'nombre');

    res.status(201).json(cursoById);
}

const getCursoAsignado = async (req = request, res = response) => {
    const { usuario } = req.body;
    try {
        const cursoAsignado = await Curso.find({ usuario: usuario });

        res.json(
            cursoAsignado
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en Controlador Curso'
        });
    }
}


const postCurso = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const cursoDB = await Curso.findOne({ nombre })

    //Verficar si exisye la categoria
    if (cursoDB) {
        return res.status(400).json({
            msg: `El curso ${cursoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const curso = new Curso(data);

    //Guardar en DB
    await curso.save();
    res.status(201).json(curso);
}

const putCurso = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;
    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    //Editar o actualizar el curso
    const curso = await Curso.findByIdAndUpdate(id, resto, { new: true });
    res.status(201).json(curso);
}

const deleteCurso = async (req = request, res = response) => {

    const { id } = req.params;

    //Eliminar fisicamente de la DB
    const curso = await Curso.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
    //const curso = await Curso.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(curso);
}

module.exports = {
    getCursos,
    getCursoPorID,
    getCursoAsignado,
    postCurso,
    putCurso,
    deleteCurso
} 