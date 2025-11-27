import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productsRoutes from './src/routes/products.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import initFirebase from './src/models/firebase.js';

dotenv.config();

// intentar inicializar Firebase, pero no detener la app si falla
try {
  initFirebase();
} catch (err) {
  console.warn('Advertencia: no se pudo inicializar Firebase. Algunas funciones que usan la DB remota pueden fallar.');
  console.warn(err.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// logger simple de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas (montadas)
app.use('/api/products', productsRoutes);
app.use('/auth', authRoutes);

// listar rutas registradas con prefijo (función robusta)
function listRoutes() {
  const routes = [];

  function traverseStack(stack, prefix = '') {
    stack.forEach((layer) => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
        const fullPath = prefix + (layer.route.path === '/' ? '' : layer.route.path);
        routes.push(`${methods} ${fullPath || '/'}`);
      } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        // extract mount path if available
        const mountPath = (layer.regexp && layer.regexp.source)
          ? (layer.regexp.source
              .replace('^\\', '')
              .replace('\\/?(?=\\/|$)', '')
              .replace(/\\\//g, '/')
              .replace('(?:', '')
              .split('|')[0])
          : '';
        // compute new prefix (best effort)
        const newPrefix = prefix + (mountPath && mountPath !== '^' ? mountPath : '');
        traverseStack(layer.handle.stack, newPrefix);
      }
    });
  }

  if (!app._router) {
    console.log('No hay router registrado aún.');
    return;
  }

  traverseStack(app._router.stack, '');
  console.log('Rutas registradas:');
  routes.forEach(r => console.log('  -', r));
}

listRoutes();

// 404 para rutas desconocidas
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// middleware global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
