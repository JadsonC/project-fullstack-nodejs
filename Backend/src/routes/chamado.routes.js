import express from 'express';
import { listar } from '../controllers/chamado.controller.js'


// O express.Router() cria um mini-roteador independente. 
// Ele será registrado no app.js em um prefixo 
// (/chamados), então router.get('/') corresponde a GET /chamados.

const router = express.Router();

router.get('/', listar);

export default router; 