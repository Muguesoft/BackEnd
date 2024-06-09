import { Router } from "express";
import productManagerDB from "../dao/ProductManagerDB.js";
import cartManagerDB from "../dao/CartManagerDB.js";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleAuth.js";

const viewsRouter = Router();
const pManager = new productManagerDB();
const cManager = new cartManagerDB;

viewsRouter.get('/views/products', async (req, res) => {
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
            availability, user: req.session.user
        });
        
    } catch (error) {
        res.status(500).json({ error: "Error retrieving products" });
    }
});

// Ruta para ver los productos en un carrito específico
viewsRouter.get('/views/carts/:cid', async (req, res) => {
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

viewsRouter.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.send('Esta es la página de administración. Solo accesible para administradores.');
});


viewsRouter.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

viewsRouter.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

viewsRouter.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

viewsRouter.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, redirige a la vista de perfil
        res.render('profile', { user: req.session.user });
    } else {
        // Si no está autenticado, redirige a la página de inicio de sesión
        res.redirect('/login');
    }
});

viewsRouter.post('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            // Manejar el error si lo hay
            return next(err);
        }
        // Redirigir al usuario a la página de inicio de sesión después de cerrar la sesión
        res.redirect('/login');
    });
});

export default viewsRouter;
