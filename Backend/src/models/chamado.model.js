import pool from "../database/connection.js";

export async function listarTodos({ status, gravidade }) {
    let query = `SELECT chamados.*, categorias.nome AS categoria
            FROM chamados
            LEFT JOIN categorias ON chamados.categoria_id = categorias.id
            WHERE 1 = 1`;

    const valores = [];

    if (status) {
        valores.push(status);
        query += ` AND chamados.status = $${valores.length}`;
    }

    if (gravidade) {
        valores.push(gravidade);
        query += ` AND chamados.gravidade = $${valores.length}`;
    }

    query += ' ORDER BY chamados.criado_em DESC';

    const resultado = await pool.query(query, valores);
    return resultado.rows;
}

export async function buscarPorId(id) {
    const resultado = await pool.query(
        `SELECT chamados.*, categorias.nome AS categoria
            FROM chamados
            LEFT JOIN categorias ON chamados.categoria_id = categorias.id
            WHERE chamados.id = $1
            `,
        [id]
    );
    return resultado.rows[0]
}

export async function buscarPorTermo(termo) {
    const resultado = await pool.query(
        `SELECT * FROM chamados
            WHERE assunto ILIKE $1
            OR descricao ILIKE $1
            OR nome ILIKE $1
            ORDER BY criado_em DESC
            `, [`%${termo}%`]
    );
    return resultado.rows;
}

export async function contarPorStatus() {
    const resultado = await pool.query(
        `SELECT status, COUNT(*) AS total
            FROM chamados
            GROUP BY status
            `
    );
    return resultado.rows;
}

export async function criar({ nome, email, categoria_id, gravidade, assunto, descricao }) {
    const resultado = await pool.query(
        `INSERT INTO chamados (nome, email, categoria_id, gravidade, assunto, descricao)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING * 
            `, [nome, email, categoria_id || null, gravidade || 'baixa', assunto, descricao || '']
    );
    return resultado.rows[0];
}

export async function atualizar(id, { nome, email, categoria_id, gravidade, assunto, descricao }) {
    const resultado = await pool.query(
        `UPDATE chamados
            SET nome = $1, email = $2, categoria_id = $3, gravidade = $4, assunto = $5, descricao = $6
            WHERE id = $7
            RETURNING *
            `, [nome, email, categoria_id || null, gravidade, assunto, descricao, id]
    );
    return resultado.rows[0];
}

export async function deletar(id) {
    const resultado = await pool.query(
        `DELETE FROM chamados WHERE id = $1 RETURNING *`,
        [id]
    );
    return resultado.rows[0];
}