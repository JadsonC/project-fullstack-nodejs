export function validarChamado(req, res, next) {
    const { nome, email, assunto } = req.body;

    if(!nome || !email || !assunto) {
        const err = new Error('nome, email e assunto são obrigatórios');
        err.status = 400;
        return next(err);
    }

    next();
}