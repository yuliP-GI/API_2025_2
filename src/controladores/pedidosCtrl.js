import { conmysql } from "../db.js";

// Obtener todos los pedidos
export const getPedidos = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM pedidos");
    res.json({ count: result.length, data: result });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM pedidos WHERE ped_id = ?",
      [req.params.id]
    );
    if (result.length <= 0)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Crear nuevo pedido
export const postPedido2 = async (req, res) => {
  try {
    const { cli_id, ped_fecha, usr_id, ped_estado } = req.body;
    const [result] = await conmysql.query(
      `INSERT INTO pedidos (cli_id, ped_fecha, usr_id, ped_estado) VALUES (?, ?, ?, ?)`,
      [cli_id, ped_fecha, usr_id, ped_estado]
    );
    res.status(201).json({ id: result.insertId, message: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const postPedido = async (req, res) => {
  const { cli_id, ped_fecha, usr_id, total, ped_estado, tipo_pago_id, detalles } = req.body;

  if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: "Debe enviar al menos un detalle" });
  }

  try {
    // 1️⃣ Insertar el pedido
    const [pedidoResult] = await conmysql.query(
      `INSERT INTO pedidos (cli_id, ped_fecha, usr_id, total, ped_estado, tipo_pago_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [cli_id, ped_fecha, usr_id, total, ped_estado, tipo_pago_id	]
    );
    const ped_id = pedidoResult.insertId;

    // 2️⃣ Insertar los detalles
    const detalleValues = detalles.map(d => [d.prod_id, ped_id, d.det_cantidad, d.det_precio]);
    await conmysql.query(
      `INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES ?`,
      [detalleValues]
    );

    res.status(201).json({
      ped_id,
      message: "Pedido y detalles creados correctamente"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor", error });
  }
};

// Actualizar pedido (PUT)
export const putPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { cli_id, ped_fecha, usr_id, ped_estado } = req.body;
    const [result] = await conmysql.query(
      `UPDATE pedidos SET cli_id = ?, ped_fecha = ?, usr_id = ?, ped_estado = ? WHERE ped_id = ?`,
      [cli_id, ped_fecha, usr_id, ped_estado, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Pedido no encontrado" });
    const [row] = await conmysql.query("SELECT * FROM pedidos WHERE ped_id = ?", [id]);
    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar parcialmente (PATCH)
export const patchPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { cli_id, ped_fecha, usr_id, ped_estado } = req.body;
    const [result] = await conmysql.query(
      `UPDATE pedidos SET
        cli_id = IFNULL(?, cli_id),
        ped_fecha = IFNULL(?, ped_fecha),
        usr_id = IFNULL(?, usr_id),
        ped_estado = IFNULL(?, ped_estado)
      WHERE ped_id = ?`,
      [cli_id, ped_fecha, usr_id, ped_estado, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Pedido no encontrado" });
    const [row] = await conmysql.query("SELECT * FROM pedidos WHERE ped_id = ?", [id]);
    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar pedido
export const deletePedido = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "DELETE FROM pedidos WHERE ped_id = ?",
      [req.params.id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
