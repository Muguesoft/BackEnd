import { Router } from "express";
import cartManagerDB from "../dao/CartManagerDB.js";
const cartsRouter = Router();

// INSTANCIACION DE CLASE CARTMANAGER.
const cManager = new cartManagerDB()


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

/* NO USADO MAS, AHORA SE VACIA EL CARRITO
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
})*/

// POST UPDATE CART.
cartsRouter.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        
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

// DELETE PRODUCT FROM CART.
cartsRouter.delete('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const resp = await cManager.deleteProductFromCart(cid, pid);

        if (resp === 'ok') {
            res.json({ message: 'Producto eliminado correctamente del carrito' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando producto del carrito...' });
    }
});


// EMPTY CART.
cartsRouter.delete('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;

        const resp = await cManager.emptyCart(cid);

        if (resp === 'ok') {
            res.json({ message: 'Carrito vaciado correctamente' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error vaciando carrito...' });
    }
});

// UPDATE CART.
cartsRouter.put('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        const resp = await cManager.updateCart(cid, pid, quantity);

        if (resp === 'ok') {
            res.json({ message: 'Cantidad del producto actualizada correctamente en el carrito' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando la cantidad del producto en el carrito...' });
    }
});

// Para cumplir con PUT api/carts/:cid y en el body un array de productos y cantidades
cartsRouter.put('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;

        const response = await cManager.updateCartProducts(cid, products);

        if (response === 'ok') {
            res.json({ message: 'Carrito actualizado correctamente' });
        } else {
            res.status(400).json({ error: response });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando carrito' });
    }
});
export default cartsRouter;