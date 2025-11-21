
import { Router } from "express";
import {
  getDetalles,
  getDetalleById,
  postDetalle,
  putDetalle,
  patchDetalle,
  deleteDetalle,
} from "../controllers/pedidosDetalleCtrl.js";

const router = Router();
router.get("/pedidos_detalle", getDetalles);
router.get("/pedidos_detalle/:id", getDetalleById);
router.post("/pedidos_detalle", postDetalle);
router.put("/pedidos_detalle/:id", putDetalle);
router.patch("/pedidos_detalle/:id", patchDetalle);
router.delete("/pedidos_detalle/:id", deleteDetalle);
export default router;