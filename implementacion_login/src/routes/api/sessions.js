import { Router } from 'express';
import userModel from '../../dao/models/user.model.js';

const sessionRouter = Router();

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
});

export default sessionRouter;