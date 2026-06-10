const API_URL = 'http://localhost:5191/api';

let entradas = 0;
let saidas = 0;

document.addEventListener('DOMContentLoaded', () => {
    carregarResumoFinanceiro();

    const botaoLancar = document.querySelector('.btn-action-payroll');

    if (botaoLancar) {
        botaoLancar.addEventListener('click', registrarMovimentacao);
    }
});

async function carregarResumoFinanceiro() {
    try {

        // VENDAS
        const vendasResponse = await fetch(`${API_URL}/PedidoVenda`);
        const vendas = await vendasResponse.json();

        entradas = 0;

        vendas.forEach(venda => {

            if (venda.itens && venda.itens.length > 0) {

                venda.itens.forEach(item => {
                    entradas += item.precoUni * item.quantidade;
                });
            }
        });

        // FOLHA
        const folhaResponse = await fetch(`${API_URL}/FolhaPagamento`);
        const folhas = await folhaResponse.json();

        saidas = 0;

        folhas.forEach(folha => {
            saidas += folha.pagamentoFinal || 0;
        });

        atualizarTelaFinanceiro();

    } catch (error) {
        console.error(error);
    }
}

function atualizarTelaFinanceiro() {

    const saldo = entradas - saidas;

    // CAMPOS INPUTS
    const entradasInput =
        document.getElementById('total-entradas-val');

    const saidasInput =
        document.getElementById('total-saidas-val');

    if (entradasInput) {
        entradasInput.value =
            `R$ ${entradas.toFixed(2)}`;
    }

    if (saidasInput) {
        saidasInput.value =
            `R$ ${saidas.toFixed(2)}`;
    }

    // CARD LATERAL
    const txtGreen =
        document.querySelector('.txt-green');

    const txtRed =
        document.querySelector('.txt-red');

    const saldoAtual =
        document.querySelector('.balance-value');

    if (txtGreen) {
        txtGreen.textContent =
            `R$ ${entradas.toFixed(2)}`;
    }

    if (txtRed) {
        txtRed.textContent =
            `- R$ ${saidas.toFixed(2)}`;
    }

    if (saldoAtual) {
        saldoAtual.textContent =
            `R$ ${saldo.toFixed(2)}`;
    }
}

async function registrarMovimentacao() {

    const data =
        document.getElementById('mov-data').value;

    const tipo =
        document.getElementById('mov-tipo').value;

    const descricao =
        document.getElementById('mov-desc').value;

    const valorTexto =
        document.getElementById('mov-valor').value;

    const valor =
        parseFloat(
            valorTexto
                .replace('R$', '')
                .replace(',', '.')
        );

    if (!descricao || !valor) {
        alert('Preencha os campos');
        return;
    }

    const payload = {
        dataVencimento: new Date(data),
        valor: valor,
        descricao: descricao,
        dataPagamento: new Date(),
        pedidoId: 0,
        dataRecebimento: new Date(),
        tipo: tipo
    };

    try {

        const response = await fetch(
            `${API_URL}/Financeiro`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao registrar');
        }

        alert('Movimentação registrada');

        if (tipo === 'entrada') {
            entradas += valor;
        } else {
            saidas += valor;
        }

        atualizarTelaFinanceiro();

    } catch (error) {
        console.error(error);
        alert('Erro ao registrar movimentação');
    }
}