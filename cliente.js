const BASE_URL = 'http://localhost:5191/api';
const ENDPOINT = 'Clientes';

let clienteSelecionadoId = null;



async function obterTodosClientes() {

    try {

        const response = await fetch(`${BASE_URL}/${ENDPOINT}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const clientes = await response.json();

        console.log(clientes);

        const tbody = document.querySelector('.table tbody');

        if (!tbody) return;

        tbody.innerHTML = '';

        clientes.forEach((cliente, index) => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
            
                <td>
                    <div class="client-cell">

                        <span>${cliente.nome}</span>

                        <button
                            type="button"
                            class="btn-detail-arrow"
                            title="Ver detalhes"
                            onclick="abrirDetalhes(
                                ${index},
                                '${cliente.nome || ''}',
                                '${cliente.email || ''}',
                                '${cliente.telefone || ''}',
                                '${cliente.rua || ''}',
                                '${cliente.cidade || ''}',
                                '${cliente.dataNascimento || ''}',
                                '${cliente.estado || ''}',
                                '${cliente.CPF || ''}',
                                '${cliente.bairro || ''}',
                                '${cliente.cep || ''}',
                                '${cliente.numero || ''}'
                            )"
                        >
                            &#10142;
                        </button>

                    </div>
                </td>

                <td>${cliente.email || ''}</td>

                <td>${cliente.telefone || ''}</td>

                <td style="text-align:center;">

                    <button
                        type="button"
                        class="btn-action delete"
                        onclick="excluirCliente(${index})"
                    >
                        Excluir
                    </button>

                </td>
            `;

            tbody.appendChild(tr);

        });

    } catch (error) {

        console.error(error);

        alert('Erro ao carregar clientes');
    }
}




async function cadastrarCliente(event) {

    event.preventDefault();

    const payload = {

        Nome: document.getElementById('nome').value,

        Email: document.getElementById('email').value,

        Telefone: document.getElementById('telefone').value,

        Rua: document.getElementById('endereco').value,

        Cidade: document.getElementById('cidade').value,

        Estado: '',

        Bairro: '',

        Cep: '',

        CPF: '',

        Numero: 0,

        DataNascimento: new Date().toISOString()
    };

    console.log(payload);

    try {

        const response = await fetch(`${BASE_URL}/${ENDPOINT}`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(payload)
        });

        if (!response.ok) {

            const erro = await response.text();

            console.log(erro);

            throw new Error('Erro ao cadastrar cliente');
        }

        alert('Cliente cadastrado com sucesso!');

        window.location.href = 'clientes.html';

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}




async function salvarAlteracoes() {

    const payload = {

        Nome: document.getElementById('detalhe-nome').value,

        Email: document.getElementById('detalhe-email').value,

        Telefone: document.getElementById('detalhe-telefone').value,

        Rua: document.getElementById('detalhe-endereco').value,

        Cidade: document.getElementById('detalhe-cidade').value,

        Estado: '',

        Bairro: '',

        Cep: '',

        CPF: '',

        Numero: 0,

        DataNascimento: new Date().toISOString()
    };

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}/${clienteSelecionadoId}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {

            const erro = await response.text();

            console.log(erro);

            throw new Error('Erro ao atualizar cliente');
        }

        alert('Cliente atualizado com sucesso!');

        fecharDetalhes();

        obterTodosClientes();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}




async function excluirCliente(id) {

    const confirmar = confirm(
        'Deseja excluir este cliente?'
    );

    if (!confirmar) return;

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}/${id}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao excluir cliente');
        }

        alert('Cliente excluído com sucesso!');

        obterTodosClientes();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}




function abrirDetalhes(
    id,
    nome,
    email,
    telefone,
    endereco,
    cidade,
    dataCadastro
) {

    clienteSelecionadoId = id;

    document.getElementById('detalhe-nome').value = nome;

    document.getElementById('detalhe-email').value = email;

    document.getElementById('detalhe-telefone').value = telefone;

    document.getElementById('detalhe-endereco').value = endereco;

    document.getElementById('detalhe-cidade').value = cidade;

    document.getElementById('detalhe-data').value = dataCadastro;

    document
        .getElementById('drawer-detalhes')
        .classList.add('active');
}




function fecharDetalhes() {

    document
        .getElementById('drawer-detalhes')
        .classList.remove('active');
}




window.abrirDetalhes = abrirDetalhes;

window.fecharDetalhes = fecharDetalhes;

window.salvarAlteracoes = salvarAlteracoes;

window.excluirCliente = excluirCliente;




document.addEventListener('DOMContentLoaded', () => {

    obterTodosClientes();

    const form = document.querySelector('.form');

    if (form) {

        form.addEventListener(
            'submit',
            cadastrarCliente
        );
    }
});