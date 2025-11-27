import fetch from "node-fetch";
import chalk from "chalk";

export async function obtenerProductos() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();

        console.log(chalk.cyanBright("🛍️ Lista de productos:\n"));
        data.forEach((p) =>
            console.log(chalk.green(`- [${p.id}] ${p.title} ($${p.price})`))
        );
    } catch (error) {
        console.log(chalk.red("❌ Error al obtener productos:"), error.message);
    }
}

export async function obtenerProducto(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/${id}`);
        const data = await response.json();
        console.log(chalk.cyanBright("\n📦 Producto encontrado:\n"), data);
    } catch (error) {
        console.log(chalk.red("❌ Error al obtener producto:"), error.message);
    }
}

export async function agregarProducto(producto) {
    try {
        const response = await fetch("https://fakestoreapi.com/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        console.log(chalk.green("\n✅ Producto agregado correctamente:\n"), data);
    } catch (error) {
        console.log(chalk.red("❌ Error al agregar producto:"), error.message);
    }
}

export async function eliminarProducto(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        console.log(chalk.redBright("\n🗑️ Producto eliminado:\n"), data);
    } catch (error) {
        console.log(chalk.red("❌ Error al eliminar producto:"), error.message);
    }
}

export async function actualizarProducto(producto) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${producto.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        console.log(chalk.yellowBright("\n♻️ Producto actualizado:\n"), data);
    } catch (error) {
        console.log(chalk.red("❌ Error al actualizar producto:"), error.message);
    }
}
