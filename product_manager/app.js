// CLASE PRODUCTMANAGER.
class productManager{
    constructor() {
        this.products = []
    }

    // INICIO METODO PARA AGREGAR PRODUCTO.
    addProduct(title,description,price,thumbnail,code,stock) {
        // Validaciones de ingreso de datos.

        // Validacion de titulo.
        if (!title) {
            console.log('Debe ingresar un título del producto')
            return
        }

        // Validacion de descripcion.
        if (!description) {
            console.log('Debe ingresar una descripción del producto')
            return
        }

        // Validacion de precio mayor a 0.
        if (price <= 0) {
            console.log('Debe ingresar un precio del producto mayor a 0')
            return
        }

        // Validacion de thumbnail.
        if (!thumbnail) {
            console.log('Debe ingresar un thumbnail del producto')
            return
        }

        // Validacion de code.
        if (!code) {
            console.log('Debe ingresar un código del producto')
            return
        }

        // Valida que no exista el codigo.
        if (this.products.find(productos => productos.code === code)){
            console.log('El código de producto ingresado ya existe')
            return
        }

        // Validacion de stock mayor o igual a 0.
        if (stock < 0) {
            console.log('Debe ingresar un stock del producto mayor ó igual a 0')
            return
        }

        // Si paso las validaciones se agrega al array.
        const newId = this.products.length + 1
        const newProduct = {
            id: newId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        this.products.push(newProduct)
    }
    // FIN METODO PARA AGREGAR PRODUCTO.


    // INICIO METODO PARA DEVOLVER PRODUCTOS.
    getProducts() {
        return this.products
    }
    // FIN METODO PARA DEVOLVER PRODUCTOS.


    // INICIO METODO PARA DEVOLVER PRODUCTO POR ID ó CODE.
    getProductByIdCode(idCode,idTrueFalse){
        let productFind
        let message
        
        // Es ID?
        if (idTrueFalse) {
            productFind = this.products.find(productos => productos.id === idCode)
            message = 'ID'    
        } else {
            // Es CODE.
            productFind = this.products.find(productos => productos.code === idCode)
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
}



// Ejecucion de clase ProductManager.
const productAdmin = new productManager()

///////////////////
// TESTING CODER //
///////////////////
// 1)
let products = productAdmin.getProducts()
console.log(products)

// 2)
productAdmin.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)

// 3)
products = productAdmin.getProducts()
console.log(products)

// 4)
productAdmin.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)

// 5) Recupero ID = 8
productAdmin.getProductByIdCode(8,true)


///////////////////////////////
// INICIO TESTING PARTICULAR //
///////////////////////////////
console.log('//////////////// TEST PARTICULAR ////////////////')

// Carga de titulo vacia.
productAdmin.addProduct('','Mesa Madera',100,'/url1','cod1',10)

// Carga de descripcion vacia.
productAdmin.addProduct('Producto 1','',100,'/url1','cod1',10)

// Precio <= 0.
productAdmin.addProduct('Producto 1','Mesa Madera',-100,'/url1','cod1',10)

// Carga de thumbnail vacia.
productAdmin.addProduct('Producto 1','Mesa Madera',100,'','cod1',10)

// Carga de code vacio.
productAdmin.addProduct('Producto 1','Mesa Madera',100,'/url1','',10)

// Carga de code duplicado.
productAdmin.addProduct('Producto 1','Mesa Madera',100,'/url1','abc123',10)

// Carga de stock < 0.
productAdmin.addProduct('Producto 1','Mesa Madera',100,'/url1','cod1',-1)


// Carga productos 2 y 3 correctamente.
productAdmin.addProduct('Producto 2','Mesa Madera',100,'/url2','cod2',10)
productAdmin.addProduct('Producto 3','Sillas de Caño',200,'/url3','cod3',20)

// Muestra productos cargados en array.
console.log(productAdmin.getProducts())

// Busca producto con ID 2.
productAdmin.getProductByIdCode(2,true)

// Busca producto con cod2.
productAdmin.getProductByIdCode('cod2',false)