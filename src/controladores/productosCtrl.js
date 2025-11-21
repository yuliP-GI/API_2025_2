import { conmysql } from "../db.js";

export const prueba=(req,res)=>{
    res.send('prueba con exito');
}

//funcion para obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM productos");
        res.json({
            cant: result.length,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

//funcion para obtener los productos por id
export const getProductoId = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Producto no encontrado", cant: 0 });
        res.json({ cant: result.length, data: result[0] });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

//funcion para insertar un nuevo producto
/*export const postProducto = async (req, res) => {
    try {
        const { prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria } = req.body;
        const [result] = await conmysql.query(
            "INSERT INTO productos(prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria) VALUES (?, ?, ?, ?, ?)",
            [prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria]
        );
        res.status(201).json({ prod_id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}*/

export const postProducto = async (req, res) => {
    try {
        const { prod_nombre, prod_codigo, prod_precio, prod_stock, prod_activo, cat_id  } = req.body;
        const prod_imagen_ruta = req.file ? `/uploads/${req.file.filename}` : null;
        const [result] = await conmysql.query(
            "INSERT INTO productos(prod_nombre, prod_codigo, prod_precio, prod_stock, prod_imagen, prod_activo, cat_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [prod_nombre, prod_codigo, prod_precio, prod_stock, prod_imagen_ruta, prod_activo, cat_id]
        );
        res.status(201).json({ prod_id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}


//función para actualizar un pedido existente
/*export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria } = req.body;

        const [result] = await conmysql.query(
            "UPDATE productos SET prod_nombre = ?, prod_descripcion = ?, prod_precio = ?, prod_stock = ?, prod_categoria = ? WHERE prod_id = ?",
            [prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({
            message: "Producto actualizado correctamente",
            data: { prod_id: id, prod_nombre, prod_descripcion, prod_precio, prod_stock, prod_categoria }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}*/

export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_precio, prod_stock, prod_activo } = req.body;
        let prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;

        //Si no hay imagen, conservar la actual
        if (!req.file) {
            const [rows] = await conmysql.query(
                'SELECT prod_imagen FROM productos WHERE prod_id = ?',
                [id]
            );

            if (rows && rows.length > 0) {
                prod_imagen = rows[0].prod_imagen;
            } else {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
        }

        // Verificar si el código ya existe en otro producto
        const [codigoExiste] = await conmysql.query(
            'SELECT prod_id FROM productos WHERE prod_codigo = ? AND prod_id <> ?',
            [prod_codigo, id]
        );

        let nuevoCodigo = prod_codigo;
        if (codigoExiste.length > 0) {
            // Si el código ya existe, genera uno nuevo automáticamente
            nuevoCodigo = prod_codigo + '_' + Date.now(); 
        }

        //Actualizar el producto
        const [result] = await conmysql.query(
            `UPDATE productos 
             SET prod_codigo = ?, prod_nombre = ?, prod_precio = ?, prod_stock = ?, prod_imagen = ?, prod_activo = ?
             WHERE prod_id = ?`,
            [nuevoCodigo, prod_nombre, prod_precio, prod_stock, prod_imagen, prod_activo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        //Respuesta
        res.json({
            message: 'Producto actualizado correctamente',
            data: { prod_id: id, prod_codigo: nuevoCodigo, prod_nombre, prod_precio, prod_stock, prod_imagen, prod_activo }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};


//función para eliminar un producto existente
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query("DELETE FROM productos WHERE prod_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente", prod_id: id });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}