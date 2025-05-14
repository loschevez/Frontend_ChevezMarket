import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";

const ModalRegistroCompra = ({
  mostrarModal,
  setMostrarModal,
  agregarCompra,
  errorCarga,
  compraActualizar,
  modoActualizar,
  guardarCompraActualizada,
}) => {
  const [compraLocal, setCompraLocal] = useState({
    id_proveedor: "",
    telefono: "",
    detalles: [{ id_producto: "", Cantidad: "", precio_unitario: "", subtotal: "" }],
  });
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Obtener lista de proveedores
    const fetchProveedores = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/proveedores');
        if (!respuesta.ok) throw new Error('Error al cargar proveedores');
        const data = await respuesta.json();
        setProveedores(data);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    // Obtener lista de productos
    const fetchProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        if (!respuesta.ok) throw new Error('Error al cargar productos');
        const data = await respuesta.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };
    fetchProveedores();
    fetchProductos();

    if (modoActualizar && compraActualizar) {
      setCompraLocal({
        id_compra: compraActualizar.id_compra || "",
        id_proveedor: compraActualizar.id_proveedor || "",
        telefono: compraActualizar.telefono || "",
        detalles: Array.isArray(compraActualizar.detalles) && compraActualizar.detalles.length > 0
          ? compraActualizar.detalles.map(detalle => ({
              id_detalle_compra: detalle.id_detalle_compra || "",
              id_producto: detalle.id_producto || "",
              Cantidad: detalle.Cantidad || "",
              precio_unitario: detalle.precio_unitario || "",
              subtotal: detalle.subtotal || ""
            }))
          : [{ id_producto: "", Cantidad: "", precio_unitario: "", subtotal: "" }]
      });
    } else {
      setCompraLocal({
        id_proveedor: "",
        telefono: "",
        detalles: [{ id_producto: "", Cantidad: "", precio_unitario: "", subtotal: "" }],
      });
    }
  }, [modoActualizar, compraActualizar]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const detallesActualizados = [...compraLocal.detalles];
      detallesActualizados[index][name] = value;
      if (name === "id_producto") {
        const productoSeleccionado = productos.find(p => p.id_producto == value);
        detallesActualizados[index].precio_unitario = productoSeleccionado ? productoSeleccionado.Precio_U : "";
      }
      const cantidad = parseFloat(detallesActualizados[index].Cantidad) || 0;
      const precio = parseFloat(detallesActualizados[index].precio_unitario) || 0;
      detallesActualizados[index].subtotal = (cantidad * precio).toFixed(2);
      setCompraLocal({ ...compraLocal, detalles: detallesActualizados });
    } else {
      setCompraLocal({ ...compraLocal, [name]: value });
    }
  };

  const agregarDetalle = () => {
    setCompraLocal({
      ...compraLocal,
      detalles: [...compraLocal.detalles, { id_producto: "", Cantidad: "", precio_unitario: "", subtotal: "" }],
    });
  };

  const eliminarDetalle = (index) => {
    const detallesActualizados = compraLocal.detalles.filter((_, i) => i !== index);
    setCompraLocal({ ...compraLocal, detalles: detallesActualizados });
  };

  const handleSubmit = () => {
    if (!compraLocal.id_proveedor || !compraLocal.telefono) {
      alert("Por favor, completa todos los campos de proveedor y teléfono.");
      return;
    }
    if (compraLocal.detalles.some(detalle => 
      !detalle.id_producto || !detalle.Cantidad || parseFloat(detalle.Cantidad) < 0 || !detalle.precio_unitario || !detalle.subtotal)) {
      alert("Por favor, completa todos los campos de los detalles y asegúrate de que la cantidad sea mayor o igual a cero.");
      return;
    }

    if (modoActualizar) {
      guardarCompraActualizada(compraLocal);
    } else {
      agregarCompra(compraLocal);
    }
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{modoActualizar ? "Actualizar Compra" : "Agregar Nueva Compra"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <Form.Group className="mb-3" controlId="formIdProveedor">
            <Form.Label>Proveedor</Form.Label>
            <Form.Control
              as="select"
              name="id_proveedor"
              value={compraLocal.id_proveedor}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={compraLocal.telefono}
              onChange={handleInputChange}
              placeholder="Ingresa el teléfono"
              required
            />
          </Form.Group>
          <h5>Detalles de la Compra</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compraLocal.detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      as="select"
                      name="id_producto"
                      value={detalle.id_producto}
                      onChange={(e) => handleInputChange(e, index)}
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.map((producto) => (
                        <option key={producto.id_producto} value={producto.id_producto}>
                          {producto.nombre_producto} (ID: {producto.id_producto})
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="Cantidad"
                      value={detalle.Cantidad}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Cantidad"
                      required
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="precio_unitario"
                      value={detalle.precio_unitario}
                      readOnly
                      placeholder="Precio Unitario"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="subtotal"
                      value={detalle.subtotal}
                      readOnly
                      placeholder="Subtotal"
                    />
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => eliminarDetalle(index)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="secondary" onClick={agregarDetalle}>
            Agregar Detalle
          </Button>
          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {modoActualizar ? "Guardar Cambios" : "Guardar Compra"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;