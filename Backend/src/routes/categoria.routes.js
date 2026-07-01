import express from 'express'
import { listar } from '../controllers/categoria.controller.js';

const router = express.Router();

router.get('/', listar);

export default router;