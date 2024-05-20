// ESTA CLASE SEGUN EL PARAMETRO DE INICIO DE CONSTRUCTOR FUNCIONARA CON
// FILESYSTEM o MONGO ATLAS.

import fs from 'fs/promises';
import productModel from './models/products.model.js';
import mongoose from 'mongoose';

// CLASE PRODUCTMANAGER.
class productManager{
    constructor(path,db_io) {
        this.productsFile = path
        this.newId = 0
        this.db_io = db_io
        if (!this.db_io) {
            this.initNewId()    
        }
    }

    // INICIALIZA EL NUEVO ID.
    async initNewId() {
        try {
            const products = await this.getProducts();
            if (products.length > 0) {
                // Si hay productos en el archivo, calculamos el máximo ID
                const maxId = Math.max(...products.map(product => product.id));
                // El nuevo ID será el máximo ID + 1
                this.newId = maxId + 1;
            } else {
                // Si no hay productos en el archivo, el nuevo ID será 1
                this.newId = 1;
            }
        } catch (error) {
            return error;
        }
    }

    // INICIO METODO PARA AGREGAR PRODUCTO.
    async addProduct(product) {
        try {

            let resp 

            if (this.db_io) {
                // Valida que se haya ingresado un code.
                if (!product.code) {
                    return 'Debe ingresar un código del producto'
                }

                // Valida que no exista el codigo.
                const encontrado = await this.getProductByIdCode(product.code,false)
                
                if (encontrado === 'no encontrado') {
                    // Las validaciones las hace Mongoose.
                    const newProduct = await productModel.create(product)
                    resp = 'ok'  
                } else {
                    resp = 'El código de producto ingresado ya existe'
                }

            } else {
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

                // Validacion de code.
                if (!product.code) {
                    return 'Debe ingresar un código del producto'
                }

                // Validacion de stock mayor o igual a 0.
                if (product.stock < 0) {
                    return 'Debe ingresar un stock del producto mayor ó igual a 0'
                }

                // Validacion de status true.
                if (product.status !== true) {
                    return 'Debe ingresar un Status Verdadero'
                }

                // Validacion de categoria.
                if (!product.category) {
                    return 'Debe ingresar una categoría del producto'
                }

                //////////////////
                // Lee archivo. //
                //////////////////
                const products = await this.getProducts()

                // Valida que no exista el codigo.
                if (products.find(productos => productos.code === product.code)){
                    return 'El código de producto ingresado ya existe'
                }

                // Si paso las validaciones se agrega al array.
                product.id = this.newId

                // Incrementa el nuevo ID para el próximo producto
                this.newId++

                products.push(product)

                // Escribe el archivo.
                const resp = this.writeProducts(products)
            }

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
    async getProducts(limit) {
        try {

            let products

            if (this.db_io) {
                // Si se proporciona el parámetro de límite, lo aplica.
                if (limit) {
                    products = await productModel.find().limit(limit) }
                else {
                    products = await productModel.find()
                }

            } else {
                const datos = await fs.readFile(this.productsFile, 'utf8')

                products = JSON.parse(datos)
            
                // Si se proporciona el parámetro de límite, lo aplica.
                if (limit) {
                    products = products.slice(0, limit);
                }
            }
            return products;

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

        if (this.db_io) {
            let product
            
            try{
                if (idTrueFalse) {
                    product = await productModel.findById(idCode)
                    if (product) {
                        return product
                    } else {
                        return 'no encontrado'
                    }
                } else {
                    product = await productModel.find({"code":idCode})
                    
                    if (product.length > 0) {
                        return product
                    } else {
                        return 'no encontrado'
                    }
                }
            }
            catch(error){
                return(error.message)
            }

        } else {

            //////////////////
            // Lee archivo. //
            //////////////////
            const products = await this.getProducts()

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
    }
    // FIN METODO PARA DEVOLVER PRODUCTO POR ID ó CODE.


    // INICIO METODO PARA BORRAR PRODUCTO POR ID.
    async deleteProductById(id){
        try {
            if (this.db_io) {
                
                // Validar si el ID es un ObjectId válido
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return `El ID ingresado ${id} no es un ObjectId válido`
                }

                // Intenta borrar.
                const product = await productModel.deleteOne({ _id: id })

                if (product.deletedCount > 0) {
                    return `Producto con ID ${id} borrado correctamente`
                } else {
                    return `El ID ingresado ${id} no existe; por lo tanto es imposible borrar`
                }
            } else {
                // Leer archivo de productos.
                const products = await this.getProducts()
                
                // Busca el indice dentro del array con el ID a borrar.
                const index = products.findIndex((product) => product.id === id)

                // Si encuentra el indice en el array lo borra.
                if (index !== -1) {
                    // Elimina el objeto del array.
                    products.splice(index,1)

                    // Escribe el archivo.
                    const resp = this.writeProducts(products)
                    return resp
                } else {
                    return `El ID ingresado ${id} no existe; por lo tanto es imposible borrar`
                }  
            }

        } catch (error) {
            return error;
        } 
    }
    // FIN METODO PARA BORRAR PRODUCTO POR ID.


    // INICIO METODO PARA ACTUALIZAR PRODUCTO.
    async updateProductById(id,productModif){
                
        try {

            if (this.db_io) {

                // Recupera el producto por ID para verificar si el code 
                // que puede haberse modificado en el body puede pertenecer
                // a otro producto.
                const productById = await this.getProductByIdCode(id,true)
                
                if (!productById) {
                    return 'El ID ingresado no existe; por lo tanto es imposible modificar';
                }

                if (productModif.code) {
                    // Busca el producto por Code.
                    const productByCode = await this.getProductByIdCode(productModif.code,false)

                    // Son iguales los code de productos por ID y por Code.
                    // Si son distintos indica que se repetiria un code.
                    if (JSON.stringify(productByCode[0]._id) !== JSON.stringify(productById._id)) {
                        return `El code modificado ${productModif.code} ya existe para el producto con ID ${productByCode[0]._id}`;
                    }
                }

                const product = await productModel.updateOne({ _id: id }, productModif)

                return 'Producto modificado correctamente';


            } else {
                // Para evitar si se envia un ID en el objeto productoModif
                // se modifique el ID erroneamente.
                productModif.id = id

                // Leer archivo de productos.
                const products = await this.getProducts()

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


//module.exports = productManager;
export default productManager;