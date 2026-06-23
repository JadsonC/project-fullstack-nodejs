import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import chamadoRoutes from './routes/chamado.routes.js'

const app = express()

app.use(express.json())
app.use(cors()) //libera o acesso ao frontend
app.use(morgan('dev')); //registra os logs

app.use('/chamados', chamadoRoutes)

app.use((req, res) => {
    res.status(404).json({
        erro : 'Rota não encontrada'
    })
})

export default app;