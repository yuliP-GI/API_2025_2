import { Router } from 'express'

//importar las funciones
import { getTiposPagos } from '../controladores/tipoPagoCtrl.js';
const router=Router();

//armar nuestras rutas
export default router 
router.get('/tipoPagos', getTiposPagos)
