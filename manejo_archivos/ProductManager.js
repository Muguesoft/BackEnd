const fs = require('fs').promises

// CLASE PRODUCTMANAGER.
class productManager{
    constructor(path) {
        this.productsFile = path
        this.newId = 0
    }

    // INICIO METODO PARA AGREGAR PRODUCTO.
    async addProduct(product) {
        try {
            ///////////////////////////////////////
            // Validaciones de ingreso de datos. //
            ///////////////////////////////////////

            // Validacion de titulo.
            if (!product.title) {
                return 'Debe ingresar un título del producto'
            }

            // Validacion de descripcion.
            if (!product.description) {
                return 'Debe ingresar una descripción del producto'
            }

            // Validacion de precio mayor a 0.
            if (product.price <= 0) {
                return 'Debe ingresar un precio del producto mayor a 0'
            }

            // Validacion de thumbnail.
            if (!product.thumbnail) {
                return 'Debe ingresar un thumbnail del producto'
            }

            // Validacion de code.
            if (!product.code) {
                return 'Debe ingresar un código del producto'
            }

            // Validacion de stock mayor o igual a 0.
            if (product.stock < 0) {
                return 'Debe ingresar un stock del producto mayor ó igual a 0'
            }

            //////////////////
            // Lee archivo. //
            //////////////////
            let products = await this.getProducts()

            // Valida que no exista el codigo.
            if (products.find(productos => productos.code === product.code)){
                return 'El código de producto ingresado ya existe'
            }

            // Si paso las validaciones se agrega al array.
            this.newId = this.newId + 1
            product.id = this.newId 
            products.push(product)

            // Escribe el archivo.
            let resp = this.writeProducts(products)
            
            // Retorna respuesta de funcion de escritura.
            return resp

        } catch (error) {
            return error
        }
    }
    // FIN METODO PARA AGREGAR PRODUCTO.

    // INICIO DE METODO PARA ESCRIBIR ARCHIVO DE PRODUCTOS.
    async writeProducts(products) {
        try {
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2)) 
            return 'ok'

        } catch (error) {
            throw error
        }  
    }
    // FIN DE METODO PARA ESCRIBIR ARCHIVO DE PRODUCTOS.


    // INICIO METODO PARA DEVOLVER PRODUCTOS.
    async getProducts() {
        try {
            let datos = await fs.readFile(this.productsFile, 'utf8')
            return JSON.parse(datos)

        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                return error
            }
        }
    }
    // FIN METODO PARA DEVOLVER PRODUCTOS.


    // INICIO METODO PARA DEVOLVER PRODUCTO POR ID ó CODE.
    async getProductByIdCode(idCode,idTrueFalse){

        //////////////////
        // Lee archivo. //
        //////////////////
        let products = await this.getProducts()

        let productFind
        let message
        
        // Es ID?
        if (idTrueFalse) {
            productFind = products.find(productos => productos.id === idCode)
            message = 'ID'    
        } else {
            // Es CODE.
            productFind = products.find(productos => productos.code === idCode)
            message = 'Código'
        }
        
        if (!productFind) {
            return `${message}`
        } else {
            return productFind
        }
    }
    // FIN METODO PARA DEVOLVER PRODUCTO POR ID ó CODE.


    // INICIO METODO PARA BORRAR PRODUCTO POR ID.
    async deleteProductById(id){
        try {

            // Leer archivo de productos.
            let products = await this.getProducts()

            // Busca el indice dentro del array con el ID a borrar.
            const index = products.findIndex((product) => product.id === id)

            // Si encuentra el indice en el array lo borra.
            if (index !== -1) {
                // Elimina el objeto del array.
                products.splice(index,1)

                // Escribe el archivo.
                let resp = this.writeProducts(products)
                return resp
            } else {
                return `El ID ingresado ${id} no existe; por lo tanto es imposible borrar`
            }  

        } catch (error) {
            return error;
        } 
    }
    // FIN METODO PARA BORRAR PRODUCTO POR ID.


    // INICIO METODO PARA ACTUALIZAR PRODUCTO.
    async updateProductById(id,productModif){
        // Para evitar si se envia un ID en el objeto productoModif
        // se modifique el ID erroneamente.
        productModif.id = id
        
        try {
            // Leer archivo de productos.
            let products = await this.getProducts()

            // Busca el indice dentro del array con el ID a borrar.
            const index = products.findIndex((product) => product.id === id)

            // Si encuentra el indice en el array lo actualiza.
            if (index !== -1) {
                // Modifica el objeto del array.
                Object.assign(products[index],productModif)

                // Escribe el archivo.
                let resp = this.writeProducts(products)
                return resp
            } else {
                return 'El ID ingresado no existe; por lo tanto es imposible modificar';
            }
        }

        catch (error) {
            return `Error actualizando producto con ID ${id}`;
        }
    }
    // FIN METODO PARA ACTUALIZAR PRODUCTO POR ID.


    // INICIO DE METODO PARA BORRAR ARCHIVO.
    async deleteFile() {
        try {
            await fs.unlink(this.productsFile)
            return 'ok'
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                return 'no encontrado'
            } else {
                return error
            }
        }
    }
    // FIN DE METODO PARA BORRAR ARCHIVO.
}


// Ejecucion de clase ProductManager.
const productAdmin = new productManager('./products.json')

/////////////
// TESTING //
/////////////

const producto1 = {
    title:'producto 1',
    description:'Este es un producto prueba1',
    price: 10,
    thumbnail: 'Sin imagen 1',
    code: 'c1',
    stock: 10
}

const producto2 = {
    title:'producto 2',
    description:'Este es un producto prueba2',
    price: 20,
    thumbnail: 'Sin imagen 2',
    code: 'c2',
    stock: 20
}

const producto3 = {
    title:'producto 3',
    description:'Este es un producto prueba3',
    price: 30,
    thumbnail: 'Sin imagen 3',
    code: 'c3',
    stock: 30
}

async function funcionesAsincronas() {
    let resp

    // Elimina posible archivo creado.
    resp = await productAdmin.deleteFile()
    if (resp === 'ok') {
        console.log('Archivo borrado correctamente.');
    } else {
        console.error('Error borrando archivo: ',resp);

        // Si da error de borrado intenta continuar de todas maneras.
    }

    // Agrega productos 1, 2 y 3.
    resp = await productAdmin.addProduct(producto1)
    msgAddProduct(resp)

    resp = await productAdmin.addProduct(producto2)
    msgAddProduct(resp)

    resp = await productAdmin.addProduct(producto3)
    msgAddProduct(resp)

    // Busca el producto con ID2.
    const idCode = 2
    resp = await productAdmin.getProductByIdCode(idCode,true)
    if (resp === 'ID' || resp === 'Código') {
        console.log(`No se encuentra el ${resp} ${idCode}...`);
    } else {
        // Borra el Producto encontrado.
        resp = await productAdmin.deleteProductById(idCode)
    }
    

    // Muestra productos.
    const productos = await productAdmin.getProducts()
    console.log(productos);

    // Objeto con propiedades modificadas.
    const productModif = {
        title:'producto modificado',
        description:'Este es un producto modificado',
        price: 700,
        stock: 777
    }

    // Modifica .
    resp = await productAdmin.updateProductById(3,productModif)
    if (resp === 'ok') {
        console.log(`Producto con ID ${productModif.id} modificado correctamente`);    
    } else {
        console.log(resp);
    }
    
    
    // Recupera el producto modificado por Code.
    resp = await productAdmin.getProductByIdCode('c3',false)
    if (resp === 'ID' || resp === 'Código') {
        console.log(`No se encuentra el ${resp} ${idCode}...`);
    } else {
        // Muestra el Producto encontrado.
        console.log(resp);
    }

    // Agrego nuevo producto
    const producto4 = {
        title:'producto 4',
        description:'Este es un producto prueba4',
        price: 40,
        thumbnail: 'Sin imagen 4',
        code: 'c4',
        stock: 40
    }

    // Agrega producto 4.
    resp = await productAdmin.addProduct(producto4)
    msgAddProduct(resp)
}

funcionesAsincronas()

function msgAddProduct(msg){
    if (msg === 'ok') {
        console.log(`Producto agregado correctamente con ID ${productAdmin.newId} .`);
    } else {
        console.log('Error agregando producto: ',msg);  
    }
}