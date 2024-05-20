import fs from 'fs/promises';
import productManager from './ProductManager.js';
import cartModel from './models/carts.model.js';
import productModel from './models/products.model.js';

// CLASE CARTMANAGER.
class cartManager{
    constructor() {
        this.productManager = new productManager('',true);
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

    // METODO PARA INSERTAR UN NUEVO ITEM EN EL CARRITO EXISTENTE.
    async newItemCart(cartItem) {
        try {
            //////////////////
            // Lee archivo. //
            //////////////////
            const carts = await this.getCarts()

            // Inserta nuevo carrito.
            carts.push(cartItem)
            
            // Escribe el archivo.
            this.writeCarts(carts)
            
            // Retorna respuesta de funcion de escritura.
            return 'ok'    
        } 
        catch (error) {
            return 'Error insertando nuevo Item al Carrito'
        }
    }
    
    

    // INICIO METODO PARA DEVOLVER CARRITOS.
    async getCarts() {
        try {
            const carts = await cartModel.find()
            
            return carts

        } catch (error) {
            return error
        }

    }
    // FIN METODO PARA DEVOLVER CARRITOS.


    // INICIO METODO PARA DEVOLVER CARRITO POR ID.
    async getCartById(id){

        // Busca carrito.
        const cartFind = await cartModel.findById(id)
        
        
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
            // Racupera carritos por ID.
            const carts = await this.getCarts()

            // Busca el indice dentro del array con el ID a actualizar.
            const cartIndex = carts.findIndex((cart) => cart.id === cid);
            if (cartIndex === -1) {
                throw new Error(`Carrito con ID ${cid} no encontrado`)
            }
            
            // Recupera esa parte del carrito.
            const cart = carts[cartIndex]

            // Busca en el carrito seleccionado el producto ingresado por ID.
            const itemIndex = cart.products.findIndex((product) => product.product === pid)

            // Si no encuentra el indice en el array inserta el producto con cantidad 1.
            if (itemIndex === -1) {

                // Verifica que el producto exista en el json.
                const product = await this.productManager.getProductByIdCode(pid,true)
                if (product === 'ID' || product === 'Código') {
                    throw new Error(`Producto con ID ${pid} no existe`)
                }

                // Nuevo item de carrito. 
                const newItemCart = { product: pid, quantity: 1 }

                // Inserta nuevo carrito.
                cart.products.push(newItemCart)

            } else {
                // Si el producto existe incrementa la quantity en 1.
                cart.products[itemIndex].quantity++;
            }

            // Actualiza el carrito general
            carts[cartIndex] = cart

            // Escribe el archivo.
            this.writeCarts(carts)
            
            // Retorna respuesta de funcion de escritura.
            return 'ok'
        }
        catch (error) {
            return error.toString();
        }
    }
    // FIN METODO PARA ACTUALIZAR CARRITO POR ID.
}

export default cartManager;