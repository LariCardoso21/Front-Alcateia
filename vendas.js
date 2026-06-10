const API_URL = 'http://localhost:5191/api';

let clientes = [];
let produtos = [];
let carrinho = [];



// =========================
// CARREGAR CLIENTES
// =========================

async function carregarClientes() {

    const selectCliente =
        document.getElementById('cliente');

    if (!selectCliente) return;

    try {

        const response =
            await fetch(`${API_URL}/Clientes`);

        clientes = await response.json();

        selectCliente.innerHTML =
            '<option value="">Selecione um cliente...</option>';

        clientes.forEach((cliente, index) => {

            selectCliente.innerHTML += `
                <option value="${index + 1}">
                    ${cliente.nome || cliente.Nome}
                </option>
            `;
        });

    } catch (erro) {

        console.error(erro);

        alert('Erro ao carregar clientes');
    }
}



// =========================
// CARREGAR PRODUTOS
// =========================

async function carregarProdutos() {

    const selectProduto =
        document.getElementById('produto');

    if (!selectProduto) return;

    try {

        const response =
            await fetch(`${API_URL}/Produto`);

        produtos = await response.json();

        selectProduto.innerHTML =
            '<option value="">Selecione um produto...</option>';

        produtos.forEach(produto => {

            selectProduto.innerHTML += `
                <option value="${produto.id}">
                    ${produto.nome}
                    (R$ ${produto.valorProduto})
                </option>
            `;
        });

    } catch (erro) {

        console.error(erro);

        alert('Erro ao carregar produtos');
    }
}



// =========================
// INSERIR ITEM
// =========================

function inserirItem() {

    const produtoId =
        document.getElementById('produto').value;

    const quantidade =
        parseInt(
            document.getElementById('quantidade').value
        );

    if (!produtoId) {

        alert('Selecione um produto');

        return;
    }

    const produto =
        produtos.find(
            p => p.id == produtoId
        );

    if (!produto) {

        alert('Produto não encontrado');

        return;
    }

    carrinho.push({

        produtoId: produto.id,

        nome: produto.nome,

        preco:
            produto.valorProduto || 0,

        quantidade
    });

    atualizarResumo();
}



// =========================
// ATUALIZAR RESUMO
// =========================

function atualizarResumo() {

    const lista =
        document.querySelector('.cart-list');

    if (!lista) return;

    lista.innerHTML = '';

    let subtotal = 0;

    carrinho.forEach(item => {

        const totalItem =
            item.preco * item.quantidade;

        subtotal += totalItem;

        lista.innerHTML += `
            <li class="cart-item">

                <div>

                    <p class="item-name">
                        ${item.nome}
                    </p>

                    <small class="item-meta">
                        ${item.quantidade}x
                        R$ ${item.preco.toFixed(2)}
                    </small>

                </div>

                <span class="item-price">
                    R$ ${totalItem.toFixed(2)}
                </span>

            </li>
        `;
    });

    const desconto =
        parseFloat(
            document.getElementById('desconto').value
                .replace(',', '.')
        ) || 0;

    const total =
        subtotal - desconto;

    document.querySelector('.totals').innerHTML = `
        <div class="total">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>

        <div class="total">
            <span>Desconto:</span>

            <span class="discount-value">
                - R$ ${desconto.toFixed(2)}
            </span>
        </div>

        <hr class="hr">

        <div class="total final">

            <span>Total Geral:</span>

            <span>
                R$ ${total.toFixed(2)}
            </span>

        </div>
    `;
}



// =========================
// FINALIZAR VENDA
// =========================

async function finalizarVenda(event) {

    event.preventDefault();

    const clienteId =
        parseInt(
            document.getElementById('cliente').value
        );

    if (isNaN(clienteId)) {

        alert('Selecione um cliente');

        return;
    }

    if (carrinho.length === 0) {

        alert('Adicione produtos');

        return;
    }

    const payload = {

        id: 0,

        data:
            new Date().toISOString(),

        clienteId:
            clienteId,

        itens:
            carrinho.map(item => ({

                id: 0,

                produtoId:
                    item.produtoId,

                precoUnitario:
                    item.preco,

                quantidade:
                    item.quantidade,

                pedidoVendaId: 0
            }))
    };

    console.log(payload);

    try {

        const response =
            await fetch(
                `${API_URL}/PedidoVenda`,
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

            const erro =
                await response.text();

            console.log(erro);

            throw new Error(
                'Erro ao finalizar venda'
            );
        }

        alert('Venda realizada com sucesso!');

        window.location.href =
            'Vendas.html';

    } catch (erro) {

        console.error(erro);

        alert(erro.message);
    }
}



// =========================
// LISTAR VENDAS
// =========================

async function listarVendas() {

    const tbody =
        document.querySelector('tbody');

    if (!tbody) return;

    try {

        const response =
            await fetch(
                `${API_URL}/PedidoVenda`
            );

        const vendas =
            await response.json();

        tbody.innerHTML = '';

        for (const venda of vendas) {

            let nomeCliente =
                `Cliente ID ${venda.clienteId}`;

            if (
                clientes[venda.clienteId - 1]
            ) {

                nomeCliente =
                    clientes[venda.clienteId - 1].nome
                    ||
                    clientes[venda.clienteId - 1].Nome;
            }

            let total = 0;

            venda.itens.forEach(item => {

                total +=
                    item.precoUni *
                    item.quantidade;
            });

            const nomesProdutos =
                venda.itens.map(item => {

                    const produto =
                        produtos.find(
                            p =>
                                p.id ==
                                item.produtoId
                        );

                    return produto
                        ? produto.nome
                        : 'Produto';
                }).join(', ');

            tbody.innerHTML += `
                <tr>

                    <td>
                        #${venda.id}
                    </td>

                    <td>
                        ${nomeCliente}
                    </td>

                    <td>
                        ${nomesProdutos}
                    </td>

                    <td>
                        ${new Date(venda.data)
                            .toLocaleString()}
                    </td>

                    <td class="price-value">
                        R$ ${total.toFixed(2)}
                    </td>

                    <td>
                        Pix
                    </td>

                    <td>
                        <span class="status-badge paid">
                            Pago
                        </span>
                    </td>

                </tr>
            `;
        }

    } catch (erro) {

        console.error(erro);

        alert('Erro ao listar vendas');
    }
}



// =========================
// EVENTOS
// =========================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        await carregarClientes();

        await carregarProdutos();

        await listarVendas();

        const btnInserir =
            document.querySelector('.btn-add-item');

        if (btnInserir) {

            btnInserir.addEventListener(
                'click',
                inserirItem
            );
        }

        const desconto =
            document.getElementById('desconto');

        if (desconto) {

            desconto.addEventListener(
                'input',
                atualizarResumo
            );
        }

        const btnFinalizar =
            document.querySelector('.btn-finalize');

        if (btnFinalizar) {

            btnFinalizar.addEventListener(
                'click',
                finalizarVenda
            );
        }
    }
);