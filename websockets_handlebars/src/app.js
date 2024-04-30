import express from 'express';
import xphandlebars  from 'express-handlebars';
import __dirname from './utils.js'
import { Server } from 'socket.io'
import productManager from './managers/ProductManager.js';
import Swal from 'sweetalert2';

import productsRouter from './routes/products.router.js'


// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Configuración de Handlebars
app.engine('handlebars', xphandlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/css'))

app.use("/api",productsRouter)
//app.use("/api",cartsRouter)

// Escucha en Puerto.
const httpServer = app.listen(port, console.log(`Server running on port ${port}`))

const socketServer = new Server(httpServer)

// Crear una instancia de ProductManager con la ruta del archivo JSON
const productClass = new productManager('./products.json');


socketServer.on('connection', async socket => {
    console.log("Nuevo cliente conectado")

    try {
        const products = await productClass.getProducts();
        // Emitir los productos actuales al cliente conectado
        socket.emit('initialProducts', products);

    } catch (error) {
        // Emite el error en el cliente.
        socket.emit('information', {mensaje: error.message,tipo: 'E'});
    }

    // Manejar evento de agregar producto
    socket.on('addProduct', async (product) => {
        
        try {
            const resp = await productClass.addProduct(product);
            
            if (resp !== 'ok') {
                throw new Error(resp)
            }
            
            socket.emit('newProduct', product);
            socket.emit('information', {mensaje:'Producto agregado correctamente',tipo: 'I'})
    
        } catch (error) {
            // Emite el error en el cliente.
            socket.emit('information', {mensaje: error.message,tipo: 'E'})
        }
        
    });

    // Manejar evento de eliminar producto
    socket.on('deleteProduct', async (productId) => {
        
        try {
            const pId = parseInt(productId)
            const resp = await productClass.deleteProductById(pId);
            
            if (resp !== 'ok') {
                throw new Error(resp)
            }
            
            socket.emit('deleteProduct', productId);
            socket.emit('information', {mensaje:'Producto borrado correctamente',tipo: 'I'})

        } catch (error) {
            // Emite el error en el cliente.
            socket.emit('information', {mensaje: error.message,tipo: 'E'})
        }
    });

});