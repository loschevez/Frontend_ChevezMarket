import React, { useState, useEffect } from "react";
import TablaClientes from "../components/cliente/TablaClientes";
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroCliente from "../components/cliente/ModalRegistroCliente.jsx";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    email: "",
    telefono: "",
  });
  const [clienteActualizar, setClienteActualizar] = useState(null);
  const [modoActualizar, setModoActualizar] = useState(false);

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/clientes");
      if (!respuesta.ok) {
        throw new Error("Error al cargar los clientes");
      }
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos); // Inicializa la lista filtrada con todos los clientes
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    
    const filtrados = listaClientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(texto) ||
        cliente.apellido.toLowerCase().includes(texto) ||
        cliente.cedula.toLowerCase().includes(texto) ||
        cliente.email.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCliente = async (cliente) => {
    console.log("Valores de cliente:", cliente);
    if (
      !cliente.nombre.trim() ||
      !cliente.apellido.trim() ||
      !cliente.cedula.trim() ||
      !cliente.email.trim() ||
      !cliente.telefono.trim()
    ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }
  
    try {
      const respuesta = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
  
      if (!respuesta.ok) {
        throw new Error("Error al agregar el cliente");
      }
  
      await obtenerClientes();
      setNuevoCliente({ nombre: "", apellido: "", cedula: "", email: "", telefono: "" });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/clientes/${id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) {
        throw new Error("Error al eliminar el cliente");
      }
      await obtenerClientes();
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarCliente = (cliente) => {
    setClienteActualizar(cliente);
    setModoActualizar(true);
    setMostrarModal(true);
  };

  const guardarClienteActualizado = async (clienteActualizadoLocal) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/clientes/${clienteActualizar.id_cliente}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteActualizadoLocal),
      });
      if (!respuesta.ok) {
        throw new Error("Error al actualizar el cliente");
      }
      await obtenerClientes();
      setMostrarModal(false);
      setModoActualizar(false);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Clientes</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            variant="primary"
            onClick={() => {
              setModoActualizar(false);
              setMostrarModal(true);
            }}
            style={{ width: "100%" }}
          >
            Nuevo Cliente
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br />
      <TablaClientes
        clientes={clientesFiltrados}
        cargando={cargando}
        error={errorCarga}
        eliminarCliente={eliminarCliente}
        actualizarCliente={actualizarCliente}
      />
      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={agregarCliente}
        errorCarga={errorCarga}
        clienteActualizar={clienteActualizar}
        modoActualizar={modoActualizar}
        guardarClienteActualizado={guardarClienteActualizado}
        setNuevoCliente={setNuevoCliente}
      />
    </Container>
  );
};

export default Clientes;