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

// Ver el promedio de calificaciones de cada alumno en las materias del maestro
export const getPromediosPorAlumno = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const maestroId = req.usuario?.id;

        // 1. Obtener las materias asignadas al maestro
        const materias = await Materia.findAll({ where: { maestro_id: maestroId } });
        const materiasIds = materias.map(m => m.id);

        if (materiasIds.length === 0) {
            res.json([]);
            return;
        }

        // 2. Obtener todas las calificaciones de esas materias
        const calificaciones = await Calificacion.findAll({
            where: { materia_id: materiasIds },
            include: [{ model: Usuario, as: 'alumno', attributes: ['id', 'nombre'] }]
        });

        // 3. Agrupar y calcular promedios con JavaScript 
        const alumnosMap = new Map();

        calificaciones.forEach((calif: any) => {
            const id = calif.alumno_id;
            if (!alumnosMap.has(id)) {
                alumnosMap.set(id, {
                    id: id,
                    nombre: calif.alumno.nombre,
                    suma: 0,
                    cantidad: 0
                });
            }
            const data = alumnosMap.get(id);
            data.suma += Number(calif.calificacion);
            data.cantidad += 1;
        });

        // 4. Formatear la respuesta final
        const promedios = Array.from(alumnosMap.values()).map(a => ({
            id: a.id,
            nombre: a.nombre,
            promedio: Number((a.suma / a.cantidad).toFixed(2))
        }));

        res.json(promedios);
    } catch (error) {
        console.error('Error al obtener promedios:', error);
        res.status(500).json({ error: 'Error interno al obtener promedios' });
    }
};

// Exportar calificaciones a CSV
export const exportarCalificacionesCSV = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const maestroId = req.usuario?.id;

        const materias = await Materia.findAll({ where: { maestro_id: maestroId } });
        const materiasIds = materias.map(m => m.id);

        const calificaciones = await Calificacion.findAll({
            where: { materia_id: materiasIds },
            include: [
                { model: Usuario, as: 'alumno', attributes: ['nombre'] },
                { model: Materia, as: 'materia', attributes: ['nombre'] }
            ]
        });

        // Construir el string del CSV con los campos mínimos requeridos
        let csv = 'Nombre del Alumno,Materia,Calificacion,Fecha\n';
        
        calificaciones.forEach((c: any) => {
            // Formatear la fecha para que sea legible
            const fecha = new Date(c.fecha_registro).toLocaleDateString('es-MX');
            csv += `"${c.alumno.nombre}","${c.materia.nombre}",${c.calificacion},"${fecha}"\n`;
        });

        // Configurar los headers de Express para forzar la descarga del archivo
        res.header('Content-Type', 'text/csv');
        res.attachment('calificaciones.csv');
        res.send(csv);

    } catch (error) {
        console.error('Error al exportar CSV:', error);
        res.status(500).json({ error: 'Error interno al generar el archivo CSV' });
    }
};