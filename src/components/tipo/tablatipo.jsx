import React, { useState } from 'react';
import { Card, Button, Col, Row, Modal, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaTipos = ({ tipos, cargando, error, eliminarTipo, actualizarTipo }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoAEliminar, setTipoAEliminar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  const handleDeleteConfirm = (tipoId) => {
    setTipoAEliminar(tipoId);
    setShowDeleteModal(true);
  };

  const handleDeleteType = () => {
    eliminarTipo(tipoAEliminar);
    setShowDeleteModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdateType = (tipo) => {
    actualizarTipo(tipo);
    setShowUpdateAlert(true);
    setTimeout(() => setShowUpdateAlert(false), 3000);
  };

  if (cargando) return <div>Cargando tipos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Tipo eliminado correctamente.
        </Alert>
      )}
      {showUpdateAlert && (
        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible>
          Tipo actualizado correctamente.
        </Alert>
      )}
      <Row>
        {tipos.map((tipo) => (
          <Col md={4} key={tipo.id_tipo}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{tipo.tipo}</Card.Title>
                <Card.Text>
                  ID Tipo: {tipo.id_tipo}
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button variant="danger" onClick={() => handleDeleteConfirm(tipo.id_tipo)} className="me-2">
                    <i className="bi bi-trash"></i> Eliminar
                  </Button>
                  <Button variant="primary" onClick={() => handleUpdateType(tipo)}>
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
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este tipo?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteType}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaTipos;
