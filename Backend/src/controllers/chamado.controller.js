import pool from "../database/connection.js";

export async function listar(req, res, next) {
    try {

        const { status, gravidade } = req.query;

        let query =
            `SELECT chamados.*, categorias.nome AS categoria
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
        res.json(resultado.rows);
    } catch (err) {
        next(err);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT chamados.*, categorias.nome AS categoria
            FROM chamados
            LEFT JOIN categorias ON chamados.categoria_id = categorias.id
            WHERE chamados.id = $1
            `,
            [id]
        );

        if (resultado.rowCount === 0) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            return next(err);
        }

        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function criar(req, res, next) {
    try {
        const { nome, email, categoria_id, gravidade, assunto, descricao } = req.body;

        const resultado = await pool.query(
            `INSERT INTO chamados (nome, email, categoria_id, gravidade, assunto, descricao)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING * 
            `, [nome, email, categoria_id || null, gravidade || 'baixa', assunto, descricao || '']
        );

        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function atualizar(req, res, next) {
    try {
        const { id } = req.params;
        const { nome, email, categoria_id, gravidade, assunto, descricao } = req.body;

        const resultado = await pool.query(
            `UPDATE chamados
            SET nome = $1, email = $2, categoria_id = $3, gravidade = $4, assunto = $5, descricao = $6
            WHERE id = $7
            RETURNING *
            `, [nome, email, categoria_id || null, gravidade, assunto, descricao, id]
        )

        if (resultado.rows.length === 0) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            return next(err);
        }

        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }

}

export async function deletar(req, res, next) {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `DELETE FROM chamados WHERE id = $1 RETURNING *`,
            [id]
        );

        if (resultado.rowCount === 0) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            return next(err);
        }

        res.status(204).send(resultado.rows);
    } catch (err) {
        next(err);
    }
}

export async function buscar(req, res, next) {
    try {
        const { termo } = req.query;

        const resultado = await pool.query(
            `SELECT * FROM chamados
            WHERE assunto ILIKE $1
            OR descricao ILIKE $1
            OR nome ILIKE $1
            ORDER BY criado_em DESC
            `, [`%${termo}%`]
        )

        res.json(resultado.rows);
        
    } catch (err) {
        next(err);
    }

}