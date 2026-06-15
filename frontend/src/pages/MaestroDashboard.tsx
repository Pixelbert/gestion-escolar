import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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

interface Promedio {
    id: number;
    nombre: string;
    promedio: number;
}

export const MaestroDashboard = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [promedios, setPromedios] = useState<Promedio[]>([]);
    
    // Estados para el Modal de Calificaciones
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
    const [formulario, setFormulario] = useState({
        materia_id: '',
        calificacion: '',
        periodo: 'Primer Parcial',
        observaciones: ''
    });

    const navigate = useNavigate();
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : { nombre: 'Maestro' };

    const cargarDatosIniciales = async () => {
        try {
            const [resMaterias, resAlumnos, resPromedios] = await Promise.all([
                api.get('/maestros/materias'),
                api.get('/maestros/alumnos'),
                api.get('/maestros/promedios')
            ]);
            setMaterias(resMaterias.data);
            setAlumnos(resAlumnos.data);
            setPromedios(resPromedios.data);
            
            // Pre-seleccionar la primera materia en el formulario si existen
            if (resMaterias.data.length > 0) {
                setFormulario(prev => ({ ...prev, materia_id: resMaterias.data[0].id.toString() }));
            }
        } catch (error) {
            console.error('Error al cargar la información', error);
        }
    };

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    const handleExportarCSV = async () => {
        try {
            const response = await api.get('/maestros/exportar', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'calificaciones.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al exportar CSV', error);
            alert('Hubo un problema al generar el archivo.');
        }
    };

    const abrirModalCalificacion = (alumno: Alumno) => {
        setAlumnoSeleccionado(alumno);
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
        setAlumnoSeleccionado(null);
        setFormulario(prev => ({ ...prev, calificacion: '', observaciones: '' }));
    };

    const handleSubmitCalificacion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/maestros/calificaciones', {
                alumno_id: alumnoSeleccionado?.id,
                materia_id: Number(formulario.materia_id),
                calificacion: Number(formulario.calificacion),
                periodo: formulario.periodo,
                observaciones: formulario.observaciones
            });
            
            alert('Calificación registrada correctamente');
            cerrarModal();
            // Refrescar los promedios en la tabla inmediatamente
            const resPromedios = await api.get('/maestros/promedios');
            setPromedios(resPromedios.data);
        } catch (error: any) {
            console.error('Error al registrar calificación', error);
            alert(error.response?.data?.error || 'Error al guardar la calificación');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10 relative">
            <nav className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Portal Docente</h1>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline">Hola, {usuario.nombre}</span>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold text-sm transition">
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-6xl mx-auto space-y-10">
                <div className="flex justify-end">
                    <button onClick={handleExportarCSV} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow flex items-center gap-2 transition">
                        📊 Descargar Calificaciones (CSV)
                    </button>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">Mis Materias Asignadas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {materias.map(materia => (
                            <div key={materia.id} className="bg-white p-5 rounded shadow border-l-4 border-blue-500">
                                <h3 className="font-bold text-lg text-gray-800">{materia.nombre}</h3>
                                <p className="text-sm text-gray-600 mt-2">{materia.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tabla de Alumnos con Botón de Acción */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">Directorio de Alumnos</h2>
                        <div className="bg-white rounded shadow overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {alumnos.map(alumno => (
                                        <tr key={alumno.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{alumno.nombre}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{alumno.email}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button 
                                                    onClick={() => abrirModalCalificacion(alumno)}
                                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm font-semibold transition"
                                                >
                                                    Calificar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">Promedios por Alumno</h2>
                        <div className="bg-white rounded shadow overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {promedios.length === 0 ? (
                                        <tr><td colSpan={2} className="py-4 text-center text-sm text-gray-500">Sin calificaciones registradas.</td></tr>
                                    ) : (
                                        promedios.map(prom => (
                                            <tr key={prom.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{prom.nombre}</td>
                                                <td className="py-3 px-4 text-sm font-bold text-blue-600">{prom.promedio}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>

            {/* Modal Flotante de Calificación */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">Calificar Alumno</h3>
                            <button onClick={cerrarModal} className="text-blue-100 hover:text-white font-bold text-xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmitCalificacion} className="p-6 space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Ingresando calificación para: <span className="font-bold text-gray-900">{alumnoSeleccionado?.nombre}</span>
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                                <select 
                                    className="w-full border-gray-300 rounded shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 border"
                                    value={formulario.materia_id}
                                    onChange={(e) => setFormulario({...formulario, materia_id: e.target.value})}
                                    required
                                >
                                    {materias.map(m => (
                                        <option key={m.id} value={m.id}>{m.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                                    <select 
                                        className="w-full border-gray-300 rounded shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 border"
                                        value={formulario.periodo}
                                        onChange={(e) => setFormulario({...formulario, periodo: e.target.value})}
                                        required
                                    >
                                        <option value="Primer Parcial">Primer Parcial</option>
                                        <option value="Segundo Parcial">Segundo Parcial</option>
                                        <option value="Final">Final</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calificación (0-10)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        className="w-full border-gray-300 rounded shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 border"
                                        value={formulario.calificacion}
                                        onChange={(e) => setFormulario({...formulario, calificacion: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
                                <textarea 
                                    className="w-full border-gray-300 rounded shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 border"
                                    rows={2}
                                    value={formulario.observaciones}
                                    onChange={(e) => setFormulario({...formulario, observaciones: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={cerrarModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
                                    Guardar Calificación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};