// login.js
const API_URL = 'http://localhost:3000';

const form = document.getElementById('form-login');
const mensagemErro = document.getElementById('mensagem-erro');

form.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const dados = {
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
    };

    try {
        const resposta = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            mensagemErro.textContent = erro.erro;
            return;
        }

        const { token } = await resposta.json();

        // guarda o token no navegador para usar nas próximas requisições
        localStorage.setItem('token', token);

        window.location.href = 'index.html';
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        mensagemErro.textContent = 'Não foi possível conectar à API.';
    }
});