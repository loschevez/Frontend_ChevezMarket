import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProductos from '../components/producto/ModalRegistroProductos';
import { Container, Button, Row, Col, Form } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoActualizar, setProductoActualizar] = useState(null);
  const [modoActualizar, setModoActualizar] = useState(false);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = listaProductos.filter(
      (producto) => (producto.nombre_producto || "").toLowerCase().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  const agregarProducto = async (producto) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      if (!respuesta.ok) {
        throw new Error('Error al agregar el producto');
      }
      await obtenerProductos();
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar el producto');
      }
      await obtenerProductos();
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarProducto = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/productos/${id}`);
      if (!respuesta.ok) {
        throw new Error('Error al obtener el producto');
      }
      const producto = await respuesta.json();
      setProductoActualizar(producto[0]); // Ajuste para el formato devuelto por obtenerProductoPorId
      setModoActualizar(true);
      setMostrarModal(true);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const guardarProductoActualizado = async (productoActualizado) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/productos/${productoActualizar.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoActualizado),
      });
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al actualizar el producto');
      }
      await obtenerProductos();
      setMostrarModal(false);
      setModoActualizar(false);
      setProductoActualizar(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Productos</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => {
            setModoActualizar(false);
            setProductoActualizar(null);
            setMostrarModal(true);
          }} style={{ width: "100%" }}>
            Nuevo Producto
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de producto"
            value={textoBusqueda}
            onChange={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br />
      <TablaProductos
        productos={productosFiltrados}
        cargando={cargando}
        error={errorCarga}
        eliminarProducto={eliminarProducto}
        actualizarProducto={actualizarProducto} // Añadido para permitir actualización
      />
      <ModalRegistroProductos
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
        productoActualizar={productoActualizar}
        modoActualizar={modoActualizar}
        guardarProductoActualizado={guardarProductoActualizado}
      />
    </Container>
  );
};

export default Productos;