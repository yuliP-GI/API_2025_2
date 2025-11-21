import { conmysql } from "../db.js";

export const prueba=(req,res)=>{
    res.send('prueba con exito');
}

//funcion para obtener todas las categorias
export const getCategorias = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM categorias");
        res.json({
            cant: result.length,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

//funcion para crear una categoria
export const postCategoria = async (req, res) => {
    try {
        const { cat_nombre, cat_descripcion } = req.body;
        const [result] = await conmysql.query(
            "INSERT INTO categorias(cat_nombre, cat_descripcion) VALUES (?, ?)",
            [cat_nombre, cat_descripcion]
        );
        res.status(201).json({ cat_id : result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}