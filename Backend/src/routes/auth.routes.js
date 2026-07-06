import express from 'express';
import { login, perfil, registrar } from '../controllers/auth.controller.js';
import { validarLogin } from '../middlewares/validarLogin.js';
import { autenticar } from '../middlewares/autenticar.js';
const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', validarLogin, login);
router.get('/perfil', autenticar, perfil);

export default router;