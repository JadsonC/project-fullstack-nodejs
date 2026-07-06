import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' })
    }

    // "Bearer <token>"
    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = payload;
        next();
    } catch (err) {
        res.status(401).json({ erro: 'Token inválido ou expirado' })
    }
}