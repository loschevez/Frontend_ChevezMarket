import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginForm from "../components/login/LoginForm";
import "../app.css";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);

  const navegar = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/api/verificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Nombre_Usuario: nombreUsuario, Contraseña: contraseña }),
      });

      const datos = await respuesta.json();

      if (datos.success) {
        console.log("Usuario verificado correctamente");
        localStorage.setItem("usuario", nombreUsuario); // Se usa "usuario"
        navegar("/inicio");
      } else {
        setError(datos.mensaje || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario"); // Se lee "usuario"
    if (usuarioGuardado) {
      navegar("/inicio");
    }
  }, [navegar]);

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <LoginForm
        email={nombreUsuario}
        password={contraseña}
        error={error}
        setEmail={setNombreUsuario}
        setPassword={setContraseña}
        manejarEnvio={manejarEnvio}
      />
    </Container>
  );
};

export default Login;
