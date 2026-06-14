import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por correo
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        // Comparar contraseñas
        const validPassword = await bcrypt.compare(password, usuario.password_hash);
        if (!validPassword) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }

        // Generar el token
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error("🔥 Error real detectado en el login:", error);
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
};