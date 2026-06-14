import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Usuario, Materia, Calificacion } from '../models';

// Ver las materias en las que el alumno está inscrito
export const getMateriasInscritas = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alumnoId = req.usuario?.id;

        const alumno = await Usuario.findByPk(alumnoId, {
            include: [{
                model: Materia,
                as: 'materias_inscritas',
                attributes: ['id', 'nombre', 'descripcion'],
                through: { attributes: [] } // Ocultamos los datos de la tabla intermedia (Inscripciones) para limpiar el JSON
            }]
        });

        // Retornamos solo el arreglo de materias
        res.json(alumno?.get('materias_inscritas') || []);
    } catch (error) {
        console.error('Error al obtener materias del alumno:', error);
        res.status(500).json({ error: 'Error interno al obtener materias inscritas' });
    }
};

// Ver las calificaciones del alumno
export const getCalificaciones = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alumnoId = req.usuario?.id;

        const calificaciones = await Calificacion.findAll({
            where: { alumno_id: alumnoId },
            include: [{
                model: Materia,
                as: 'materia',
                attributes: ['nombre']
            }],
            attributes: ['calificacion', 'periodo', 'observaciones', 'fecha_registro']
        });

        res.json(calificaciones);
    } catch (error) {
        console.error('Error al obtener calificaciones del alumno:', error);
        res.status(500).json({ error: 'Error interno al obtener calificaciones' });
    }
};