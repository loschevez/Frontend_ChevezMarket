import React, { useState } from 'react';
import { Card, Button, Col, Row, Modal, Alert, Table } from 'react-bootstrap';

const TablaProductos = ({ productos, cargando, error, eliminarProducto, actualizarProducto }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleDeleteConfirm = (productoId) => {
    setProductoAEliminar(productoId);
    setShowDeleteModal(true);
  };

  const handleDeleteProducto = () => {
    eliminarProducto(productoAEliminar);
    setShowDeleteModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdateProducto = (productoId) => {
    actualizarProducto(productoId);
  };

  if (cargando) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Producto eliminado correctamente.
        </Alert>
      )}
      <Row>
        {productos.map((producto) => (
          <Col md={4} key={producto.id_producto}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Producto #{producto.id_producto}</Card.Title>
                <Card.Text>
                  <strong>Nombre:</strong> {producto.nombre_producto}<br />
                  <strong>Precio Unitario:</strong> ${parseFloat(producto.Precio_U || 0).toFixed(2)}<br />
                  <strong>Cantidad:</strong> {producto.Cantidad || 0}
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => handleUpdateProducto(producto.id_producto)} className="me-2">
                    <i className="bi bi-pencil-square"></i> Actualizar
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteConfirm(producto.id_producto)}>
                    <i className="bi bi-trash"></i> Eliminar
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
          ¿Estás seguro de que deseas eliminar este producto?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProducto}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaProductos;