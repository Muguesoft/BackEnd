import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { isValidPassword } from '../utils/utils.js';
import User from '../dao/models/user.model.js';

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado.' });
        }

        if (!isValidPassword(user, password)) {
            return done(null, false, { message: 'Contraseña incorrecta.' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { first_name, last_name, age } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return done(null, false, { message: 'El correo electrónico ya está registrado.' });
        }

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });

        await newUser.save();

        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;