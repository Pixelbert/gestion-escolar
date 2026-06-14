import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Usuario, Materia } from '../models';

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