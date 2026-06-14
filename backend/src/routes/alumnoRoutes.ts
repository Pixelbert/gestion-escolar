import { Router } from 'express';
import { getMateriasInscritas, getCalificaciones } from '../controllers/alumnoController';
import { verificarToken, verificarRol } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas aquí requerirán token y rol de alumno
router.use(verificarToken, verificarRol(['alumno']));

router.get('/materias', getMateriasInscritas);
router.get('/calificaciones', getCalificaciones);

export default router;