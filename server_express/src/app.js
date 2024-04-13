const express = require('express')
const productManager = require('./ProductManager.js')


// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// INSTANCIACION DE CLASE PRODUCTMANAGER.
const manager = new productManager('./products.json')

// ENDPOINTS.
// GET.
app.get('/products',async (req,res)=> {
    try{
        const limit = parseInt(req.query.limit)

        let products

        if (limit) {
            // Muestra productos.
            products = await manager.getProducts(limit)    
        } else {
            products = await manager.getProducts()
        }

        res.json(products)
    }
    catch(error){
        res.status(500).json({error: "Error recuperando productos"})
    }
})


app.get('/products/:pid', async (req,res) => {
    try {
        let id = parseInt(req.params.pid)
        let product = await manager.getProductByIdCode(id,true)
        if (product === 'ID' || product === 'Código') {
            res.json({error:`No se encuentra el producto con ${product} ${id}...`})
        } else {
            // Muestra el Producto encontrado.
            res.json(product)
        }
    }
    catch(error){
        res.status(500).json({error: "Error buscando producto..."})
    }
})


// Escucha en Puerto.
app.listen(port, ()=> {
    console.log('Express running en port 8080');
})