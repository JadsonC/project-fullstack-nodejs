import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors()) //libera o acesso ao frontend

//Dados em memória
const chamados = [
    {
        id: 1,
        nome: 'Anna Costa',
        email: 'anna@empresa.com',
        sistema: 'Windows',
        gravidade: 'alta',
        assunto: 'Impressora do faturamento não liga',
        descricao: 'A impressora térmica parou de responder após atualização.',
    },
    {
        id: 2,
        nome: 'Carlos Souza',
        email: 'carlos@empresa.com',
        sistema: 'Sistema Interno',
        gravidade: 'baixa',
        assunto: 'Dúvida no acesso ao relatório de metas',
        descricao: 'Qual o prazo de atualização dos gráficos do dashboard?',
    },
];

let proximoId = 3

app.get('/chamados', (req, res) => {
    res.json(chamados)
})

app.post('/chamados', (req, res) => {
    const { nome, email, sistema, gravidade, assunto, descricao } = req.body;

    console.log(req.body)

    if (!nome || !email || !assunto) {
        return res.status(400).json({ erro: 'nome, email e assunto são obrigatórios!' })
    }

    const novoChamado = {
        id: proximoId++,
        nome,
        email,
        sistema: sistema || 'Não informado',
        gravidade: gravidade || 'Baixa',
        assunto,
        descricao: descricao || '',
    };

    chamados.push(novoChamado);
    res.status(201).json(novoChamado);
})

app.delete('/chamados/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = chamados.findIndex(c => c.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: 'Chamado não econtrado' })
    }

    chamados.splice(indice, 1);
    res.status(200).json({ mensagem: 'Chamado fechado com sucesso' })
})

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada!' })
})

app.listen(3000, () => {
    console.log("API HelpDesk rodando em http://localhost:3000");
})