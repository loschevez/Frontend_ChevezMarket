import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroTipo = ({
  mostrarModal,
  setMostrarModal,
  nuevoTipo,
  manejarCambioInput,
  agregarTipo,
  errorCarga,
  tipoActualizar,
  modoActualizar,
  guardarTipoActualizado,
}) => {
  const [tipoLocal, setTipoLocal] = useState("");

  useEffect(() => {
    if (modoActualizar && tipoActualizar) {
      setTipoLocal(tipoActualizar.tipo);
    } else {
      setTipoLocal(nuevoTipo.tipo);
    }
  }, [modoActualizar, tipoActualizar, nuevoTipo.tipo]);

  const handleSubmit = () => {
    if (modoActualizar) {
      guardarTipoActualizado(tipoLocal);
    } else {
      agregarTipo();
    }
  };

  const handleInputChange = (e) => {
    setTipoLocal(e.target.value);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{modoActualizar ? "Actualizar Tipo" : "Agregar Nuevo Tipo"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreTipo">
            <Form.Label>Nombre del Tipo</Form.Label>
            <Form.Control
              type="text"
              name="tipo"
              value={tipoLocal}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {modoActualizar ? "Guardar Cambios" : "Guardar Tipo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroTipo;
