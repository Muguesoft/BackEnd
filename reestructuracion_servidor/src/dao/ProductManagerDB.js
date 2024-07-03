import productModel from './models/products.model.js';
import mongoose from 'mongoose';

// CLASE PRODUCTMANAGER.
class productManagerDB{
    constructor() {
        }
    
    // INICIO METODO PARA AGREGAR PRODUCTO.
    async addProduct(product) {
        try {
            let resp

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

            // Retorna respuesta de funcion de escritura.
            return resp

        } catch (error) {
            return error
        }
    }
    // FIN METODO PARA AGREGAR PRODUCTO.

    
    // INICIO METODO PARA DEVOLVER PRODUCTOS.
    async getProducts({ limit = 10, page = 1, sort, query, category, availability } = {}) {
        try {
            let filter = {}

                const parameters = {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1} : {},
                    lean: true};
                
                // Si hay un filtro puede ser por titulo Ó ($or) por descripción Ó por categoria
                // y con 'i' indica que no discrimina entre mayusculas y minusculas.
                //const filter = query ? { $or: [{title: new RegExp(query, 'i')}, {description: new RegExp(query, 'i')} ] } : {};

                if (query) {
                    filter.$or = [
                        { title: new RegExp(query, 'i') },
                        { description: new RegExp(query, 'i') }
                    ];
                }
                                
                if (category) {
                    filter.category = new RegExp(category, 'i');
                }
                
                if (availability !== undefined) {
                    filter.stock = availability ? { $gt: 0 } : { $eq: 0 };
                }
                
                const products = await productModel.paginate(filter, parameters);

                return {
                    status: 'success',
                    payload: products.docs,
                    totalPages: products.totalPages,
                    prevPage: products.hasPrevPage ? products.prevPage : null,
                    nextPage: products.hasNextPage ? products.nextPage : null,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null,
                    nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null
                };

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
        try{
            let product
            
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
        } catch(error){
            return(error.message)
        }
    }
    // FIN METODO PARA DEVOLVER PRODUCTO POR ID ó CODE.


    // INICIO METODO PARA BORRAR PRODUCTO POR ID.
    async deleteProductById(id){
        try {
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
        } catch (error) {
            return error;
        } 
    }
    // FIN METODO PARA BORRAR PRODUCTO POR ID.


    // INICIO METODO PARA ACTUALIZAR PRODUCTO.
    async updateProductById(id,productModif){
                
        try {
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
                
                if (productByCode !== 'no encontrado') {
                    // Son iguales los code de productos por ID y por Code.
                    // Si son distintos indica que se repetiria un code.
                    if (JSON.stringify(productByCode[0]._id) !== JSON.stringify(productById._id)) {
                        return `El code modificado ${productModif.code} ya existe para el producto con ID ${productByCode[0]._id}`;
                    }    
                }
            }

            const product = await productModel.updateOne({ _id: id }, productModif)

            return 'Producto modificado correctamente';
        } catch (error) {
            return `Error actualizando producto con ID ${id}`;
        }
    }
    // FIN METODO PARA ACTUALIZAR PRODUCTO POR ID.
}

export default productManagerDB;