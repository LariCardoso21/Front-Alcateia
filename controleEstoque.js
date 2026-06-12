const BASE_URL = 'https://api-alcateia.azurewebsites.net/api';

let historico = [];

async function carregarControleEstoque() {

    try {

        const response = await fetch(
            `${BASE_URL}/Produto`
        );

        if (!response.ok) {
            throw new Error(
                'Erro ao carregar produtos'
            );
        }

        const produtos = await response.json();

        atualizarResumo(produtos);

        preencherTabela(produtos);

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

function atualizarResumo(produtos) {

    const totalItens = produtos.reduce(
        (total, produto) =>
            total + produto.qtdEstoque,
        0
    );

    const criticos = produtos.filter(
        produto =>
            produto.qtdEstoque <= produto.qtdMinima
    ).length;

    const esgotados = produtos.filter(
        produto =>
            produto.qtdEstoque <= 0
    ).length;

    document.querySelector(
        '.total .summary-value'
    ).textContent = totalItens;

    document.querySelector(
        '.critical .summary-value'
    ).textContent = criticos;

    document.querySelector(
        '.out .summary-value'
    ).textContent = esgotados;
}




function preencherTabela(produtos) {

    const tabela = document.querySelector(
        'table tbody'
    );

    if (!tabela) return;

    tabela.innerHTML = '';

    produtos.forEach(produto => {

        let status = '';
        let classeStatus = '';

        if (produto.qtdEstoque <= 0) {

            status = 'Esgotado';

            classeStatus = 'esgotado';

        } else if (
            produto.qtdEstoque <= produto.qtdMinima
        ) {

            status = 'Crítico';

            classeStatus = 'alert';

        } else {

            status = 'Normal';

            classeStatus = 'normal';
        }

        const tr = document.createElement('tr');

        tr.innerHTML = `

            <td>${produto.nome}</td>

            <td>${produto.qtdEstoque}</td>

            <td>${produto.qtdMinima}</td>

            <td>
                <span class="status-badge ${classeStatus}">
                    ${status}
                </span>
            </td>

            <td>

                <div class="stock-actions">

                    <button
                        class="btn-stock btn-add"
                        onclick="entradaEstoque(${produto.id})"
                    >
                        + Adicionar
                    </button>

                    <button
                        class="btn-stock btn-remove"
                        onclick="saidaEstoque(${produto.id})"
                    >
                        - Retirar
                    </button>

                </div>

            </td>
        `;

        tabela.appendChild(tr);

    });

    atualizarHistorico();
}




async function entradaEstoque(id) {

    const quantidade = prompt(
        'Quantidade para adicionar:'
    );

    if (!quantidade) return;

    try {

        const responseLista = await fetch(
            `${BASE_URL}/Produto`
        );

        if (!responseLista.ok) {
            throw new Error(
                'Erro ao buscar produtos'
            );
        }

        const produtos = await responseLista.json();

        const produto = produtos.find(
            p => p.id === id
        );

        if (!produto) {

            alert('Produto não encontrado');

            return;
        }

        const payload = {

            nome: produto.nome,

            descricao: produto.descricao,

            marca: produto.marca,

            qtdEstoque:
                produto.qtdEstoque + parseInt(quantidade),

            qtdMinima: produto.qtdMinima,

            valorProduto: produto.valorProduto
        };

        const response = await fetch(
            `${BASE_URL}/Produto/${id}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(
                'Erro ao adicionar estoque'
            );
        }

        historico.unshift({

            tipo: 'Entrada',

            texto: `+${quantidade} unidades adicionadas em ${produto.nome}`,

            data: new Date().toLocaleString()
        });

        carregarControleEstoque();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}




async function saidaEstoque(id) {

    const quantidade = prompt(
        'Quantidade para retirar:'
    );

    if (!quantidade) return;

    try {

        const responseLista = await fetch(
            `${BASE_URL}/Produto`
        );

        if (!responseLista.ok) {
            throw new Error(
                'Erro ao buscar produtos'
            );
        }

        const produtos = await responseLista.json();

        const produto = produtos.find(
            p => p.id === id
        );

        if (!produto) {

            alert('Produto não encontrado');

            return;
        }

        const novoEstoque =
            produto.qtdEstoque - parseInt(quantidade);

        if (novoEstoque < 0) {

            alert('Estoque insuficiente');

            return;
        }

        const payload = {

            nome: produto.nome,

            descricao: produto.descricao,

            marca: produto.marca,

            qtdEstoque: novoEstoque,

            qtdMinima: produto.qtdMinima,

            valorProduto: produto.valorProduto
        };

        const response = await fetch(
            `${BASE_URL}/Produto/${id}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(
                'Erro ao retirar estoque'
            );
        }

        historico.unshift({

            tipo: 'Saída',

            texto: `-${quantidade} unidades retiradas de ${produto.nome}`,

            data: new Date().toLocaleString()
        });

        carregarControleEstoque();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}




function atualizarHistorico() {

    const lista = document.querySelector(
        '.history-list'
    );

    if (!lista) return;

    lista.innerHTML = '';

    historico.slice(0, 5).forEach(item => {

        const li = document.createElement('li');

        li.className =
            item.tipo === 'Entrada'
                ? 'history-item input'
                : 'history-item output';

        li.innerHTML = `

            <span class="history-type">
                ${item.tipo}
            </span>

            <p>
                <strong>${item.texto}</strong>
            </p>

            <small>${item.data}</small>
        `;

        lista.appendChild(li);

    });
}




window.entradaEstoque = entradaEstoque;

window.saidaEstoque = saidaEstoque;




document.addEventListener(
    'DOMContentLoaded',
    carregarControleEstoque
);