import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetDashboard from './pages/PetDashboard'; // ✅ Importamos el componente real

function App() {
  return (
    <Router>
      <Routes>
          //Ruta inicial: El Login
        <Route path="/" element={<LoginPage />} />

          //Ruta de Registro
        <Route path="/register" element={<RegisterPage />} />

          //Ruta del Dashboard Real (CRUD de mascotas)
        <Route path="/dashboard" element={<PetDashboard />} />

          //Si la URL no existe, vuelve al Login
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
