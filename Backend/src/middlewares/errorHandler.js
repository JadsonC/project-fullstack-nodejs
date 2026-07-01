export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    console.error(`[ERRO ${status}]`, message);

    res.status(status).json({
        erro: message
    })
}