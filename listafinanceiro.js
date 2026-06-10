const API_URL = 'http://localhost:5191/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarRegistros();
});

async function carregarRegistros() {

    const tbody =
        document.getElementById(
            'tabela-registros'
        );

    if (!tbody) return;

    tbody.innerHTML = '';

    try {

        // FOLHA
        const folhaResponse =
            await fetch(
                `${API_URL}/FolhaPagamento`
            );

        const folhas =
            await folhaResponse.json();

        folhas.forEach((folha, index) => {

            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td class="id-col">
                    #FP${index + 1}
                </td>

                <td>
                    Funcionário ID ${folha.funcionarioId || 1}
                </td>

                <td>
                    ${new Date().toLocaleString()}
                </td>

                <td class="text-saida">
                    - R$ ${folha.pagamentoFinal || 0}
                </td>

                <td>
                    Folha de Pagamento
                </td>

                <td>
                    <span class="status-badge status-pago">
                        Pago
                    </span>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // VENDAS
        const vendasResponse =
            await fetch(
                `${API_URL}/PedidoVenda`
            );

        const vendas =
            await vendasResponse.json();

        vendas.forEach((venda, index) => {

            let total = 0;

            if (venda.itens) {

                venda.itens.forEach(item => {
                    total +=
                        item.precoUni *
                        item.quantidade;
                });
            }

            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td class="id-col">
                    #VD${index + 1}
                </td>

                <td>
                    Venda Cliente ${venda.clienteId}
                </td>

                <td>
                    ${new Date(
                        venda.data
                    ).toLocaleString()}
                </td>

                <td class="text-entrada">
                    + R$ ${total.toFixed(2)}
                </td>

                <td>
                    Entrada
                </td>

                <td>
                    <span class="status-badge status-pago">
                        Concluído
                    </span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {

        console.error(error);

        alert(
            'Erro ao carregar registros'
        );
    }
}