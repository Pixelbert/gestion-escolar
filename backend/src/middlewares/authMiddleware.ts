import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz de Request nativa de Express para poder inyectar el usuario autenticado
export interface AuthRequest extends Request {
    usuario?: {
        id: number;
        rol: string;
    };
}

// 1. Guardia que verifica si el usuario trae un token válido
export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
   
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        res.status(401).json({ error: 'Acceso denegado. No hay token provisto.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, rol: string };
        req.usuario = decoded; // Guardamos los datos decodificados en la petición
        next(); // Le decimos a Express que puede continuar a la ruta solicitada
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// 2. Guardia que verifica si el rol del usuario empata con el permitido
export const verificarRol = (rolesPermitidos: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.usuario) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            res.status(403).json({ error: 'Acceso denegado: No tienes permisos de ' + rolesPermitidos.join(' o ') });
            return;
        }

        next();
    };
};