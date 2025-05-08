import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const ModalRegistroProductos = ({
  mostrarModal,
  setMostrarModal,
  agregarProducto,
  errorCarga,
  productoActualizar,
  modoActualizar,
  guardarProductoActualizado,
}) => {
  const [productoLocal, setProductoLocal] = useState({
    nombre_producto: "",
    Precio_U: "",
    Cantidad: "",
    id_tipo: "",
  });
  const [tipos, setTipos] = useState([]);
  const [errorTipos, setErrorTipos] = useState(null);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/obtenerTipos');
        if (!respuesta.ok) throw new Error('Error al cargar tipos de productos');
        const data = await respuesta.json();
        setTipos(data);
        setErrorTipos(null);
      } catch (error) {
        setErrorTipos('No se pudieron cargar los tipos de productos. Verifica el backend.');
        console.error('Error fetching tipos:', error);
      }
    };
    fetchTipos();

    console.log("productoActualizar recibido:", productoActualizar); // Depuración
    console.log("modoActualizar:", modoActualizar); // Depuración

    if (modoActualizar && productoActualizar) {
      const updatedProductoLocal = {
        nombre_producto: productoActualizar.nombre_producto || "",
        Precio_U: productoActualizar.Precio_U ? productoActualizar.Precio_U.toString() : "", // Convertimos a string para el input
        Cantidad: productoActualizar.Cantidad ? productoActualizar.Cantidad.toString() : "", // Convertimos a string para el input
        id_tipo: productoActualizar.id_tipo ? productoActualizar.id_tipo.toString() : "", // Convertimos a string para el select
      };
      console.log("Producto local actualizado:", updatedProductoLocal); // Depuración
      setProductoLocal(updatedProductoLocal);
    } else {
      setProductoLocal({
        nombre_producto: "",
        Precio_U: "",
        Cantidad: "",
        id_tipo: "",
      });
    }
  }, [modoActualizar, productoActualizar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoLocal({ ...productoLocal, [name]: value });
  };

  const handleSubmit = () => {
    if (!productoLocal.nombre_producto || !productoLocal.Precio_U || !productoLocal.Cantidad || !productoLocal.id_tipo) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const productoValido = {
      nombre_producto: productoLocal.nombre_producto,
      Precio_U: parseFloat(productoLocal.Precio_U),
      Cantidad: parseFloat(productoLocal.Cantidad),
      id_tipo: parseInt(productoLocal.id_tipo),
    };

    if (modoActualizar) {
      guardarProductoActualizado(productoValido);
    } else {
      agregarProducto(productoValido);
    }
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{modoActualizar ? "Actualizar Producto" : "Agregar Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-4" controlId="formNombreProducto">
                <Form.Label className="fw-bold">Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_producto"
                  value={productoLocal.nombre_producto}
                  onChange={handleInputChange}
                  placeholder="Ingresa el nombre del producto"
                  required
                  className="border-primary"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-4" controlId="formIdTipo">
                <Form.Label className="fw-bold">Tipo de Producto</Form.Label>
                <Form.Control
                  as="select"
                  name="id_tipo"
                  value={productoLocal.id_tipo}
                  onChange={handleInputChange}
                  required
                  className="border-primary"
                >
                  <option value="">Selecciona un tipo</option>
                  {errorTipos ? (
                    <option value="" disabled>{errorTipos}</option>
                  ) : (
                    tipos.map((tipo) => (
                      <option key={tipo.id_tipo} value={tipo.id_tipo}>
                        {tipo.tipo}
                      </option>
                    ))
                  )}
                </Form.Control>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-4" controlId="formPrecioU">
                <Form.Label className="fw-bold">Precio Unitario</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="Precio_U"
                  value={productoLocal.Precio_U}
                  onChange={handleInputChange}
                  placeholder="Ingresa el precio unitario"
                  required
                  className="border-primary"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-4" controlId="formCantidad">
                <Form.Label className="fw-bold">Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  name="Cantidad"
                  value={productoLocal.Cantidad}
                  onChange={handleInputChange}
                  placeholder="Ingresa la cantidad"
                  required
                  className="border-primary"
                />
              </Form.Group>
            </div>
          </div>
          {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={() => setMostrarModal(false)} className="px-4">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="px-4">
          {modoActualizar ? "Guardar Cambios" : "Guardar Producto"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProductos;