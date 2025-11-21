import { conmysql } from "../db.js";

export const prueba=(req,res)=>{
    res.send('prueba con exito');
}

export const getTiposPagos=async(req,res)=>{
   try{
    const [result]= await conmysql.query(' select * from tipo_pago ')
    res.json({
        cant:result.length,
        data:result
   })

   } catch (error){
    return res.status(500).json({message:" error en el servidor"})
   }
}