import productManagerDB from '../services/ProductManagerDB.js';
import cartModel from '../models/carts.model.js';
import productModel from '../models/products.model.js';

// CLASE CARTMANAGER.
class cartManagerDB{
    constructor() {
        this.productManagerDB = new productManagerDB();
    }

    // METODO QUE PERMITE VALIDAR SI LOS ID DE PRODUCTOS
    // ENVIADOS EN EL BODY EXISTEN EN LA COLECCION products de MongoAtlas.
    async validateProductsCart(productsCart) {
        try{            
            // Hace Map para crear un array con solo los ID
            const productsIds = productsCart.map(prodCart => prodCart.product)
            
            // Valida cuales de esos productosIDs existen en MongoAtlas.
            const productsExist = await productModel.find({ _id: { $in: productsIds } })
            
            // Compara ambos array para verificar si hay no encontrados.
            const noEncontrados = productsIds.filter(id => !productsExist.some(p => p._id.equals(id)));
            
            if (noEncontrados.length > 0) {
                return 'Algunos productos proporcionados no existen'
            }
            return 'ok'
        }
        catch(error){
            return 'error';
        }
    }
    // FIN METODO VALIDACION PRODUCTOS. 


    // INICIO METODO PARA CREAR NUEVO CARRITO.
    async newCart(productsCart) {
        try {
            // Valida que los productos existan en JSON.
            const resp = await this.validateProductsCart(productsCart.products)
            if (resp !== 'ok') {
                return resp
            }

            // Nuevo carrito. 
            await cartModel.create({
                products: productsCart.products.map(product => ({
                    product: product.product,
                    quantity: 1
                }))
            });
            
            
            // Retorna respuesta de funcion de escritura.
            return 'ok'

        } catch (error) {
            return 'error newCart'
        }
    }
    // FIN METODO PARA NUEVO CARRITO.

    // INICIO METODO PARA CREAR NUEVO CARRITO VACIO.
    async newEmptyCart() {
        try {
            
            // Nuevo carrito vacio. 
            const newEmpty = await cartModel.create({ products: [] });
                       
            // Retorna respuesta de funcion de escritura.
            return newEmpty

        } catch (error) {
            return 'error newEmptyCart'
        }
    }
    // FIN METODO PARA NUEVO CARRITO VACIO.

    // INICIO METODO PARA DEVOLVER CARRITOS.
    async getCarts() {
        try {
            // Se utiliza POPULATE para mostrar detalle de productos
            // en los carritos
            const carts = await cartModel.find().populate('products.product');
            
            return carts

        } catch (error) {
            return error
        }

    }
    // FIN METODO PARA DEVOLVER CARRITOS.


    // INICIO METODO PARA DEVOLVER CARRITO POR ID.
    async getCartById(id){

        // Busca carrito.
        // Se utiliza POPULATE para mostrar detalle de productos
        // en el carrito
        const cartFind = await cartModel.findById(id).populate('products.product');
        
        if (!cartFind) {
            return `Carrito ID ${id} no encontrado`
        } else {
            return cartFind
        }
    }
    // FIN METODO PARA DEVOLVER CARRITO POR ID.


    // INICIO METODO PARA BORRAR CARRITO POR ID.
    async deleteCartById(id){
        try {

            const cart = await cartModel.deleteOne({ _id: id })
                
            if (cart.deletedCount > 0) {
                return `Carrito con ID ${id} borrado correctamente`
            } else {
                return `El ID ingresado ${id} no existe; por lo tanto es imposible borrar`
            }

        } catch (error) {
            return error;
        } 
    }
    // FIN METODO PARA BORRAR CARRITO POR ID.


    // INICIO METODO PARA ACTUALIZAR PRODUCTO.
    async updateCart(cid,pid){
                
        try {
            // Verificar si el producto existe en la base de datos.
            const productExists = await productModel.find({ _id: { $in: pid } })
            if (!productExists) {
                throw new Error(`Producto con ID ${pid} no existe`);
            }

            // Buscar el carrito por su ID.
            const cart = await cartModel.findById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }

            // Buscar el producto en el carrito.
            const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
            
            if (productIndex !== -1) {
                // Incrementar la cantidad si el producto ya existe en el carrito.
                cart.products[productIndex].quantity += 1;
            } else {
                // Agregar el producto al carrito si no existe.
                cart.products.push({ product: pid, quantity: 1 });
            }

            // Guardar los cambios en la base de datos.
            await cart.save();
            
            // Retornar respuesta de éxito.
            return 'ok';
        }
        catch (error) {
            return error.toString();
        }
    }
    // FIN METODO PARA ACTUALIZAR CARRITO POR ID.

    // INICIO METODO PARA ELIMINAR PRODUCTO DEL CARRITO.
    async deleteProductFromCart(cid, pid) {
        try {
            // Buscar el carrito por su ID.
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return `Carrito con ID ${cid} no encontrado`;
            }

            // Buscar el índice del producto en el carrito.
            const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

            if (productIndex === -1) {
                return `Producto con ID ${pid} no encontrado en el carrito`;
            }

            // Eliminar el producto del carrito.
            cart.products.splice(productIndex, 1);

            // Guardar los cambios en la base de datos.
            await cart.save();

            // Retornar respuesta de éxito.
            return 'ok';
        } catch (error) {
            return error.toString();
        }
    }
    // FIN METODO PARA ELIMINAR PRODUCTO DEL CARRITO.


    // INICIO METODO PARA ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO.
    async emptyCart(cid) {
        try {
            // Buscar el carrito por su ID.
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return `Carrito con ID ${cid} no encontrado`;
            }

            // Limpiar todos los productos del carrito.
            cart.products = [];

            // Guardar los cambios en la base de datos.
            await cart.save();

            // Retornar respuesta de éxito.
            return 'ok';
        } catch (error) {
            return error.toString();
        }
    }
    // FIN METODO PARA ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO.

    // INICIO METODO PARA ACTUALIZAR LA CANTIDAD DE UN PRODUCTO EN EL CARRITO.
    async updateProductQuantity(cid, pid, quantity) {
        try {
            // Validar si la cantidad es un número positivo.
            if (quantity <= 0) {
                return 'La cantidad debe ser un número positivo';
            }

            // Buscar el carrito por su ID.
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return `Carrito con ID ${cid} no encontrado`;
            }

            // Buscar el producto en el carrito.
            const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
            if (productIndex === -1) {
                return `Producto con ID ${pid} no encontrado en el carrito`;
            }

            // Actualizar la cantidad del producto.
            cart.products[productIndex].quantity = quantity;

            // Guardar los cambios en la base de datos.
            await cart.save();

            // Retornar respuesta de éxito.
            return 'ok';
        } catch (error) {
            return error.toString();
        }
    }
    // FIN METODO PARA ACTUALIZAR LA CANTIDAD DE UN PRODUCTO EN EL CARRITO.

    // Para cumplir con PUT api/carts/:cid y en el body un array de productos y cantidades
    async updateCartProducts(cid, products) {
        try {
            // Validar los productos y cantidades.
            const productsIds = products.map(prod => prod.product);
            const productsExist = await productModel.find({ _id: { $in: productsIds } });
            const noEncontrados = productsIds.filter(id => !productsExist.some(p => p._id.equals(id)));

            if (noEncontrados.length > 0) {
                return `Algunos productos proporcionados no existen: ${noEncontrados.join(', ')}`;
            }

            // Buscar el carrito por su ID.
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return `Carrito con ID ${cid} no encontrado`;
            }

            // Actualizar los productos del carrito.
            products.forEach(product => {
                const productIndex = cart.products.findIndex(item => item.product.toString() === product.product);
                if (productIndex !== -1) {
                    // Actualizar la cantidad si el producto ya existe en el carrito.
                    cart.products[productIndex].quantity = product.quantity;
                } else {
                    // Agregar el producto al carrito si no existe.
                    cart.products.push({ product: product.product, quantity: product.quantity });
                }
            });

            // Guardar los cambios en la base de datos.
            await cart.save();

            return 'ok';
        } catch (error) {
            return error.toString();
        }
    }
}


export default cartManagerDB;