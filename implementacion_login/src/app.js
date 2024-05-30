import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import loginRouter from './routes/login.router.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import sessionRouter from './routes/api/sessions.js';

const result = dotenv.config()
if (!result) {
    console.error({error: "error DotEnv"}) }

// INICIALIZACION EXPRESS.
const app = express()
const port = 8080

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.engine('handlebars', handlebars.engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://cmouguelar:coderuser2024@cluster0.jodf6wd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' }),
    // cookie: { maxAge: 180 * 60 * 1000 },
}));

// Rutas.
app.use("/api",productsRouter)
app.use("/api",cartsRouter)
app.use('/views', viewsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', loginRouter)


const mongo_URI = process.env.mongo_URI
mongoose.connect(mongo_URI)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))


// Escucha en Puerto.
app.listen(port, ()=> {
    console.log('Express running en port 8080');
})