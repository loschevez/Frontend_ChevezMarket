import React, { useState, useEffect } from 'react';
import TablaTipos from '../components/tipo/tablatipo';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalRegistroTipo from '../components/tipo/ModalRegistroTipo';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const Tipos = () => {
  const [listaTipos, setListaTipos] = useState([]);
  const [tiposFiltrados, setTiposFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState({
    tipo: '',
  });
  const [tipoActualizar, setTipoActualizar] = useState(null);
  const [modoActualizar, setModoActualizar] = useState(false);

  const obtenerTipos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/obtenerTipos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los tipos');
      }
      const datos = await respuesta.json();
      console.log('Datos recibidos del backend:', datos);
      setListaTipos(datos);
      setTiposFiltrados(datos); // Initialize filtered types with full list
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerTipos();
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    
    const filtrados = listaTipos.filter(
      (tipo) => tipo.tipo.toLowerCase().includes(texto)
    );
    setTiposFiltrados(filtrados);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoTipo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarTipo = async () => {
    if (!nuevoTipo.tipo) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/tipo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoTipo),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el tipo');
      }

      await obtenerTipos();
      setNuevoTipo({ tipo: '' });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarTipo = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/tipo/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('Error al eliminar el tipo');
      }
      await obtenerTipos();
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarTipo = (tipo) => {
    setTipoActualizar(tipo);
    setModoActualizar(true);
    setMostrarModal(true);
  };

  const guardarTipoActualizado = async (tipoActualizadoLocal) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/tipo/${tipoActualizar.id_tipo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo: tipoActualizadoLocal }),
      });
      if (!respuesta.ok) {
        throw new Error('Error al actualizar el tipo');
      }
      await obtenerTipos();
      setMostrarModal(false);
      setModoActualizar(false);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Tipos</h4>
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => {
            setModoActualizar(false);
            setMostrarModal(true);
          }} style={{ width: "100%" }}>
            Nuevo Tipo
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <br/>
      <TablaTipos
        tipos={tiposFiltrados}
        cargando={cargando}
        error={errorCarga}
        eliminarTipo={eliminarTipo}
        actualizarTipo={actualizarTipo}
      />
      <ModalRegistroTipo
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoTipo={nuevoTipo}
        manejarCambioInput={manejarCambioInput}
        agregarTipo={agregarTipo}
        errorCarga={errorCarga}
        tipoActualizar={tipoActualizar}
        modoActualizar={modoActualizar}
        guardarTipoActualizado={guardarTipoActualizado}
      />
    </Container>
  );
};

export default Tipos;