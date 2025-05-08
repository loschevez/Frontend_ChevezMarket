import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/encabezado/Encabezado";
import Productos from "./views/Productos";
import Clientes from "./views/Clientes"; // Ya está importado
import Tipos from "./views/tipo";
import Compras from './views/compras';
import "./App.css";
import Hanabi from "./Imagenes/Hanabi.jpg";

const App = () => {
  return (
    <Router>
      <div
        style={{
          backgroundImage: `url(${Hanabi})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <main className="margen-superior-main">
          <Encabezado />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/tipo" element={<Tipos />} />
            <Route path="/compras" element={<Compras />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;