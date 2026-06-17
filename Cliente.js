const BASE_URL = 'https://api-alcateia.azurewebsites.net/api';
const ENDPOINT = 'Cliente';

let clienteSelecionadoId = null;

async function obterTodosClientes() {

    const tbody =
        document.getElementById(
            'tabela-clientes-body'
        );

    if (!tbody) return;

    try {

        const response =
            await fetch(
                `${BASE_URL}/${ENDPOINT}`
            );

        if (!response.ok) {
            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }

        const clientes =
            await response.json();

        tbody.innerHTML = '';

        clientes.forEach(cliente => {

            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td>
                    <div class="client-cell">

                        <span>${cliente.nome}</span>

                        <button
                            type="button"
                            class="btn-detail-arrow"
                            title="Ver detalhes"

                            onclick="abrirDetalhes(
                                ${cliente.id},
                                '${cliente.nome}',
                                '${cliente.email}',
                                '${cliente.telefone}',
                                '${cliente.endereco}',
                                '${cliente.cidade}'
                            )"
                        >
                            &#10142;
                        </button>

                    </div>
                </td>

                <td>${cliente.email}</td>

                <td>${cliente.telefone}</td>

                <td style="text-align:center;">

                    <button
                        type="button"
                        class="btn-action delete"

                        onclick="
                            excluirCliente(
                                ${cliente.id}
                            )
                        "
                    >
                        Excluir
                    </button>

                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {

        console.error(error);

        alert(
            'Erro ao carregar clientes'
        );
    }
}



async function cadastrarCliente(event) {

    event.preventDefault();

    const payload = {

        nome:
            document.getElementById(
                'nome'
            ).value,

        email:
            document.getElementById(
                'email'
            ).value,

        telefone:
            document.getElementById(
                'telefone'
            ).value,

        endereco:
            document.getElementById(
                'endereco'
            ).value,

        cidade:
            document.getElementById(
                'cidade'
            ).value
    };

    try {

        const response =
            await fetch(
                `${BASE_URL}/${ENDPOINT}`,
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        if (!response.ok) {

            throw new Error(
                'Erro ao cadastrar cliente'
            );
        }

        alert(
            'Cliente cadastrado com sucesso!'
        );

        window.location.href =
            'clientes.html';

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
    cidade
) {

    clienteSelecionadoId = id;

    document.getElementById(
        'detalhe-nome'
    ).value = nome;

    document.getElementById(
        'detalhe-email'
    ).value = email;

    document.getElementById(
        'detalhe-telefone'
    ).value = telefone;

    document.getElementById(
        'detalhe-endereco'
    ).value = endereco;

    document.getElementById(
        'detalhe-cidade'
    ).value = cidade;

    const drawer =
        document.getElementById(
            'drawer-detalhes'
        );

    if (drawer) {
        drawer.classList.add('active');
    }
}



function fecharDetalhes() {

    const drawer =
        document.getElementById(
            'drawer-detalhes'
        );

    if (drawer) {
        drawer.classList.remove('active');
    }
}



async function salvarAlteracoes() {

    const payload = {

        id:
            clienteSelecionadoId,

        nome:
            document.getElementById(
                'detalhe-nome'
            ).value,

        email:
            document.getElementById(
                'detalhe-email'
            ).value,

        telefone:
            document.getElementById(
                'detalhe-telefone'
            ).value,

        endereco:
            document.getElementById(
                'detalhe-endereco'
            ).value,

        cidade:
            document.getElementById(
                'detalhe-cidade'
            ).value
    };

    try {

        const response =
            await fetch(
                `${BASE_URL}/${ENDPOINT}/${clienteSelecionadoId}`,
                {

                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        if (!response.ok) {

            throw new Error(
                'Erro ao atualizar cliente'
            );
        }

        alert(
            'Cliente atualizado com sucesso!'
        );

        fecharDetalhes();

        obterTodosClientes();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


async function excluirCliente(id) {

    const confirmar =
        confirm(
            'Deseja excluir este cliente?'
        );

    if (!confirmar) return;

    try {

        const response =
            await fetch(
                `${BASE_URL}/${ENDPOINT}/${id}`,
                {
                    method: 'DELETE'
                }
            );

        if (!response.ok) {

            throw new Error(
                'Erro ao excluir cliente'
            );
        }

        alert(
            'Cliente excluído com sucesso!'
        );

        obterTodosClientes();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


window.abrirDetalhes =
    abrirDetalhes;

window.fecharDetalhes =
    fecharDetalhes;

window.salvarAlteracoes =
    salvarAlteracoes;

window.excluirCliente =
    excluirCliente;



document.addEventListener(
    'DOMContentLoaded',
    () => {

        obterTodosClientes();

        const form =
            document.getElementById(
                'form-cadastro-cliente'
            );

        if (form) {

            form.addEventListener(
                'submit',
                cadastrarCliente
            );
        }
    }
);
