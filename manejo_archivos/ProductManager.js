const fs = require('fs').promises

// CLASE PRODUCTMANAGER.
class productManager{
    constructor() {
        this.path = './'
        this.productsFile = this.path+'products.txt'
    }

    // INICIO METODO PARA AGREGAR PRODUCTO.
    async addProduct(product) {
        try {
            ///////////////////////////////////////
            // Validaciones de ingreso de datos. //
            ///////////////////////////////////////

            // Validacion de titulo.
            if (!product.title) {
                console.log('Debe ingresar un título del producto')
                return
            }

            // Validacion de descripcion.
            if (!product.description) {
                console.log('Debe ingresar una descripción del producto')
                return
            }

            // Validacion de precio mayor a 0.
            if (product.price <= 0) {
                console.log('Debe ingresar un precio del producto mayor a 0')
                return
            }

            // Validacion de thumbnail.
            if (!product.thumbnail) {
                console.log('Debe ingresar un thumbnail del producto')
                return
            }

            // Validacion de code.
            if (!product.code) {
                console.log('Debe ingresar un código del producto')
                return
            }

            // Validacion de stock mayor o igual a 0.
            if (product.stock < 0) {
                console.log('Debe ingresar un stock del producto mayor ó igual a 0')
                return
            }

            //////////////////
            // Lee archivo. //
            //////////////////
            let products = await this.getProducts()

            // Valida que no exista el codigo.
            if (products.find(productos => productos.code === product.code)){
                console.log('El código de producto ingresado ya existe')
                return
            }

            // Si paso las validaciones se agrega al array.
            const newId = products.length + 1
            product.id = newId
            products.push(product)

            // Escribe el archivo.
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
            console.log(`Producto ${newId} agregado correctamente`);
            
        } catch (error) {
            console.error("Error al crear el producto", error)
        }
    }
    // FIN METODO PARA AGREGAR PRODUCTO.


    // INICIO METODO PARA DEVOLVER PRODUCTOS.
    async getProducts() {
        try {
            let datos = await fs.readFile(this.productsFile, 'utf8')
            return JSON.parse(datos)

        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw error
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
            console.log(`No existe un producto con el ${message} ${idCode}`)
            return
        } else {
            console.log(`Producto con el ${message} ${idCode} encontrado`,productFind)
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
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
                console.log(`Producto con ID ${id} eliminado correctamente`);
            } else {
                console.log('El ID ingresado no existe; por lo tanto es imposible borrar');
            }  

        } catch (error) {
            console.log(`Error borrando producto con ID ${id}`,error);
        } 
    }
    // FIN METODO PARA BORRAR PRODUCTO POR ID.


    // INICIO METODO PARA ACTUALIZAR PRODUCTO POR ID.
    async updateProductById(id,productModif){
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
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
                console.log(`Producto con ID ${id} modificado correctamente`);
            } else {
                console.log('El ID ingresado no existe; por lo tanto es imposible modificar');
            }
        }

        catch (error) {
            console.log(`Error actualizando producto con ID ${id}`,error);
        }
    }
    // FIN METODO PARA ACTUALIZAR PRODUCTO POR ID.


    // INICIO DE METODO PARA BORRAR ARCHIVO.
    async deleteFile() {
        try {
            await fs.unlink(this.productsFile)
            console.log("Archivo eliminado correctamente")
        } catch (error) {
            console.error("No se pudo eliminar el archivo", error)
        }
    }
    // FIN DE METODO PARA BORRAR ARCHIVO.
}


// Ejecucion de clase ProductManager.
const productAdmin = new productManager()

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
    // Elimina posible archivo creado.
    await productAdmin.deleteFile()

    // Agrega productos 1, 2 y 3.
    await productAdmin.addProduct(producto1)
    await productAdmin.addProduct(producto2)
    await productAdmin.addProduct(producto3)

    // Busca el producto con ID2.
    await productAdmin.getProductByIdCode(2,true)

    // Borra el producto con ID2.
    await productAdmin.deleteProductById(2)

    // Muestra productos.
    const productos = await productAdmin.getProducts()
    console.log(productos);

    // Objeto con propiedades modificadas.
    const productModif = {
        title:'producto modificado',
        description:'Este es un producto modificado',
        price: 700,
        thumbnail: 'Sin imagen modificada',
        stock: 777
    }

    // Modifica con ID 3.
    await productAdmin.updateProductById(3,productModif)
    
    // Recupera el producto modificado por Code.
    await productAdmin.getProductByIdCode('c3',false)
}

funcionesAsincronas()