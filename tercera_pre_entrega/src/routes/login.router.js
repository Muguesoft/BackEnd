import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import userModel from "../dao/models/user.model.js";

const loginRouter = Router();

loginRouter.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

loginRouter.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

loginRouter.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

loginRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

loginRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = new userModel({ first_name, last_name, email, age, password });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario xxxx1');
    }
});

export default loginRouter;
