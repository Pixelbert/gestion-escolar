import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { sequelize } from './config/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API de Gestión Escolar funcionando 🚀' });
});

// Iniciar el servidor y comprobar la conexión a PostgreSQL
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL con Sequelize establecida correctamente.');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
};

startServer();