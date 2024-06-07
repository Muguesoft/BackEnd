import passport from "passport";
import GitHubStrategy from 'passport-github2'
import userService from '../dao/models/user.model.js'
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';
//import { createHash, isValidPassword } from "../utils/utils.js";


const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23lilelyfEQ2rRGiqb",
        clientSecret: "2683b3d31d0c5af93ec30b7fc73d4acab10c1bba",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 20,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userService.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            let user = await userService.findOne({ email })
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('local-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            let user = await userService.findOne({ email })
            if (user) {
                return done(null, false, { message: 'El correo electrónico ya está en uso' });
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            let newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                age: req.body.age,
                password: hashedPassword
            }
            let result = await userService.create(newUser)
            done(null, result);
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;