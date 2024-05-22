import { Router } from "express";
import messageManagerDB from "../dao/MessageManagerDB.js";

const messagesRouter = Router();

// INSTANCIACION DE CLASE MESSAGEMANAGER.
const mManager = new messageManagerDB()


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

        if (resp.error) {
            throw new Error(resp.message)
        }
        
        res.json({ message: 'Mensaje agregado correctamente:', resp });

    } catch (error) {
        res.status(500).json({ error: 'Error agregando mensaje...', mensaje: error.message });
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

// Ruta para renderizar la vista chat.handlebars
messagesRouter.get('/chat', (req, res) => {
    res.render('chat');
});


export default messagesRouter;