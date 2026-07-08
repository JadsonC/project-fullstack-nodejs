import express from 'express';
import { atualizar, buscar, buscarPorId, contarPorStatus, criar, deletar, listar } from '../controllers/chamado.controller.js'
import { validarChamado } from '../middlewares/validarChamado.js';
import { autenticar } from '../middlewares/autenticar.js';


// O express.Router() cria um mini-roteador independente. 
// Ele será registrado no app.js em um prefixo 
// (/chamados), então router.get('/') corresponde a GET /chamados.

const router = express.Router();

router.get('/buscar', buscar);
router.get('/contagem', contarPorStatus);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', validarChamado, criar);


router.put('/:id', autenticar, validarChamado, atualizar);
router.delete('/:id', autenticar, deletar);

export default router; 