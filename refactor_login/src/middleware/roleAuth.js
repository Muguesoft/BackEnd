export const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Acceso denegado: Solo los administradores pueden acceder a esta ruta');
    }
};

export const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        res.status(403).send('Acceso denegado: Solo los usuarios pueden acceder a esta ruta');
    }
};
