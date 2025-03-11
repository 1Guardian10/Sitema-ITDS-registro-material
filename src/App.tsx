import Lista from "./components/ListM";
import Head from "./components/Head";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FormMaterial from "./components/FormMaterial";
import ListaP from "./components/Prestamos/ListP";
import FormLoan from "./components/Prestamos/FormLoan";
import ListaR from "./components/ListR";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de selección de rol */}
        <Route path="/" element={<Head />} />

        {/* Rutas para Materiales */}
        <Route path="/materiales" element={<Head />}>
          <Route index element={<Lista />} />
          <Route path="agregarM" element={<FormMaterial page="materiales" />} />
          <Route path="agregar/:idParametro" element={<FormMaterial page="materiales"/>} />
          <Route path="agregarP" element={<FormLoan page="materiales"/>} />
          <Route path="*" element={<Navigate to="/materiales" replace />} />
        </Route>
        {/* Ruta de prestamos */}
        <Route path="/prestamos" element={<Head />}>
          <Route index element={<ListaP />} />
          <Route path="agregarM" element={<FormMaterial page="prestamos"/>} />
          <Route path="agregarP" element={<FormLoan page="prestamos"/>} />
          <Route path="agregarP/:idParametro" element={<FormLoan page="prestamos"/>} />
          <Route path="*" element={<Navigate to="/prestamos" replace />} />
        </Route>
        {/* Ruta de reporte de prestamos */}
        <Route path="/reportes" element={<Head />}>
          <Route index element={<ListaR />} />
          <Route path="agregarM" element={<FormMaterial page="reportes"/>} />
          <Route path="agregarP" element={<FormLoan page="reportes"/>} />
          <Route path="agregarP/:idParametro" element={<FormLoan page="reportes"/>} />
          <Route path="*" element={<Navigate to="/reportes" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;