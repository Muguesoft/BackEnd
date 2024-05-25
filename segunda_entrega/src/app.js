import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'


const result = dotenv.config()
if (!result) {
    console.error({error: "error DotEnv"}) }

// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/api",productsRouter)
app.use("/api",cartsRouter)
app.use('/views', viewsRouter);

const mongo_URI = process.env.mongo_URI
mongoose.connect(mongo_URI)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))


// Escucha en Puerto.
app.listen(port, ()=> {
    console.log('Express running en port 8080');
})