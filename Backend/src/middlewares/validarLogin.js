export function validarLogin(req, res, next) {
    const { email, senha} = req.body;

    if(!email || !senha) {
        const err = new Error('email e senha são obrigatórios');
        err.status = 400;
        return next(err);
    }

    next();
}