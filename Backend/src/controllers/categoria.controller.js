import pool from "../database/connection.js";

export async function listar(req, res, next) {
    try {
        const resultado = await pool.query(
            'SELECT * FROM categorias ORDER BY nome'
        );
        res.json(resultado.rows);
    } catch (err) {
        next(err);
    }
}