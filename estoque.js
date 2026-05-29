
const API_URL = 'http://localhost:5191/api/Estoque';

async function obterTodosEstoque() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const estoques = await response.json();

        const tabela = document.getElementById('tabela-estoque-body');

        tabela.innerHTML = '';

        estoques.forEach(estoque => {

            const tr = document.createElement('tr');

            let statusBotao = '';
            let classeBotao = '';

            if (estoque.quantidade <= estoque.quantidadeMinima) {

                statusBotao = 'Em baixa';
                classeBotao = 'btn-delete';

            } else {

                statusBotao = 'Estoque';
                classeBotao = 'btn-edit';
            }

            tr.innerHTML = `
                <td>${estoque.nomeProduto}</td>

                <td>${estoque.quantidade}</td>

                <td>
                    <div class="action-buttons">

                        <button class="btn-action ${classeBotao}">
                            ${statusBotao}
                        </button>

                    </div>
                </td>
            `;

            tabela.appendChild(tr);

        });

    } catch (error) {

        console.error(error);

        alert('Erro ao carregar estoque');

    }
}

document.addEventListener('DOMContentLoaded', () => {

    obterTodosEstoque();

});
