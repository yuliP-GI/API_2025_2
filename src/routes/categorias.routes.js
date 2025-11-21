import { Router } from 'express'

//importar las funciones
import { getCategorias, postCategoria } from '../controladores/categoriasCtrl.js';
const router=Router();

//armar nuestras rutas
router.get('/categorias', getCategorias)
router.post('/categorias', postCategoria)
export default router 