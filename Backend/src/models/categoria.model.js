import pool from "../database/connection.js";

export async function listarTodas() {
    const resultado = await pool.query(
        'SELECT * FROM categorias ORDER BY nome'
    );
    return resultado.rows;
}