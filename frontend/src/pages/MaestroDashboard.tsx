import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Definimos las interfaces para que TypeScript nos ayude con el autocompletado
interface Materia {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Alumno {
    id: number;
    nombre: string;
    email: string;
}

export const MaestroDashboard = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const navigate = useNavigate();

    // Rescatamos el nombre del maestro para darle la bienvenida
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : { nombre: 'Maestro' };

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                // Hacemos ambas peticiones al mismo tiempo para que cargue más rápido
                const [resMaterias, resAlumnos] = await Promise.all([
                    api.get('/maestros/materias'),
                    api.get('/maestros/alumnos')
                ]);
                
                setMaterias(resMaterias.data);
                setAlumnos(resAlumnos.data);
            } catch (error) {
                console.error('Error al cargar la información del dashboard', error);
            }
        };

        cargarDatosIniciales();
    }, []);

    // Requisito: Logout funcional
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Barra de Navegación (Header) */}
            <nav className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Portal Docente</h1>
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
                {/* Sección de Materias Asignadas */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">
                        Mis Materias Asignadas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materias.length === 0 ? (
                            <p className="text-gray-500">No tienes materias asignadas este periodo.</p>
                        ) : (
                            materias.map(materia => (
                                <div key={materia.id} className="bg-white p-5 rounded shadow border-l-4 border-blue-500 hover:shadow-lg transition">
                                    <h3 className="font-bold text-lg text-gray-800">{materia.nombre}</h3>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{materia.descripcion}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Sección de Lista de Alumnos */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-200 pb-2 mb-4">
                        Alumnos Registrados en el Sistema
                    </h2>
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Alumno</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {alumnos.map(alumno => (
                                    <tr key={alumno.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm text-gray-500">{alumno.id}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{alumno.nombre}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{alumno.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};