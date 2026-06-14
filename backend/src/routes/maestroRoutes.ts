import { Router } from 'express';
import { getAlumnos, getMateriasAsignadas, registrarCalificacion } from '../controllers/maestroController';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas aquí requerirán token y rol de maestro
router.use(verificarToken, verificarRol(['maestro']));

router.get('/alumnos', getAlumnos);
router.get('/materias', getMateriasAsignadas);
router.post('/calificaciones', registrarCalificacion);

export default router;