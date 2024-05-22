import express from 'express';
import productsRouter from './routes/products.router.js';
import messagesRouter from './routes/messages.router.js';
import messageManagerDB from './dao/MessageManagerDB.js';
import cartsRouter from './routes/carts.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'


const result = dotenv.config()
if (!result) {
    console.error({error: "error DotEnv"}) }

// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// Escucha en Puerto.
const httpServer = app.listen(port, console.log(`Socket Server running on port ${port}`))
const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/', viewsRouter)

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",productsRouter)
app.use("/api",messagesRouter)
app.use("/api",cartsRouter)

const mongo_URI = process.env.mongo_URI
mongoose.connect(mongo_URI)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))


// Escucha en Puerto.
/*app.listen(port, ()=> {
    console.log('Express running en port 8080');
})*/

// Crear una instancia de MessageManager.
const messageClass = new messageManagerDB();

socketServer.on('connection', async socket => {
    console.log("Nuevo cliente conectado")

    try {
        const messages = await messageClass.getMessages();
        // Emitir los mensajes actuales al cliente conectado
        socket.emit('initialMessages', messages);

    } catch (error) {
        // Emite el error en el cliente.
        socket.emit('information', {mensaje: error.message,tipo: 'E'});
    }

    
    // Manejar evento de agregar mensaje
    socket.on('addMessage', async (message) => {
        
        try {
                        
            const resp = await messageClass.addMessage(message);
            
            if (resp.error) {
                throw new Error(resp.message)
            }
            
            socket.emit('newMessage', resp);
            //socket.emit('information', {mensaje:'Mensaje agregado correctamente',tipo: 'I'})
    
        } catch (error) {
            // Emite el error en el cliente.
            socket.emit('information', {mensaje: error.message,tipo: 'E'})
        }
    })
})