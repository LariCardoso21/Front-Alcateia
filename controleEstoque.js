import { apiFetch } from "./api.js";

const ENDPOINT = 'estoque';


const historicoMovimentacoes = [];

async function carregarPainelControleEstoque() {
    try {
        const listaEstoque = await apiFetch(ENDPOINT, 'GET');

        atualizarCardsResumo(listaEstoque);
        renderizarTabelaMovimentacao(listaEstoque);
        renderizarHistorico();

    } catch (error) {
        alert('Erro ao carregar dados do estoque: ' + error.message);
    }
}


function atualizarCardsResumo(listaEstoque) {

    let totalItens = 0;
    let criticos = 0;
    let esgotados = 0;

    listaEstoque.forEach(item => {

        totalItens += item.quantidade;


        const minimo = item.estoqueMinimo || 8;

        if (item.quantidade === 0) {
            esgotados++;
        }
        else if (item.quantidade < minimo) {
            criticos++;
        }
    });

    document.getElementById('card-total-itens').textContent = totalItens;

    document.getElementById('card-estoque-critico').textContent = criticos;

    const cardEsgotados = document.getElementById('card-produtos-esgotados');

    if (cardEsgotados) {
        cardEsgotados.textContent = esgotados;
    }
}

function renderizarTabelaMovimentacao(listaEstoque) {

    const corpoTabela = document.getElementById('tabela-movimentacao-body');

    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    listaEstoque.forEach(item => {

        const tr = document.createElement('tr');

        const minimo = item.estoqueMinimo || 8;

        let statusBadge = `<span class="status-badge normal">Normal</span>`;

        let desabilitarRetirar = '';

        let estiloOpacidade = '';


        if (item.quantidade === 0) {

            statusBadge = `<span class="status-badge esgotado">Esgotado</span>`;

            desabilitarRetirar = 'disabled';

            estiloOpacidade = 'style="opacity: 0.3; cursor: not-allowed;"';

        }
        else if (item.quantidade < minimo) {

            statusBadge = `<span class="status-badge alert">Crítico</span>`;
        }

        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>${minimo}</td>
            <td>${statusBadge}</td>

            <td>
                <div class="stock-actions">

                    <button 
                        class="btn-stock btn-add"
                        onclick="ajustarEstoque(${item.id}, 'entrada')">
                        + Adicionar
                    </button>

                    <button 
                        class="btn-stock btn-remove"
                        ${desabilitarRetirar}
                        ${estiloOpacidade}
                        onclick="ajustarEstoque(${item.id}, 'saida')">
                        - Retirar
                    </button>

                </div>
            </td>
        `;

        corpoTabela.appendChild(tr);
    });
}


window.ajustarEstoque = async function (id, tipo) {

    try {

        const itemEstoque = await apiFetch(`${ENDPOINT}/${id}`, 'GET');

        const acaoTexto =
            tipo === 'entrada'
                ? 'adicionar ao'
                : 'retirar do';

        const qtdInformada = prompt(
            `Quantas unidades deseja ${acaoTexto} estoque do produto "${itemEstoque.nome}"?`
        );


        if (qtdInformada === null) return;

        const quantidadeAjuste = parseInt(qtdInformada);


        if (isNaN(quantidadeAjuste) || quantidadeAjuste <= 0) {

            alert('Digite um número válido maior que zero.');

            return;
        }

        let novaQuantidade = itemEstoque.quantidade;

        if (tipo === 'entrada') {

            novaQuantidade += quantidadeAjuste;

            registrarNoHistorico(
                'Entrada',
                `+${quantidadeAjuste} unidades de ${itemEstoque.nome}`
            );
        }

     
        else {

            if (quantidadeAjuste > itemEstoque.quantidade) {

                alert(
                    `Saldo insuficiente! Existem apenas ${itemEstoque.quantidade} unidades no estoque.`
                );

                return;
            }

            novaQuantidade -= quantidadeAjuste;

            registrarNoHistorico(
                'Saída',
                `-${quantidadeAjuste} unidades de ${itemEstoque.nome}`
            );
        }


        const estoqueAtualizado = {
            ...itemEstoque,
            quantidade: novaQuantidade
        };

        await apiFetch(
            `${ENDPOINT}/${id}`,
            'PUT',
            estoqueAtualizado
        );

        carregarPainelControleEstoque();

    } catch (error) {

        alert('Erro ao atualizar estoque: ' + error.message);
    }
};


function registrarNoHistorico(tipo, mensagem) {

    const agora = new Date();

    const horaFormatada = agora.toLocaleTimeString(
        'pt-BR',
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    );

    historicoMovimentacoes.unshift({
        tipo: tipo,
        mensagem: mensagem,
        hora: `Hoje, ${horaFormatada}`
    });
}

function renderizarHistorico() {

    const lista = document.getElementById('lista-historico');

    if (!lista) return;


    if (historicoMovimentacoes.length === 0) {

        lista.innerHTML = `
            <li class="history-item">
                <small>
                    Nenhuma movimentação realizada nesta sessão.
                </small>
            </li>
        `;

        return;
    }

    lista.innerHTML = historicoMovimentacoes.map(item => `

        <li class="history-item ${item.tipo === 'Entrada'
            ? 'input'
            : 'output'}">

            <span class="history-type">
                ${item.tipo}
            </span>

            <p>${item.mensagem}</p>

            <small>${item.hora}</small>

        </li>

    `).join('');
}

document.addEventListener(
    'DOMContentLoaded',
    carregarPainelControleEstoque
);