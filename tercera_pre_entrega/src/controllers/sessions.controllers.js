
import {login, register} from "../dao/services/sessions.services.js"

//const sessionServ = new sessionServices();

export const loginUser = () =>{
    return  login() };

export const registerUser = () => {
    return register()};

/*
export const logout = async 
sessionRouter.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(403).json({ message: 'Usuario no autenticado.' });
    }
});

sessionRouter.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});*/
