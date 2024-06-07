import fs from 'fs/promises';
import productManagerFs from './ProductManagerFS.js';


// CLASE CARTMANAGER.
class cartManagerFS{
    constructor(path,pathProductManager) {
        this.cartsFile = path
        this.newId = 0
        this.initNewId()
        this.productManager = new productManagerFs(pathProductManager);
    }

    // INICIALIZA EL NUEVO ID.
    async initNewId() {
        try {
            const carts = await this.getCarts();
            if (carts.length > 0) {
                // Si hay carritos en el archivo, calculamos el máximo ID
                const maxId = Math.max(...carts.map(cart => cart.id));
                // El nuevo ID será el máximo ID + 1
                this.newId = maxId + 1;
            } else {
                // Si no hay carritos en el archivo, el nuevo ID será 1
                this.newId = 1;
            }
        } catch (error) {
            return error;
        }
    }

    // METODO QUE PERMITE VALIDAR SI LOS ID DE PRODUCTOS
    // ENVIADOS EN EL BODY EXISTEN EN EL products.json.
    async validateProductsCart(productsCart) {
        try{
            // Recupera los productos desde JSON.
            const productsFile = await this.productManager.getProducts()
            
            // Validar que todos los productos en la solicitud existan            
            const idNoExistente = productsCart.filter(prodCart => !productsFile.some(p => p.id === prodCart.product));
            

            if (idNoExistente.length > 0) {
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
            const cart = {
                id: this.newId,
                products: productsCart.products.map(product => ({ product: product.product, quantity: 1 }))
            }
            
            // Incrementa el nuevo ID para el próximo carrito
            this.newId++

            
            //////////////////
            // Lee archivo. //
            //////////////////
            const carts = await this.getCarts()

            // Inserta nuevo carrito.
            carts.push(cart)
            
            // Escribe el archivo.
            this.writeCarts(carts)
            
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
    
    // INICIO DE METODO PARA ESCRIBIR ARCHIVO DE CARRITOS.
    async writeCarts(carts) {
        try {
            await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2)) 
            return 'ok'

        } catch (error) {
            throw error
        }  
    }
    // FIN DE METODO PARA ESCRIBIR ARCHIVO DE CARTS.


    // INICIO METODO PARA DEVOLVER CARRITOS.
    async getCarts() {
        try {
            const datos = await fs.readFile(this.cartsFile, 'utf8')

            const carts = JSON.parse(datos)

            return carts;

        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                return error
            }
        }
    }
    // FIN METODO PARA DEVOLVER CARRITOS.


    // INICIO METODO PARA DEVOLVER CARRITO POR ID.
    async getCartById(id){

        //////////////////
        // Lee archivo. //
        //////////////////
        const carts = await this.getCarts()

        // Busca carrito.
        const cartFind = carts.find(cart => cart.id === id)
        
        
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

            // Leer archivo de productos.
            const carts = await this.getCarts()
            
            // Busca el indice dentro del array con el ID a borrar.
            const index = carts.findIndex((cart) => cart.id === id)

            // Si encuentra el indice en el array lo borra.
            if (index !== -1) {
                // Elimina el objeto del array.
                carts.splice(index,1)

                // Escribe el archivo.
                const resp = this.writeCarts(carts)
                return resp
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

export default cartManagerFS;