import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompras';
import { Container, Button, Row, Col, Form } from "react-bootstrap";

const Compras = () => {
  const [listaCompras, setListaCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [compraActualizar, setCompraActualizar] = useState(null);
  const [modoActualizar, setModoActualizar] = useState(false);

  const obtenerCompras = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/compras');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las compras');
      }
      const datos = await respuesta.json();
      setListaCompras(datos);
      setComprasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = listaCompras.filter(
      (compra) => (compra.nombre_proveedor || "").toLowerCase().includes(texto)
    );
    setComprasFiltradas(filtrados);
  };

  const agregarCompra = async (compra) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compra),
      });
      if (!respuesta.ok) {
        throw new Error('Error al agregar la compra');
      }
      await obtenerCompras();
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarCompra = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/compras/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar la compra');
      }
      await obtenerCompras();
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarCompra = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/compras/${id}`);
      if (!respuesta.ok) {
        throw new Error('Error al obtener la compra');
      }
      const compra = await respuesta.json();
      setCompraActualizar(compra);
      setModoActualizar(true);
      setMostrarModal(true);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const guardarCompraActualizada = async (compraActualizada) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/compras/${compraActualizar.id_compra}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compraActualizada),
      });
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al actualizar la compra');
      }
      await obtenerCompras();
      setMostrarModal(false);
      setModoActualizar(false);
      setCompraActualizar(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Compras</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => {
            setModoActualizar(false);
            setCompraActualizar(null);
            setMostrarModal(true);
          }} style={{ width: "100%" }}>
            Nueva Compra
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <Form.Control
            type="text"
            placeholder="Buscar por proveedor"
            value={textoBusqueda}
            onChange={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br />
      <TablaCompras
        compras={comprasFiltradas}
        cargando={cargando}
        error={errorCarga}
        eliminarCompra={eliminarCompra}
        actualizarCompra={actualizarCompra}
      />
      <ModalRegistroCompra
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        agregarCompra={agregarCompra}
        errorCarga={errorCarga}
        compraActualizar={compraActualizar}
        modoActualizar={modoActualizar}
        guardarCompraActualizada={guardarCompraActualizada}
      />
    </Container>
  );
};

export default Compras;