// async/await

const API_URL = 'http://localhost:3000'

// ==============================================
// CARREGAR CHAMADOS DA API
// ==============================================
async function carregarChamados() {
    try {
        const resposta = await fetch(`${API_URL}/chamados`); //espera a resposta HTTP chegar
        const chamados = await resposta.json() //espera converter o corpo para objeto
        renderizarChamados(chamados) //só executa quando os dados já estão prontos
    } catch (erro) {
        console.error('Erro ao carregar chamados', erro)
    }
}


// ==============================================
// ENVIAR NOVO CHAMADO
// ==============================================
const form = document.getElementById("form-chamado")

form.addEventListener('submit', async function (evento) {
    evento.preventDefault(); //impede o comportamento padrão do form (recarregar a página)

    //Lê os valores do formulário
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        sistema: document.getElementById('sistema').value,
        gravidade: document.getElementById('gravidade').value,
        assunto: document.getElementById('assunto').value,
        descricao: document.getElementById('descricao').value,
    }

    try {
        const resposta = await fetch(`${API_URL}/chamados`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // avisa a API que estamos enviando JSON
            },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            alert(`Erro: ${erro.erro}`);
            return;
        }

        form.reset(); //limpa o formulário
        await carregarChamados(); //atualiza a lista com novo chamado

        alert('Chamado aberto com sucesso!')
    } catch (erro) {
        console.error('Erro ao enviar chamado: ', erro);
        alert('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    }

})

carregarChamados();