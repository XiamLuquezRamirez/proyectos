import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Parametros from './pages/parametros';
import Proyectos from './pages/proyectos';
// Importar otros componentes de páginas...

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/parametros" element={<Parametros />} />
            <Route path="/proyectos" element={<Proyectos />} />
            {/* Otras rutas */}
        </Routes>
    );
};

export default AppRoutes; 