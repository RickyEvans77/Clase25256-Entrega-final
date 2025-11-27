import express from 'express';
import * as controller from '../controllers/products.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// rutas protegidas
router.post('/create', authMiddleware, controller.create);
router.delete('/:id', authMiddleware, controller.remove);

export default router;