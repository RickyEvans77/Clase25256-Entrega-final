import * as productModel from '../models/product.model.js';

export async function getAllProducts() {
    return await productModel.findAll();
}

export async function getProductById(id) {
    return await productModel.findById(id);
}

export async function createNewProduct(data) {
    if (!data || !data.name || data.price == null) {
        const err = new Error('Payload inválido: se requiere name y price');
        err.status = 400;
        throw err;
    }
    return await productModel.createProduct(data);
}

export async function removeProduct(id) {
    const deleted = await productModel.deleteById(id);
    if (!deleted) {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
    }
    return true;
}