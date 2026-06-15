import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { MaestroDashboard } from './pages/MaestroDashboard';
import { AlumnoDashboard } from './pages/AlumnoDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Ruta de MaestroDashboard*/}
        <Route path="/maestro/dashboard" element={<MaestroDashboard />} />
        
        {/* Ruta de AlumnoDashboard */}
        <Route path="/alumno/dashboard" element={<AlumnoDashboard />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;