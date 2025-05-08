import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "/vite.svg"; // Importación del logo de la ferretería
import "bootstrap-icons/font/bootstrap-icons.css"; // Importación de íconos de Bootstrap
import HouseIcon from "../Icons/HouseIcon";

import "../../App.css"; // Estilos personalizados de la aplicación

const Encabezado = () => {
  // Estado para controlar el colapso del menú lateral
  const [estaColapsado, setEstaColapsado] = useState(false);
  
  // Hook para manejar la navegación entre rutas
  const navegar = useNavigate();
  
  // Hook para obtener la ubicación actual de la ruta
  const ubicacion = useLocation();

  // Validación del estado de autenticación con localStorage
  const estaLogueado = !!localStorage.getItem("Nombre_Usuario") && !!localStorage.getItem("Contraseña");

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setEstaColapsado(false); // Cierra el menú lateral
    localStorage.removeItem("Nombre_Usuario"); // Elimina el usuario de localStorage
    localStorage.removeItem("Contraseña"); // Elimina la contraseña de localStorage
    navegar("/"); // Redirige a la página principal
  };

  // Función para alternar el estado del menú lateral
  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  // Función genérica de navegación
  const navegarA = (ruta) => {
    navegar(ruta); // Navega a la ruta especificada
    setEstaColapsado(false); // Cierra el menú lateral
  };

  return (
    // Barra de navegación fija en la parte superior
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        {/* Logo y nombre de la ferretería */}
        <Navbar.Brand
          onClick={() => navegarA("/inicio")}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />{" "}
          <strong>Chevez Market</strong>
        </Navbar.Brand>

        {/* Botón para alternar el menú lateral en pantallas pequeñas */}
        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={alternarColapso}
        />

        {/* Menú lateral (Offcanvas) */}
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={estaColapsado}
          onHide={() => setEstaColapsado(false)}
        >
          {/* Encabezado del menú lateral */}
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={estaColapsado ? "color-texto-marca" : "text-white"}
            >
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>

          {/* Cuerpo del menú lateral */}
          <Offcanvas.Body>
            {/* Navegación */}
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {/* Opción de navegación a Inicio */}
              <Nav.Link
                onClick={() => navegarA("/inicio")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <HouseIcon className="me-2" /> {/* Se muestra siempre el ícono junto a "Inicio" */}
                <strong>Inicio</strong>
              </Nav.Link>

              {/* Opción de navegación a Productos */}
              <Nav.Link
                onClick={() => navegarA("/productos")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <i className="bi-box-seam-fill me-2"></i>
                <strong>Productos</strong>
              </Nav.Link>

              {/* Opción de navegación a Proveedores */}
              <Nav.Link
                onClick={() => navegarA("/proveedores")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <i className="bi-truck me-2"></i>
                <strong>Proveedores</strong>
              </Nav.Link>

              {/* Opción de navegación a Compras */}
              <Nav.Link
                onClick={() => navegarA("/compras")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <i className="bi-cart-check-fill me-2"></i>
                <strong>Compras</strong>
              </Nav.Link>

              {/* Opción de navegación a Ventas */}
              <Nav.Link
                onClick={() => navegarA("/ventas")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <i className="bi-currency-dollar me-2"></i>
                <strong>Ventas</strong>
              </Nav.Link>

              {/* Opción de navegación a Clientes */}
              <Nav.Link
                onClick={() => navegarA("/clientes")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <i className="bi-people-fill me-2"></i>
                <strong>Clientes</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => navegarA("/tipo")}
                className={estaColapsado ? "text-black" : "text-white"}
              >
                <i className="bi-people-fill me-2"></i>
                <strong>Categorias</strong>
              </Nav.Link>

              {/* Lógica condicional para mostrar Cerrar Sesión o Iniciar Sesión */}
              {estaLogueado ? (
                // Opción de cerrar sesión
                <Nav.Link
                  onClick={cerrarSesion}
                  className={estaColapsado ? "text-black" : "text-white"}
                >
                  Cerrar Sesión
                </Nav.Link>
              ) : (
                ubicacion.pathname === "/" && (
                  // Opción de iniciar sesión (solo en la ruta raíz)
                  <Nav.Link
                    onClick={() => navegarA("/")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    Iniciar Sesión
                  </Nav.Link>
                )
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
