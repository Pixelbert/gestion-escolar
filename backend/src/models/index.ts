import { Usuario } from './Usuario';
import { Materia } from './Materia';
import { Inscripcion } from './Inscripcion';
import { Calificacion } from './Calificacion';

// Un Maestro tiene muchas Materias
Usuario.hasMany(Materia, { foreignKey: 'maestro_id', as: 'materias' });
Materia.belongsTo(Usuario, { foreignKey: 'maestro_id', as: 'maestro' });

// Relación Alumno - Materia (Muchos a Muchos a través de Inscripciones)
Usuario.belongsToMany(Materia, { through: Inscripcion, foreignKey: 'alumno_id', as: 'materias_inscritas' });
Materia.belongsToMany(Usuario, { through: Inscripcion, foreignKey: 'materia_id', as: 'alumnos_inscritos' });

// Relaciones para las Calificaciones
Calificacion.belongsTo(Usuario, { foreignKey: 'alumno_id', as: 'alumno' });
Usuario.hasMany(Calificacion, { foreignKey: 'alumno_id', as: 'calificaciones' });

Calificacion.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });
Materia.hasMany(Calificacion, { foreignKey: 'materia_id', as: 'calificaciones' });

export { Usuario, Materia, Inscripcion, Calificacion };