import { Router } from "express";
import productManagerDB from "../dao/ProductManagerDB.js";
import cartManagerDB from "../dao/CartManagerDB.js";

const viewsRouter = Router();
const pManager = new productManagerDB();
const cManager = new cartManagerDB;

viewsRouter.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, query, category, availability } = req.query;
        
        const availabilityBoolean = availability === 'true' ? true : availability === 'false' ? false : undefined;

        const parameters = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
            sort: sort || null,
            query: query || '',
            category: category || '',
            availability: availabilityBoolean
        };

        const products = await pManager.getProducts(parameters);

        res.render('products', {
            products: products.payload,
            totalPages: products.totalPages,
            currentPage: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            limit: parameters.limit,
            query,
            sort,
            category,
            availability
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving products" });
    }
});

// Ruta para ver los productos en un carrito específico
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cManager.getCartById(cid);

        if (typeof cart === 'string') {
            return res.status(404).json({ error: cart });
        }

        // Convertir el documento Mongoose a objeto JSON
        const cartJSON = cart.toObject();

        res.render('cart', { cart: cartJSON });

        //res.render('cart', { cart });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving cart" });
    }
});
export default viewsRouter;
