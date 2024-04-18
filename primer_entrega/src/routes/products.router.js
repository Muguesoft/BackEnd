//import { Router} from "express";
const Router = require('express')

const productManager = require('../ProductManager.js')

const router = Router();

// INSTANCIACION DE CLASE PRODUCTMANAGER.
const manager = new productManager('./products.json')

// GET ALL PRODUCTS.
router.get('/products',async (req,res) => {
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

// GET ONE PRODUCT.
router.get('/products/:pid', async (req,res) => {
    try {
        const id = parseInt(req.params.pid)
        const product = await manager.getProductByIdCode(id,true)
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


// DELETE ONE PRODUCT.
router.delete('/products/:pid', async (req,res) => {
    try {
        const id = parseInt(req.params.pid)
        const resp = await manager.deleteProductById(id)
        if (resp === "ok") {
            res.json({message:`Producto ID ${id} borrado correctamente`})
        } else {
            // Muestra error.
            res.json({error:resp})
        }
    }
    catch(error){
        res.status(500).json({error: "Error borrando producto..."})
    }
    })

// PUT ONE PRODUCT.
router.put('/products/:pid', async (req, res) => {
    try{
        const id = parseInt(req.params.pid)

        const productModif = req.body

        // Modifica .
        const resp = await manager.updateProductById(id,productModif)
        if (resp === 'ok') {
            res.json({message:`Producto con ID ${productModif.id} modificado correctamente`});    
        } else {
            res.json({error:resp})
        }
    }
    catch(error){
        res.status(500).json({error: "Error actualizando producto..."})
    }
})

// POST NEW PRODUCT.
router.post('/products', async (req, res) => {
    try {
        const product = req.body; // Se espera que el cuerpo de la solicitud contenga los datos del nuevo producto

        const resp = await manager.addProduct(product);

        if (resp === 'ok') {
            res.json({ message: 'Producto agregado correctamente' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error agregando producto...' });
    }
});

module.exports = router;