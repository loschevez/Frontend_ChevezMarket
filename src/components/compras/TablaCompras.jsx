import React, { useState } from 'react';
import { Card, Button, Col, Row, Modal, Alert, Table } from 'react-bootstrap';

const TablaCompras = ({ compras, cargando, error, eliminarCompra, actualizarCompra }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  const handleDeleteConfirm = (compraId) => {
    setCompraAEliminar(compraId);
    setShowDeleteModal(true);
  };

  const handleDeleteCompra = () => {
    eliminarCompra(compraAEliminar);
    setShowDeleteModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdateCompra = (id) => {
    actualizarCompra(id);
    setShowUpdateAlert(true);
    setTimeout(() => setShowUpdateAlert(false), 3000);
  };

  if (cargando) return <div>Cargando compras...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Compra eliminada correctamente.
        </Alert>
      )}
      {showUpdateAlert && (
        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible>
          Compra actualizada correctamente.
        </Alert>
      )}
      <Row>
        {compras.map((compra) => (
          <Col md={4} key={compra.id_compra}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Compra #{compra.id_compra}</Card.Title>
                <Card.Text>
                  <strong>Fecha:</strong> {new Date(compra.Fecha).toLocaleDateString()}<br />
                  <strong>Proveedor:</strong> {compra.nombre_proveedor || 'Sin proveedor'}<br />
                  <strong>Total:</strong> ${parseFloat(compra.total_compra || 0).toFixed(2)}
                </Card.Text>
                <h5>Detalles</h5>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compra.detalles && compra.detalles.length > 0 ? (
                      compra.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td>{detalle.nombre_producto || 'Sin producto'}</td>
                          <td>{detalle.Cantidad || 0}</td>
                          <td>${parseFloat(detalle.precio_unitario || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No hay detalles disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-end">
                  <Button variant="danger" onClick={() => handleDeleteConfirm(compra.id_compra)} className="me-2">
                    <i className="bi bi-trash"></i> Eliminar
                  </Button>
                  <Button variant="primary" onClick={() => handleUpdateCompra(compra.id_compra)}>
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
          ¿Estás seguro de que deseas eliminar esta compra?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteCompra}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaCompras;