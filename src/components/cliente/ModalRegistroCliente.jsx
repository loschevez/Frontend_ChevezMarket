import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
  errorCarga,
  clienteActualizar,
  modoActualizar,
  guardarClienteActualizado,
}) => {
  const [clienteLocal, setClienteLocal] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    email: "",
    telefono: "",
  });

  useEffect(() => {
    if (modoActualizar && clienteActualizar) {
      setClienteLocal(clienteActualizar);
    } else {
      setClienteLocal(nuevoCliente);
    }
  }, [modoActualizar, clienteActualizar, nuevoCliente]);

  const handleSubmit = () => {
    if (modoActualizar) {
      guardarClienteActualizado(clienteLocal);
    } else {
      agregarCliente(clienteLocal);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteLocal((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{modoActualizar ? "Actualizar Cliente" : "Agregar Nuevo Cliente"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={clienteLocal.nombre}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={clienteLocal.apellido}
              onChange={handleInputChange}
              placeholder="Ingresa el apellido"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={clienteLocal.cedula}
              onChange={handleInputChange}
              placeholder="Ingresa la cédula"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={clienteLocal.email}
              onChange={handleInputChange}
              placeholder="Ingresa el email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={clienteLocal.telefono}
              onChange={handleInputChange}
              placeholder="Ingresa el teléfono"
              required
            />
          </Form.Group>
          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {modoActualizar ? "Guardar Cambios" : "Guardar Cliente"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;