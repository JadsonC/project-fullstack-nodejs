import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as UsuarioModel from '../models/usuario.model.js'

export async function registrar(req, res, next) {
    try {
        const { nome, email, senha } = req.body;

        const existente = await UsuarioModel.buscarPorEmail(email);

        if (existente) {
            return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }

        //gera o hash de senha com fator de custo 10
        const hash = await bcrypt.hash(senha, 10);

        const usuario = await UsuarioModel.criar({ nome, email, hash})
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, senha } = req.body;

        const usuario = await UsuarioModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

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