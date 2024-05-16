import express from 'express';
import productsRouter from './routes/products.router.js';
import messagesRouter from './routes/messages.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


const result = dotenv.config()
if (!result) {
    console.error({error: "error DotEnv"}) }

//console.log(process.env.mongo_URI)

// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",productsRouter)
app.use("/api",messagesRouter)

const mongo_URI = process.env.mongo_URI
mongoose.connect(mongo_URI)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))


// Escucha en Puerto.
app.listen(port, ()=> {
    console.log('Express running en port 8080');
})