import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Usuario, Materia, Calificacion, Inscripcion } from '../models';

// Ver los alumnos registrados en el sistema
export const getAlumnos = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alumnos = await Usuario.findAll({
            where: { rol: 'alumno' },
            attributes: ['id', 'nombre', 'email'] // Excluimos el password_hash por seguridad
        });
        
        res.json(alumnos);
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener alumnos' });
    }
};

// Ver las materias asignadas al maestro autenticado
export const getMateriasAsignadas = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const maestroId = req.usuario?.id;

        const materias = await Materia.findAll({
            where: { maestro_id: maestroId },
            attributes: ['id', 'nombre', 'descripcion']
        });

        res.json(materias);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener materias' });
    }
};

// Registrar o editar calificación (Upsert)
export const registrarCalificacion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const maestroId = req.usuario?.id;
        const { alumno_id, materia_id, calificacion, periodo, observaciones } = req.body;

        // 1. Validar que la materia solicitada pertenezca realmente al maestro que hace la petición
        const materiaAsignada = await Materia.findOne({
            where: { id: materia_id, maestro_id: maestroId }
        });

        if (!materiaAsignada) {
            res.status(403).json({ error: 'No tienes permiso para calificar esta materia' });
            return;
        }

        // 2. Validar que el alumno esté inscrito en dicha materia
        const inscripcion = await Inscripcion.findOne({
            where: { alumno_id, materia_id }
        });

        if (!inscripcion) {
            res.status(400).json({ error: 'El alumno no está inscrito en esta materia' });
            return;
        }

        // 3. Buscar si ya existe una calificación para este alumno, materia y periodo
        let registroCalificacion = await Calificacion.findOne({
            where: { alumno_id, materia_id, periodo }
        });

        if (registroCalificacion) {
            // Si ya existe, la editamos
            registroCalificacion.calificacion = calificacion;
            registroCalificacion.observaciones = observaciones;
            await registroCalificacion.save();
            
            res.json({ mensaje: 'Calificación actualizada correctamente', data: registroCalificacion });
        } else {
            // Si no existe, creamos un nuevo registro
            registroCalificacion = await Calificacion.create({
                alumno_id,
                materia_id,
                calificacion,
                periodo,
                observaciones
            });
            
            res.status(201).json({ mensaje: 'Calificación registrada correctamente', data: registroCalificacion });
        }
    } catch (error) {
        console.error('Error al registrar/editar calificación:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la calificación' });
    }
};