import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Acionamentos from './pages/Acionamentos';
import Boletos from './pages/Boletos';
import Recuperacoes from './pages/Recuperacoes';
import Acordos from './pages/Acordos';
import Devedores from './pages/Devedores';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="acionamentos" element={<Acionamentos />} />
            <Route path="boletos" element={<Boletos />} />
            <Route path="recuperacoes" element={<Recuperacoes />} />
            <Route path="acordos" element={<Acordos />} />
            <Route path="devedores" element={<Devedores />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
