import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import pool from '../database/connection.js';

export async function registrar(req, res, next) {
    try {
        const { nome, email, senha } = req.body;

        const existente = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existente.rows.length > 0) {
            return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }

        //gera o hash de senha com fator de custo 10
        const hash = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
                RETURNING id, nome, email, criado_em
            `, [nome, email, senha]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, senha } = req.body;

        const resultado = await pool.query(
            'SELECT * from usuarios WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        const usuario = resultado.rows[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } //expira em 8 horas
        );

        res.json({ token });
    } catch (err) {
        next(err);
    }
}

export function perfil(req, res) {
    res.json(req.usuario);
}