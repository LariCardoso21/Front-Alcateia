
const BASE_URL = 'http://localhost:5191/api';
const ENDPOINT = 'Produto';

let produtoSelecionadoId = null;


async function obterTodosProdutos() {

    try {

        const response = await fetch(`${BASE_URL}/${ENDPOINT}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const produtos = await response.json();

        console.log(produtos);

        const tbody = document.querySelector('.data-table tbody');

        if (!tbody) return;

        tbody.innerHTML = '';

        produtos.forEach(produto => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
            
                <td>
                    <div class="product-cell">

                        <span>${produto.nome}</span>

                        <button
                            type="button"
                            class="btn-detail-arrow"
                            title="Ver detalhes"
                            onclick="abrirDetalhesProd(
                                ${produto.id},
                                '${produto.nome}',
                                '${produto.qtdEstoque}',
                                '${produto.valorProduto}',
                                '${produto.marca}',
                                '${produto.descricao}'
                            )"
                        >
                            &#10142;
                        </button>

                    </div>
                </td>

                <td>${produto.qtdEstoque}</td>

                <td style="text-align:center;">

                    <button
                        type="button"
                        class="btn-action edit"
                        onclick="abrirDetalhesProd(
                            ${produto.id},
                            '${produto.nome}',
                            '${produto.qtdEstoque}',
                            '${produto.valorProduto}',
                            '${produto.marca}',
                            '${produto.descricao}'
                        )"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-action delete"
                        onclick="excluirProduto(${produto.id})"
                    >
                        Excluir
                    </button>

                </td>
            `;

            tbody.appendChild(tr);

        });

    } catch (error) {

        console.error(error);
        alert('Erro ao carregar produtos');
    }
}




async function cadastrarProduto(event) {

    event.preventDefault();

    const payload = {

        nome: document.getElementById('nome').value,

        descricao: document.getElementById('descricao').value,

        marca: document.getElementById('marca').value,

        qtdEstoque: parseInt(
            document.getElementById('qtd-estoque').value
        ),

        qtdMinima: parseInt(
            document.getElementById('qtd-minima').value
        ),

        valorProduto: parseFloat(
            document.getElementById('valor').value
                .replace('R$', '')
                .replace(',', '.')
        )
    };

    try {

        const response = await fetch(`${BASE_URL}/${ENDPOINT}`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar produto');
        }

        alert('Produto cadastrado com sucesso!');

        window.location.href = 'produtos.html';

    } catch (error) {

        console.error(error);
        alert(error.message);
    }
}



async function salvarProduto() {

    const payload = {

        nome: document.getElementById('prod-nome').value,

        descricao: document.getElementById('prod-desc').value,

        marca: document.getElementById('prod-marca').value,

        qtdEstoque: parseInt(
            document.getElementById('prod-qtd').value
        ),

        qtdMinima: 0,

        valorProduto: parseFloat(
            document.getElementById('prod-preco').value
                .replace('R$', '')
                .replace(',', '.')
        )
    };

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT}/${produtoSelecionadoId}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar produto');
        }

        alert('Produto atualizado com sucesso!');

        fecharDetalhesProd();

        obterTodosProdutos();

    } catch (error) {

        console.error(error);
        alert(error.message);
    }
}



async function excluirProduto(id) {

    const confirmar = confirm(
        'Deseja excluir este produto?'
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
            throw new Error('Erro ao excluir produto');
        }

        alert('Produto excluído com sucesso!');

        obterTodosProdutos();

    } catch (error) {

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

    document.getElementById('prod-nome').value = nome;
    document.getElementById('prod-qtd').value = qtd;
    document.getElementById('prod-preco').value = valor;
    document.getElementById('prod-marca').value = marca;
    document.getElementById('prod-desc').value = descricao;

    document
        .getElementById('drawer-produto')
        .classList.add('active');
}


function fecharDetalhesProd() {

    document
        .getElementById('drawer-produto')
        .classList.remove('active');
}



window.abrirDetalhesProd = abrirDetalhesProd;
window.fecharDetalhesProd = fecharDetalhesProd;
window.salvarProduto = salvarProduto;
window.excluirProduto = excluirProduto;



document.addEventListener('DOMContentLoaded', () => {

    obterTodosProdutos();

    const form = document.querySelector('form');

    if (form) {

        form.addEventListener(
            'submit',
            cadastrarProduto
        );
    }
});

