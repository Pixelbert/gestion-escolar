import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Calificacion {
    calificacion: string;
    periodo: string;
    observaciones: string;
    fecha_registro: string;
    materia: {
        nombre: string;
    };
}

export const AlumnoDashboard = () => {
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const navigate = useNavigate();

    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : { nombre: 'Alumno' };

    useEffect(() => {
        const cargarCalificaciones = async () => {
            try {
                const response = await api.get('/alumnos/calificaciones');
                setCalificaciones(response.data);
            } catch (error) {
                console.error('Error al cargar las calificaciones', error);
            }
        };

        cargarCalificaciones();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    // Cálculo del promedio general
    const promedioGeneral = calificaciones.length > 0
        ? (calificaciones.reduce((acc, curr) => acc + Number(curr.calificacion), 0) / calificaciones.length).toFixed(2)
        : '0.00';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Barra de Navegación */}
            <nav className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Portal del Alumno</h1>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline">Hola, {usuario.nombre}</span>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold text-sm transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-6xl mx-auto">
                {/* Tarjeta de Promedio General */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-700">Promedio General</h2>
                        <p className="text-sm text-gray-500">Basado en todas tus materias calificadas</p>
                    </div>
                    <div className="text-4xl font-black text-green-600">
                        {promedioGeneral}
                    </div>
                </div>

                {/* Tabla de Calificaciones */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-200 pb-2 mb-4">
                        Mis Calificaciones
                    </h2>
                    
                    {calificaciones.length === 0 ? (
                        <p className="text-gray-500">Aún no tienes calificaciones registradas.</p>
                    ) : (
                        <div className="bg-white rounded shadow overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materia</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {calificaciones.map((calif, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900">{calif.materia.nombre}</td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{calif.periodo}</td>
                                            <td className="py-4 px-6 text-sm font-bold text-gray-800">{calif.calificacion}</td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{calif.observaciones || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};