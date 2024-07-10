import { Router } from 'express';
//import passport from '../../config/passport.strategy.js'
//import { createHash } from '../../utils/utils.js';
//import User from '../../dao/models/user.model.js';
import { loginUser, registerUser} from '../../controllers/sessions.controllers.js';


const sessionRouter = Router();

/*
sessionRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = new userModel({ first_name, last_name, email, age, password });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario xxxx');
    }
});

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await userModel.findOne({ email });
        console.log(user)
        if (!user) return res.status(404).send('Usuario no encontrado');

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
        } else {
            user.role = 'user';
        }

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        };
        console.log(req.session.user)
        //res.redirect('/profile');
        res.redirect('/views/products');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

sessionRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});*/

/*
sessionRouter.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})

sessionRouter.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user=req.user
    res.redirect("/")
})*/
/*
sessionRouter.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

sessionRouter.post('/register', passport.authenticate('local-register', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

sessionRouter.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})

sessionRouter.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    // Extraer los datos del usuario de req.user
    console.log('USUARIO',req.user);
    
    const { first_name, last_name, email } = req.user;
    //const { value: email } = emails[0];
    
    // Crear un objeto con los datos del usuario
    const user = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: 20
    };

    // Asignar el objeto de usuario a req.session.user
    req.session.user = user;

    // Redirigir al usuario a la página de inicio
    //res.redirect("/");
    res.redirect("/views/products")
});

sessionRouter.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});*/

/*
sessionRouter.post('/login', passport.authenticate('local-login', {
    successRedirect: '/api/sessions/current',
    failureRedirect: '/login',
    failureFlash: true
}));
*/

sessionRouter.post('/login',loginUser)

/*sessionRouter.post('/register', passport.authenticate('local-register', {
    successRedirect: '/api/sessions/current',
    failureRedirect: '/register',
    failureFlash: true
}));

sessionRouter.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(403).json({ message: 'Usuario no autenticado.' });
    }
});*/

/*sessionRouter.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});*/

//sessionRouter.post('/logout',logOut)


export default sessionRouter;