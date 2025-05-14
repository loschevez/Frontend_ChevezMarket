import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

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

    if (modoActualizar && productoActualizar) {
      setProductoLocal({
        nombre_producto: productoActualizar.nombre_producto || "",
        Precio_U: productoActualizar.Precio_U || "",
        Cantidad: productoActualizar.Cantidad || "",
        id_tipo: productoActualizar.id_tipo || "",
      });
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
    if (
      !productoLocal.nombre_producto ||
      !productoLocal.Precio_U ||
      !productoLocal.Cantidad ||
      !productoLocal.id_tipo
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (parseFloat(productoLocal.Precio_U) < 0 || parseFloat(productoLocal.Cantidad) < 0) {
      alert("El precio y la cantidad no pueden ser negativos.");
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
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modoActualizar ? "Actualizar Producto" : "Agregar Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoLocal.nombre_producto}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre del producto"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTipoProducto">
            <Form.Label>Tipo de Producto</Form.Label>
            <Form.Control
              as="select"
              name="id_tipo"
              value={productoLocal.id_tipo}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id_tipo} value={tipo.id_tipo}>
                  {tipo.tipo}
                </option>
              ))}
            </Form.Control>
            {errorTipos && <div className="text-danger mt-2">{errorTipos}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrecioUnitario">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="Precio_U"
              value={productoLocal.Precio_U}
              onChange={handleInputChange}
              placeholder="Ingresa el precio unitario"
              required
              min="0"
              onKeyDown={(e) => {
                if (e.key === '-') e.preventDefault();
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="Cantidad"
              value={productoLocal.Cantidad}
              onChange={handleInputChange}
              placeholder="Ingresa la cantidad"
              required
              min="0"
              onKeyDown={(e) => {
                if (e.key === '-') e.preventDefault();
              }}
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
          {modoActualizar ? "Guardar Cambios" : "Guardar Producto"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProductos;