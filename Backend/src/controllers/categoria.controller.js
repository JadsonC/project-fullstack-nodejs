import * as CategoriaModel from '../models/categoria.model.js'

export async function listar(req, res, next) {
    try {
        const categorias = await CategoriaModel.listarTodas();
        res.json(categorias);
    } catch (err) {
        next(err);
    }
}