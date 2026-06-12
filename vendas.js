const BASE_URL = 'https://api-alcateia.azurewebsites.net/api/Vendas';

const ENDPOINT_VENDAS = 'PedidoVenda';
const ENDPOINT_CLIENTES = 'Clientes';
const ENDPOINT_PRODUTOS = 'Produto';

let clientes = [];
let produtos = [];
let carrinho = [];


// =======================
// CARREGAR CLIENTES
// =======================

async function carregarClientes() {

    const select = document.getElementById('cliente');

    if (!select) return;

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT_CLIENTES}`
        );

        if (!response.ok) {
            throw new Error('Erro ao carregar clientes');
        }

        clientes = await response.json();

        console.log("CLIENTES:", clientes);

        select.innerHTML =
            '<option value="">Escolha um cliente...</option>';

        clientes.forEach(cliente => {

            const option = document.createElement('option');

            // força pegar o id
            option.value = String(cliente.id);

            option.textContent = cliente.nome;

            select.appendChild(option);
        });

        // debug
        select.addEventListener('change', () => {
            console.log(
                'Cliente escolhido:',
                select.value
            );
        });

    } catch (error) {

        console.error(error);
        alert('Erro ao carregar clientes');
    }
}
// =======================
// CARREGAR PRODUTOS
// =======================

async function carregarProdutos() {

    const select = document.getElementById('produto');

    if (!select) return;

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT_PRODUTOS}`
        );

        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }

        produtos = await response.json();

        select.innerHTML =
            '<option value="">Selecione o produto...</option>';

        produtos.forEach(produto => {

            const option =
                document.createElement('option');

            option.value = produto.id;

            option.textContent =
                `${produto.nome} (R$ ${produto.valorProduto})`;

            select.appendChild(option);
        });

    } catch (error) {

        console.error(error);
        alert('Erro ao carregar produtos');
    }
}


// =======================
// ADICIONAR ITEM
// =======================

function adicionarItem() {

    const produtoId =
        parseInt(document.getElementById('produto').value);

    const quantidade =
        parseInt(document.getElementById('quantidade').value);

    if (!produtoId) {

        alert('Selecione um produto');
        return;
    }

    const produto = produtos.find(
        p => p.id === produtoId
    );

    if (!produto) return;

    carrinho.push({

        produtoId: produto.id,

        nome: produto.nome,

        preco: produto.valorProduto,

        quantidade: quantidade
    });

    atualizarResumo();
}


// =======================
// RESUMO DO PEDIDO
// =======================

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

        const li =
            document.createElement('li');

        li.classList.add('cart-item');

        li.innerHTML = `
            <div>
                <p class="item-name">${item.nome}</p>
                <small class="item-meta">
                    ${item.quantidade}x R$ ${item.preco}
                </small>
            </div>

            <span class="item-price">
                R$ ${totalItem.toFixed(2)}
            </span>
        `;

        lista.appendChild(li);
    });

    const desconto =
        parseFloat(
            document.getElementById('desconto')
                ?.value
                .replace(',', '.')
        ) || 0;

    const total = subtotal - desconto;

    document.querySelector(
        '.totals .total:nth-child(1) span:last-child'
    ).textContent =
        `R$ ${subtotal.toFixed(2)}`;

    document.querySelector(
        '.discount-value'
    ).textContent =
        `- R$ ${desconto.toFixed(2)}`;

    document.querySelector(
        '.total.final span:last-child'
    ).textContent =
        `R$ ${total.toFixed(2)}`;
}


// =======================
// FINALIZAR VENDA
// =======================

async function finalizarVenda(event) { 

    event.preventDefault();

    const selectCliente =
        document.getElementById('cliente');

    const clienteId =
        Number(selectCliente.value);

    console.log(
        'Valor do select:',
        selectCliente.value
    );

    console.log(
        'Cliente ID:',
        clienteId
    );

    if (isNaN(clienteId)) {

        alert(
            'Cliente inválido. Verifique o select.'
        );

        return;
    }
}
// =======================
// LISTAR VENDAS
// =======================

async function carregarVendas() {

    const tbody =
        document.querySelector('table tbody');

    if (!tbody) return;

    try {

        const response = await fetch(
            `${BASE_URL}/${ENDPOINT_VENDAS}`
        );

        if (!response.ok) {
            throw new Error('Erro ao carregar vendas');
        }

        const vendas =
            await response.json();

        tbody.innerHTML = '';

        vendas.forEach(venda => {

            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td>${venda.id}</td>
                <td>${venda.clienteId}</td>
                <td>${venda.itens.length} item(s)</td>
                <td>
                    ${new Date(venda.data)
                        .toLocaleString('pt-BR')}
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                    <span class="status-badge paid">
                        Pago
                    </span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {

        console.error(error);
    }
}


// =======================
// EVENTOS
// =======================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        carregarClientes();

        carregarProdutos();

        carregarVendas();

        const btnInserir =
            document.querySelector(
                '.btn-add-item'
            );

        if (btnInserir) {

            btnInserir.addEventListener(
                'click',
                adicionarItem
            );
        }

        const btnFinalizar =
            document.querySelector(
                '.btn-finalize'
            );

        if (btnFinalizar) {

            btnFinalizar.addEventListener(
                'click',
                finalizarVenda
            );
        }

        const desconto =
            document.getElementById(
                'desconto'
            );

        if (desconto) {

            desconto.addEventListener(
                'input',
                atualizarResumo
            );
        }
    }
);