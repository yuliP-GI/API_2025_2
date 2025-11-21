import { conmysql } from "../db.js";

export const prueba=(req,res)=>{
    res.send('prueba con exito');
}

export const getClientes=async(req,res)=>{
   try{
    const [result]= await conmysql.query(' select * from clientes ')
    res.json({
        cant:result.length,
        data:result
   })

   }catch (error){
    return res.status(500).json({message:" error en el servidor"})

   }
}

export const getClientesId=async(req,res)=>{
   try{
    const [result]= await conmysql.query(' select * from clientes where cli_id=? ', [req.params.id])
    if(result.length<=0)return res.json({
        cant:0,
        message:"Cliente no encontrado"

    })
    res.json({
        cant:result.length,
        data:result[0]
   })

   }catch (error){
    return res.status(500).json({message:" error en el servidor"})

   }
}
//funcion para insertar un nuevo cliente
export const postCliente=async(req,res)=>{
    try{
        const {cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad}= req.body;
        const [result]=await conmysql.query(
            'insert into clientes(cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) values (?, ?, ?, ?, ?, ?, ?)',
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad]
        )
        res.send({cli_id:result.insertId})
    }catch (error){
        return res.status(500).json({message:" error en el servidor"})

    }
}

//función para actualizar un cliente existente
export const putCliente=async(req,res)=>{
    try{
        const { id } = req.params;
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "Falta el id del cliente" });
        }
        if (!cli_identificacion || !cli_nombre) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const [result] = await conmysql.query(
            `UPDATE clientes 
            SET cli_identificacion = ?, cli_nombre = ?, cli_telefono = ?, cli_correo = ?, cli_direccion = ?, cli_pais = ?, cli_ciudad = ? 
            WHERE cli_id = ?`,
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json({
            message: "Cliente actualizado correctamente",
            data: { cli_id: id, cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad }
        });

    }catch (error){
        console.error("Error al actualizar cliente:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });

    }
}

//función para eliminar un cliente existente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "Falta el id del cliente" });
    }

    const [result] = await conmysql.query(
      "DELETE FROM clientes WHERE cli_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente eliminado correctamente", cli_id: id });

  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};
