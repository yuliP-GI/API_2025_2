import { Router } from "express";
import upload from "../middlewares/upload.js";
import { getProductos, getProductoId, postProducto, putProducto, deleteProducto } from "../controladores/productosCtrl.js";

const router = Router();

router.get("/productos", getProductos);
router.get("/productos/:id", getProductoId);
//router.post("/productos", postProducto);
router.post("/productos",upload.single('prod_imagen'), postProducto);
//router.put("/productos/:id", putProducto);
router.put("/productos/:id", putProducto);
router.delete("/productos/:id", deleteProducto);

export default router;
