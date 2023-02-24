const { Schema, model } = require('mongoose');

const AsignacionSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la asignacion es obligatorio'],
        unique: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    descripcion: {
        type: String,
    },
    estado:{
        type:Boolean,
        default: true,
        require: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    }
});


module.exports = model('Asignacion', AsignacionSchema);