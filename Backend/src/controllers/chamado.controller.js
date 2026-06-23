import pool from "../database/connection.js";

export async function listar(req, res, next) {
    try {
        const resultado = await pool.query(
            `SELECT chamados.*, categorias.nome AS categoria
            FROM chamados
            LEFT JOIN categorias ON chamados.categoria_id = categorias.id
            ORDER BY chamados.criado_em DESC`
        );

        res.json(resultado.rows);
    } catch (err) {
        next(err);
    }
}