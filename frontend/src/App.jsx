import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';

export default function App() { return <Layout><Routes><Route path="/" element={<Dashboard />} /><Route path="/productos" element={<Productos />} /><Route path="/categorias" element={<Categorias />} /><Route path="/proveedores" element={<Proveedores />} /></Routes></Layout>; }
