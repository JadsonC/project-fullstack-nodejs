import pool from '../database/connection.js';

export async function buscarPorEmail(email) {
    const resultado = await pool.query(
        'SELECT * from usuarios WHERE email = $1',
        [email]
    );
    return resultado.rows[0];
}

export async function criar({ nome, email, hash }) {
    const resultado = await pool.query(
        `INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
                RETURNING id, nome, email, criado_em
            `, [nome, email, hash]
    );
    return resultado.rows[0];
}