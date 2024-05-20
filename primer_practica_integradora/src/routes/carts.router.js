import { Router } from "express";
import cartManager from "../dao/CartManager.js";

const cartsRouter = Router();

// INSTANCIACION DE CLASE CARTMANAGER.
const cManager = new cartManager()


// POST NEW CART.
cartsRouter.post('/carts', async (req, res) => {
    try {
        const cart = req.body; // Se espera que el cuerpo de la solicitud contenga los datos del nuevo carrito
        
        const resp = await cManager.newCart(cart);

        if (resp === 'ok') {
            res.json({ message: 'Carrito creado correctamente' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creando carrito...' });
    }
});

// GET ONE CART.
cartsRouter.get('/carts/:cid', async (req,res) => {
    try {
        const id = req.params.cid
        const cart = await cManager.getCartById(id)
        if (cart === 'error') {
            res.json({error:`No se encuentra el Carrito con ID ${id}...`})
        } else {
            // Muestra el Carrito encontrado.
            res.json(cart)
        }
    }
    catch(error){
        res.status(500).json({error: "Error buscando Carrito..."})
    }
})


// GET ALL CARTS.
cartsRouter.get('/carts', async (req,res) => {
    try {
        
        const carts = await cManager.getCarts()
        if (carts === 'error') {
            res.json({error:'Error recuperando carritos...'})
        } else {
            // Muestra el Carrito encontrado.
            res.json(carts)
        }
    }
    catch(error){
        res.status(500).json({error: "Error buscando Carrito..."})
    }
})


// DELETE ONE CART.
cartsRouter.delete('/carts/:cid', async (req,res) => {
    try {
        const id = req.params.cid
        const resp = await cManager.deleteCartById(id)
        if (resp === "ok") {
            res.json({message:`Carrito ID ${id} borrado correctamente`})
        } else {
            // Muestra error.
            res.json({error:resp})
        }
    }
    catch(error){
        res.status(500).json({error: "Error borrando carrito..."})
    }
})

// POST UPDATE CART.
cartsRouter.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        
        const resp = await cManager.updateCart(cid,pid);

        if (resp === 'ok') {
            res.json({ message: 'Carrito actualizado correctamente' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando carrito...' });
    }
});


export default cartsRouter;