
const BASE_URL = 'http://localhost:5191/api';
const ENDPOINT = 'Pedidovenda';


let carrinho = [];


async function apiFetch(endpoint, method = 'GET', data = null) {

    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data !== null) {
        config.body = JSON.stringify(data);
    }

    try {

        const response = await fetch(
            `${BASE_URL}/${endpoint}`,
            config
        );

        if (!response.ok) {

            const erro = await response
                .json()
                .catch(() => ({}));

            throw new Error(
                erro.mensagem || `Erro HTTP: ${response.status}`
            );
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {

        console.error('Erro na API:', error);

        throw error;
    }
}

async function carregarTabelaVendas() {

    try {

        const vendas = await apiFetch(ENDPOINT, 'GET');

        const corpoTabela = document.querySelector('tbody');

        corpoTabela.innerHTML = '';

        vendas.forEach(venda => {

            const produtosTexto = venda.itens
                .map(item =>
                    `${item.quantidade}x ${item.nomeProduto}`
                )
                .join(', ');

            let statusClasse = '';

            if (venda.status === 'Pago') {
                statusClasse = 'paid';
            }
            else if (venda.status === 'Pendente') {
                statusClasse = 'pending';
            }
            else {
                statusClasse = 'canceled';
            }

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>#${venda.id}</td>
                <td>${venda.clienteNome}</td>
                <td>${produtosTexto}</td>
                <td>${venda.dataVenda}</td>
                <td class="price-value">
                    R$ ${venda.valorTotal.toFixed(2)}
                </td>
                <td>${venda.formaPagamento}</td>
                <td>
                    <span class="status-badge ${statusClasse}">
                        ${venda.status}
                    </span>
                </td>
            `;

            corpoTabela.appendChild(tr);
        });

    } catch (error) {

        alert(
            'Erro ao carregar vendas: ' + error.message
        );
    }
}

function adicionarItemCarrinho() {

    const produtoSelect =
        document.getElementById('produto');

    const quantidadeInput =
        document.getElementById('quantidade');

    const produtoId = produtoSelect.value;

    const produtoTexto =
        produtoSelect.options[
            produtoSelect.selectedIndex
        ].text;

    const quantidade =
        parseInt(quantidadeInput.value);

    if (!produtoId) {

        alert('Selecione um produto');

        return;
    }

    const nomeProduto =
        produtoTexto.split('(R$')[0].trim();

    const precoTexto = produtoTexto
        .split('(R$')[1]
        .replace(')', '')
        .replace('.', '')
        .replace(',', '.');

    const preco = parseFloat(precoTexto);

    const item = {
        produtoId: produtoId,
        nomeProduto: nomeProduto,
        quantidade: quantidade,
        precoUnitario: preco
    };

    carrinho.push(item);

    atualizarResumoPedido();
}

function atualizarResumoPedido() {

    const listaCarrinho =
        document.querySelector('.cart-list');

    listaCarrinho.innerHTML = '';

    let subtotal = 0;

    carrinho.forEach(item => {

        const totalItem =
            item.quantidade * item.precoUnitario;

        subtotal += totalItem;

        const li = document.createElement('li');

        li.classList.add('cart-item');

        li.innerHTML = `
            <div>
                <p class="item-name">
                    ${item.nomeProduto}
                </p>

                <small class="item-meta">
                    ${item.quantidade}x
                    R$ ${item.precoUnitario.toFixed(2)}
                </small>
            </div>

            <span class="item-price">
                R$ ${totalItem.toFixed(2)}
            </span>
        `;

        listaCarrinho.appendChild(li);
    });

    const descontoInput =
        document.getElementById('desconto');

    let desconto = parseFloat(
        descontoInput.value.replace(',', '.')
    );

    if (isNaN(desconto)) {
        desconto = 0;
    }

    const totalFinal = subtotal - desconto;

    const totais =
        document.querySelectorAll(
            '.total span:last-child'
        );

    totais[0].textContent =
        `R$ ${subtotal.toFixed(2)}`;

    totais[1].textContent =
        `- R$ ${desconto.toFixed(2)}`;

    totais[2].textContent =
        `R$ ${totalFinal.toFixed(2)}`;
}

async function finalizarVenda() {

    try {

        const clienteId =
            document.getElementById('cliente').value;

        const formaPagamento =
            document.getElementById(
                'forma-pagamento'
            ).value;

        const descontoTexto =
            document.getElementById(
                'desconto'
            ).value;

        let desconto = parseFloat(
            descontoTexto.replace(',', '.')
        );

        if (isNaN(desconto)) {
            desconto = 0;
        }

        if (!clienteId) {

            alert('Selecione um cliente');

            return;
        }

        if (carrinho.length === 0) {

            alert('Adicione produtos');

            return;
        }

        const payload = {
            data: data, 
            clienteId: parseInt(clienteId),
            itens: carrinho.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario
            }))
        };

        await apiFetch(
            ENDPOINT,
            'POST',
            payload
        );

        alert('Venda cadastrada com sucesso!');

        carrinho = [];

        atualizarResumoPedido();

        window.location.href = 'Vendas.html';

    } catch (error) {

        alert(
            'Erro ao finalizar venda: ' +
            error.message
        );
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        if (document.querySelector('table')) {
            carregarTabelaVendas();
        }

        const btnAdicionar =
            document.querySelector(
                '.btn-add-item'
            );

        if (btnAdicionar) {

            btnAdicionar.addEventListener(
                'click',
                adicionarItemCarrinho
            );
        }

        const descontoInput =
            document.getElementById(
                'desconto'
            );

        if (descontoInput) {

            descontoInput.addEventListener(
                'input',
                atualizarResumoPedido
            );
        }

        const btnFinalizar =
            document.querySelector(
                '.btn-finalize'
            );

        if (btnFinalizar) {

            btnFinalizar.addEventListener(
                'click',
                (e) => {

                    e.preventDefault();

                    finalizarVenda();
                }
            );
        }
    }
);

