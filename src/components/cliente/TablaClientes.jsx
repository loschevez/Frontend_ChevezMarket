import React, { useState, useEffect } from "react";
import { Card, Button, Col, Row, Modal, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TablaClientes = ({ clientes, cargando, error, eliminarCliente, actualizarCliente }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  const handleDeleteConfirm = (clienteId) => {
    setClienteAEliminar(clienteId);
    setShowDeleteModal(true);
  };

  const handleDeleteCliente = () => {
    eliminarCliente(clienteAEliminar);
    setShowDeleteModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdateCliente = (cliente) => {
    actualizarCliente(cliente);
    setShowUpdateAlert(true);
    setTimeout(() => setShowUpdateAlert(false), 3000);
  };

  if (cargando) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Cliente eliminado correctamente.
        </Alert>
      )}
      {showUpdateAlert && (
        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible>
          Cliente actualizado correctamente.
        </Alert>
      )}
      <Row>
        {clientes.map((cliente) => (
          <Col md={4} key={cliente.id_cliente}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{cliente.nombre} {cliente.apellido}</Card.Title>
                <Card.Text>
                  ID: {cliente.id_cliente} <br />
                  Cédula: {cliente.cedula} <br />
                  Email: {cliente.email} <br />
                  Teléfono: {cliente.telefono}
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteConfirm(cliente.id_cliente)}
                    className="me-2"
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </Button>
                  <Button variant="primary" onClick={() => handleUpdateCliente(cliente)}>
                    <i className="bi bi-pencil-square"></i> Actualizar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteCliente}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaClientes;