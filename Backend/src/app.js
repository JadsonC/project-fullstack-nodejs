import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import chamadoRoutes from './routes/chamado.routes.js'
import categoriaRoutes from './routes/categoria.routes.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())
app.use(cors()) //libera o acesso ao frontend
app.use(morgan('dev')); //registra os logs

app.use('/auth', authRoutes);
app.use('/chamados', chamadoRoutes);
app.use('/categorias', categoriaRoutes);

app.use((req, res) => {
    res.status(404).json({
        erro : 'Rota não encontrada'
    })
})

app.use(errorHandler); //sempre por último

export default app;