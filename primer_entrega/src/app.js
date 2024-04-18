const express = require('express')

const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')


// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",productsRouter)
app.use("/api",cartsRouter)

// Escucha en Puerto.
app.listen(port, ()=> {
    console.log('Express running en port 8080');
})