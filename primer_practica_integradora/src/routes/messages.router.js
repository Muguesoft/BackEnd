import { Router } from "express";
import messageManager from "../dao/MessageManager.js";

const messagesRouter = Router();

// INSTANCIACION DE CLASE MESSAGEMANAGER.
const mManager = new messageManager()


// GET ALL MESSAGES.
messagesRouter.get('/messages',async (req,res) => {
    try{
        const messages = await mManager.getMessages()

        res.json(messages)
    }
    catch(error){
        res.status(500).json({error: "Error recuperando mensajes"})
    }
})

// POST NEW MESSAGE.
messagesRouter.post('/messages', async (req, res) => {
    try { 
        const message = req.body;

        const resp = await mManager.addMessage(message);

        if (resp === 'ok') {
            res.json({ message: 'Mensaje agregado correctamente' });
        } else {
            // Muestra error.
            res.json({ error: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error agregando mensaje...' });
    }
});


// DELETE MESSAGE BY ID.
messagesRouter.delete('/messages/:mid', async (req, res) => {
    const { mid } = req.params
    try{
        const resp = await mManager.deleteMessageById(mid);
        res.json({ message: resp });
    }
    catch(error){
        res.status(500).json({ error: 'Error borrando mensaje...' });
    }
})

export default messagesRouter;