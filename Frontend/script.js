// async/await

const API_URL = 'http://localhost:3000'

// ==============================================
// CARREGAR CHAMADOS DA API
// ==============================================
async function carregarChamados() {
    const lista = document.getElementById('lista-chamados');
    lista.innerHTML = '<p class="text-muted">Carregando chamados...</p>';
    try {
        const resposta = await fetch(`${API_URL}/chamados`); //espera a resposta HTTP chegar
        const chamados = await resposta.json() //espera converter o corpo para objeto
        renderizarChamados(chamados) //só executa quando os dados já estão prontos
    } catch (erro) {
        console.error('Erro ao carregar chamados', erro)
    }
}

// ==============================================
// RENDERIZAR CHAMADOS NA TELA
// ==============================================
function renderizarChamados(chamados) {
    const lista = document.getElementById('lista-chamados');
    lista.innerHTML = '' // limpa antes de renderizar

    if (chamados.length == 0) {
        lista.innerHTML = '<p class="text-muted">Nenhum chamado ativo no momento.</p>'
        return;
    }

    chamados.forEach(chamado => {
        const corBadge = chamado.gravidade === 'alta' ? 'bg-danger' : 'bg-success';
        const textoPrioridade = chamado.gravidade === 'alta' ? 'Alta' : 'Baixa';
        const corId = chamado.gravidade === 'alta' ? 'bg-dark' : 'bg-secondary';

        const item = document.createElement('li');
        item.className = 'card shadow-sm mb-3';
        item.innerHTML = `
            <article class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge ${corId}">#${String(chamado.id).padStart(3, '0')}</span>
                    <strong>${chamado.assunto}</strong>
                </div>
                <div>
                    <span>Por: <strong>${chamado.nome}</strong> (${chamado.email})</span>
                    <span>Sistema: <strong>${chamado.sistema}</strong></span>
                    <span>Prioridade: <span class="badge ${corBadge}">${textoPrioridade}</span></span>
                </div>
                <p class="mb-0">${chamado.descricao}</p>
                <div class="mt-3">
                    <button onclick="fecharChamado(${chamado.id})" class="btn btn-sm btn-outline-danger acao-protegida">
                        Fechar Chamado
                    </button>
                </div>
            </article>
        `;

        lista.appendChild(item)
    })
    atualizarInterfaceLogin();
}

async function fecharChamado(id) {
    try {
        const resposta = await fetch(`${API_URL}/chamados/${id}`, {
            method: 'DELETE',
            headers: {
                'Autorization': `Bearer ${token}`
            }
        });

        if (resposta.status == 401) {
            alert('Sua sessão expirou. Faça login novamente');
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        if (resposta.status == 403) {
            alert('Você não tem permissão para fechar este chamado.');
            return;
        }

        if (!resposta.ok) {
            alert('Erro ao fechar chamado.');
            return;
        }

        await carregarChamados()
    } catch (erro) {
        console.error('Erro ao fechar chamado', erro);
        alert('Não foi possível conectar à API')
    }
}

// ==============================================
// ENVIAR NOVO CHAMADO
// ==============================================
const form = document.getElementById("form-chamado")

form.addEventListener('submit', async function (evento) {
    evento.preventDefault(); //impede o comportamento padrão do form (recarregar a página)

    // --VALIDAÇÃO -------------------------------------------
    const camposObrigatorios = [
        { id: 'nome', erroId: 'erro-nome' },
        { id: 'email', erroId: 'erro-email' },
        { id: 'assunto', erroId: 'erro-assunto' }
    ]

    let valido = true;

    camposObrigatorios.forEach(({ id, erroId }) => {
        const campo = document.getElementById(id);
        const erro = document.getElementById(erroId);

        if (!campo.value.trim()) {
            erro.style.display = 'block';
            valido = false;
        }
        else {
            erro.style.display = 'none';
        }
    })

    if (!valido) return;

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

function atualizarInterfaceLogin() {
    const token = localStorage.getItem('token');
    const estaLogado = !!token;

    document.querySelectorAll('.acao-protegida').forEach(botao => {
        botao.style.display = estaLogado ? 'inline-block' : 'none';
    });

    document.getElementById('link-login').style.display = estaLogado ? 'none' : 'inline-block';
    document.getElementById('link-logout').style.display = estaLogado ? 'inline-block' : 'none';
}

document.getElementById('link-logout').addEventListener('click', function (evento) {
    evento.preventDefault();
    localStorage.removeItem('token');
    atualizarInterfaceLogin();
})

atualizarInterfaceLogin();
carregarChamados();