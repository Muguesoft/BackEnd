import { Router } from "express";
import productManagerDB from "../dao/services/ProductManagerDB.js";

const productsRouter = Router();

// INSTANCIACION DE CLASE PRODUCTMANAGER.
const pManager = new productManagerDB()


// GET ALL PRODUCTS.
productsRouter.get('/products',async (req,res) => {
    try{
        
        const { limit, page, sort, query, category, availability } = req.query;

        // Convertir availability a boolean
        const availabilityBoolean = availability === 'true' ? true : availability === 'false' ? false : undefined;

        const parameters = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
            sort: sort || null,
            query: query || '',
            category: category || '',
            availability: availabilityBoolean
        }
        
        // Muestra productos.
        const products = await pManager.getProducts(parameters)

        res.json(products)
    }
    catch(error){
        res.status(500).json({error: "Error recuperando productos"})
    }
})

// GET ONE PRODUCT.
productsRouter.get('/products/:pid',async (req,res) => {
    try{
        const { pid } = req.params

        // Muestra producto.
        const product = await pManager.getProductByIdCode(pid,true)    

        res.json(product)
    }
    catch(error){
        res.status(500).json({error: "Error recuperando productos"})
    }
})

// POST NEW PRODUCT.
productsRouter.post('/products', async (req, res) => {
    try { 
        const product = req.body;

        if (!product.thumbnails) {
            product.thumbnails = []
        }

        const resp = await pManager.addProduct(product);

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


productsRouter.delete('/products/:pid', async (req, res) => {
    try{
        const { pid } = req.params

        const resp = await pManager.deleteProductById(pid);
        res.json({ message: resp });
    }
    catch(error){
        res.status(500).json({ error: 'Error borrando producto...' });
    }
})

productsRouter.put('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const productModif  = req.body
    
    try{
        const resp = await pManager.updateProductById(pid,productModif);
        res.json({ message: resp });
    }
    catch(error){
        res.status(500).json({ error: 'Error actualizando producto...' });
    }
})

export default productsRouter;