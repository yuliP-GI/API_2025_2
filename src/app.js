import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔧 Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rutas
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import authRoutes from './routes/auth.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import tipoPagoRoutes from './routes/tipoPago.routes.js';
import { verifyToken } from './middleware/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// Rutas de autenticación (no requieren token)
app.use('/api/auth', authRoutes);

// Rutas protegidas con JWT
app.use('/api', verifyToken, clientesRoutes);
app.use('/api', verifyToken, productosRoutes);
app.use('/api', verifyToken, pedidosRoutes);
app.use('/api', verifyToken, categoriasRoutes);
app.use('/api', verifyToken, tipoPagoRoutes);

// ✅ Servir archivos estáticos (imágenes, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint no encontrado
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;