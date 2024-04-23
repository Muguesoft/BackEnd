const Router = require('express')

const cartManager = require('../CartManager.js')

const router = Router();

// INSTANCIACION DE CLASE CARTMANAGER.
const manager = new cartManager('./carts.json','./products.json')

// POST NEW CART.
router.post('/carts', async (req, res) => {
    try {
        const cart = req.body; // Se espera que el cuerpo de la solicitud contenga los datos del nuevo carrito

        const resp = await manager.newCart(cart);

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
router.get('/carts/:cid', async (req,res) => {
    try {
        const id = parseInt(req.params.cid)
        const cart = await manager.getCartById(id)
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


// DELETE ONE CART.
router.delete('/carts/:cid', async (req,res) => {
    try {
        const id = parseInt(req.params.cid)
        const resp = await manager.deleteCartById(id)
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
router.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        
        const resp = await manager.updateCart(cid,pid);

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

module.exports = router;