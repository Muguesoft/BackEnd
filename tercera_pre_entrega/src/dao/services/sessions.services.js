import passport from '../../config/passport.strategy.js'


export const login = () => {
    return passport.authenticate('local-login', {
    successRedirect: '/api/sessions/current',
    failureRedirect: '/login',
    failureFlash: true
})};

export const register = () => {
    return passport.authenticate('local-register', {
    successRedirect: '/api/sessions/current',
    failureRedirect: '/register',
    failureFlash: true
})};

//export const logout = 