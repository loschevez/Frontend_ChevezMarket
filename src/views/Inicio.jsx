import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import denim from '../Imagenes/denim.png'; // Ajusta según la ubicación real

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = async () => {
    try {
      localStorage.removeItem("usuario");
      navegar("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={denim} alt="Imagen de usuario" />
        <Card.Body>
          <Card.Title>¡Bienvenido, {nombreUsuario}!</Card.Title>
          <Card.Text>Esperamos que tengas un gran día en Chevez Store.</Card.Text>
          <Button variant="primary" onClick={cerrarSesion}>
            Cerrar Sesión
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Inicio;