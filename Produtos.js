const BASE_URL = 'http://localhost:5191/api';
const ENDPOINT = 'Produto';

let produtoSelecionadoId = null;

async function obterTodosProdutos() {

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}`
        );

        if (!response.ok) {
            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }

        const produtos = await response.json();

        const tbody =
            document.getElementById(
                'listaProdutos'
            );

        if (!tbody) return;

        tbody.innerHTML = '';

        produtos.forEach(produto => {

            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <tr>

                    <td>
                        <div class="product-cell">

                            <span>${produto.nome}</span>

                            <button
                                type="button"
                                class="btn-detail-arrow"

                                onclick="abrirDetalhesProd(
                                    ${produto.id},
                                    '${produto.nome}',
                                    '${produto.quantidadeEstoque}',
                                    '${produto.valor}',
                                    '${produto.marca}',
                                    '${produto.descricao}'
                                )"
                            >
                                &#10142;
                            </button>

                        </div>
                    </td>

                    <td>
                        ${produto.quantidadeEstoque}
                    </td>

                    <td style="text-align:center">

                        <button
                            class="btn-action edit"

                            onclick="abrirDetalhesProd(
                                ${produto.id},
                                '${produto.nome}',
                                '${produto.quantidadeEstoque}',
                                '${produto.valor}',
                                '${produto.marca}',
                                '${produto.descricao}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-action delete"

                            onclick="excluirProduto(
                                ${produto.id}
                            )"
                        >
                            Excluir
                        </button>

                    </td>

                </tr>
            `;

            tbody.appendChild(tr);

        });

    } catch(error) {

        console.error(error);

        alert(
            'Erro ao carregar produtos'
        );
    }
}
async function cadastrarProduto(event) {

    event.preventDefault();

    const payload = {

        nome:
            document.getElementById(
                'nome'
            ).value,

        quantidadeEstoque:
            parseInt(
                document.getElementById(
                    'qtd-estoque'
                ).value
            ),

        quantidadeMinima:
            parseInt(
                document.getElementById(
                    'qtd-minima'
                ).value
            ),

        marca:
            document.getElementById(
                'marca'
            ).value,

        valor:
            parseFloat(
                document.getElementById(
                    'valor'
                ).value
                .replace('R$', '')
                .replace('.', '')
                .replace(',', '.')
            ),

        descricao:
            document.getElementById(
                'descricao'
            ).value
    };

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}`,
            {

                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(
                'Erro ao cadastrar produto'
            );
        }

        alert(
            'Produto cadastrado com sucesso!'
        );

        window.location.href =
            'produtos.html';

    } catch(error) {

        console.error(error);

        alert(error.message);
    }
}
function abrirDetalhesProd(
    id,
    nome,
    qtd,
    valor,
    marca,
    descricao
) {

    produtoSelecionadoId = id;

    document.getElementById(
        'prod-nome'
    ).value = nome;

    document.getElementById(
        'prod-qtd'
    ).value = qtd;

    document.getElementById(
        'prod-preco'
    ).value = valor;

    document.getElementById(
        'prod-marca'
    ).value = marca;

    document.getElementById(
        'prod-desc'
    ).value = descricao;

    document
        .getElementById(
            'drawer-produto'
        )
        .classList.add('active');
}
function abrirDetalhesProd(
    id,
    nome,
    qtd,
    valor,
    marca,
    descricao
) {

    produtoSelecionadoId = id;

    document.getElementById(
        'prod-nome'
    ).value = nome;

    document.getElementById(
        'prod-qtd'
    ).value = qtd;

    document.getElementById(
        'prod-preco'
    ).value = valor;

    document.getElementById(
        'prod-marca'
    ).value = marca;

    document.getElementById(
        'prod-desc'
    ).value = descricao;

    document
        .getElementById(
            'drawer-produto'
        )
        .classList.add('active');
}
async function salvarProduto() {

    const payload = {

        id:
            produtoSelecionadoId,

        nome:
            document.getElementById(
                'prod-nome'
            ).value,

        quantidadeEstoque:
            parseInt(
                document.getElementById(
                    'prod-qtd'
                ).value
            ),

        valor:
            parseFloat(
                document.getElementById(
                    'prod-preco'
                ).value
            ),

        marca:
            document.getElementById(
                'prod-marca'
            ).value,

        descricao:
            document.getElementById(
                'prod-desc'
            ).value
    };

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}/${produtoSelecionadoId}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(payload)
            }
        );

        if (!response.ok) {

            throw new Error(
                'Erro ao atualizar produto'
            );
        }

        alert(
            'Produto atualizado com sucesso!'
        );

        fecharDetalhesProd();

        obterTodosProdutos();

    } catch(error) {

        console.error(error);

        alert(error.message);
    }
}
async function salvarProduto() {

    const payload = {

        id:
            produtoSelecionadoId,

        nome:
            document.getElementById(
                'prod-nome'
            ).value,

        quantidadeEstoque:
            parseInt(
                document.getElementById(
                    'prod-qtd'
                ).value
            ),

        valor:
            parseFloat(
                document.getElementById(
                    'prod-preco'
                ).value
            ),

        marca:
            document.getElementById(
                'prod-marca'
            ).value,

        descricao:
            document.getElementById(
                'prod-desc'
            ).value
    };

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}/${produtoSelecionadoId}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(payload)
            }
        );

        if (!response.ok) {

            throw new Error(
                'Erro ao atualizar produto'
            );
        }

        alert(
            'Produto atualizado com sucesso!'
        );

        fecharDetalhesProd();

        obterTodosProdutos();

    } catch(error) {

        console.error(error);

        alert(error.message);
    }
}

window.abrirDetalhesProd =
    abrirDetalhesProd;

window.fecharDetalhesProd =
    fecharDetalhesProd;

window.salvarProduto =
    salvarProduto;

window.excluirProduto =
    excluirProduto;

document.addEventListener(
    'DOMContentLoaded',
    () => {

        obterTodosProdutos();

        const form =
            document.getElementById(
                'form-cadastro-produto'
            );

        if (form) {

            form.addEventListener(
                'submit',
                cadastrarProduto
            );
        }
    }
);