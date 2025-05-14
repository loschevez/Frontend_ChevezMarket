import React, { useState } from 'react';
import { Card, Button, Col, Row, Modal, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaProductos = ({ productos, cargando, error, eliminarProducto, actualizarProducto }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  const handleDeleteConfirm = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const handleDeleteProducto = () => {
    eliminarProducto(productoAEliminar.id_producto);
    setShowDeleteModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdateProducto = (producto) => {
    actualizarProducto(producto.id_producto);
    setShowUpdateAlert(true);
    setTimeout(() => setShowUpdateAlert(false), 3000);
  };

  if (cargando) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible aria-live="polite">
          Producto desactivado correctamente.
        </Alert>
      )}
      {showUpdateAlert && (
        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible aria-live="polite">
          Producto actualizado correctamente.
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
                  <strong>Tipo:</strong> {producto.nombre_tipo || 'Sin tipo'}<br />
                  <strong>Precio Unitario:</strong> ${parseFloat(producto.Precio_U || 0).toFixed(2)}<br />
                  <strong>Cantidad:</strong> {producto.Cantidad || 0}
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button variant="danger" onClick={() => handleDeleteConfirm(producto)} className="me-2">
                    <i className="bi bi-trash"></i> Desactivar
                  </Button>
                  <Button variant="primary" onClick={() => handleUpdateProducto(producto)}>
                    <i className="bi bi-pencil-square"></i> Actualizar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Desactivación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          {productoAEliminar && (
            <p>¿Estás seguro de que deseas desactivar el producto #{productoAEliminar.id_producto} ({productoAEliminar.nombre_producto})?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProducto}>
            Desactivar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaProductos;