import * as ChamadoModel from '../models/chamado.model.js'

export async function listar(req, res, next) {
    try {
        const { status, gravidade } = req.query;
        const chamados = await ChamadoModel.listarTodos({ status, gravidade })
        res.json(chamados);
    } catch (err) {
        next(err);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const chamado = await ChamadoModel.buscarPorId(req.params.id);

        if (!chamado) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            return next(err);
        }

        res.json(chamado);
    } catch (err) {
        next(err);
    }
}

export async function criar(req, res, next) {
    try {
        const novoChamado = await ChamadoModel.criar(req.body)
        res.status(201).json(novoChamado);
    } catch (err) {
        next(err);
    }
}

export async function atualizar(req, res, next) {
    try {
        const chamado = await ChamadoModel.atualizar(req.params.id, req.body)

        if (!chamado) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            return next(err);
        }

        res.json(chamado);
    } catch (err) {
        next(err);
    }

}

export async function deletar(req, res, next) {
    try {
        const chamado = await ChamadoModel.deletar(req.params.id);

        if (!chamado) {
            const err = new Error('Chamado não encontrado');
            err.status = 404;
            return next(err);
        }

        res.status(204).send(chamado);
    } catch (err) {
        next(err);
    }
}

export async function buscar(req, res, next) {
    try {
        const chamado = await ChamadoModel.buscarPorTermo(req.query.termo);
        res.json(chamado);
    } catch (err) {
        next(err);
    }
}

export async function contarPorStatus(req, res, next) {
    try {
        const contagem = await ChamadoModel.contarPorStatus();
        res.json(contagem);
    } catch (err) {
        next(err);
    }
}