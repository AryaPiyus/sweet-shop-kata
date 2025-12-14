import { Routes, Route } from 'react-router-dom'; 
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* 1. The Landing Page is now the Dashboard */}
      <Route path="/" element={<Dashboard />} />
      
      {/* 2. Public Auth Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* 3. Keep the old path just in case, or for clarity */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;