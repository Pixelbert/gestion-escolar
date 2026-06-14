import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { MaestroDashboard } from './pages/MaestroDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Aquí conectamos nuestro nuevo componente */}
        <Route path="/maestro/dashboard" element={<MaestroDashboard />} />
        
        {/* Este todavía es temporal hasta que hagamos el del alumno */}
        <Route path="/alumno/dashboard" element={<h1 className="text-center mt-10 text-2xl">Dashboard Alumno 🎓</h1>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;