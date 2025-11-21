import { Router } from 'express'

//importar las funciones
import { getClientes, getClientesId, postCliente, putCliente, deleteCliente } from '../controladores/clientesCtrl.js';
const router=Router();

//armar nuestras rutas
export default router 
router.get('/clientes', getClientes)
router.get('/clientes/:id', getClientesId)
router.post('/clientes', postCliente)
router.put("/clientes/:id", putCliente);
router.delete("/clientes/:id", deleteCliente);