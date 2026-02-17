import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetDashboard from './pages/PetDashboard';
import OwnersPage from './pages/OwnersPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';

function App() {
  return (
    <Router>
      <Routes>
          //Ruta inicial: El Login
        <Route path="/" element={<LoginPage />} />

          //Ruta de Registro
        <Route path="/register" element={<RegisterPage />} />

          //Ruta de Dueños
        <Route path="/owners" element={<OwnersPage />} />

          //Ruta del Dashboard Real (CRUD de mascotas)
        <Route path="/dashboard" element={<PetDashboard />} />

          //Ruta de Historial Clínico
        <Route path="/medical-history" element={<MedicalHistoryPage />} />

          //Si la URL no existe, vuelve al Login
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
