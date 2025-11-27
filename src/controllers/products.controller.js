import * as service from '../services/products.service.js';

export async function getAll(req, res, next) {
    try {
        const items = await service.getAllProducts();
        res.json(items);
    } catch (err) {
        next(err);
    }
}

export async function getById(req, res, next) {
    try {
        const item = await service.getProductById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(item);
    } catch (err) {
        next(err);
    }
}

export async function create(req, res, next) {
    try {
        const created = await service.createNewProduct(req.body);
        res.status(201).json(created);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function remove(req, res, next) {
    try {
        await service.removeProduct(req.params.id);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
}