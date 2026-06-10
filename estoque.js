const BASE_URL = 'http://localhost:5191/api';



async function carregarEstoque() {

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

        console.log(produtos);

        const tbody = document.querySelector(
            'table tbody'
        );

        if (!tbody) return;

        tbody.innerHTML = '';

        produtos.forEach(produto => {

            let status = '';
            let classe = '';

            if (produto.qtdEstoque <= produto.qtdMinima) {

                status = 'Em baixa';

                classe = 'btn-delete';

            } else {

                status = 'Estoque';

                classe = 'btn-edit';
            }

            const tr = document.createElement('tr');

            tr.innerHTML = `

                <td>${produto.nome}</td>

                <td>${produto.qtdEstoque}</td>

                <td>

                    <div class="action-buttons">

                        <button class="btn-action ${classe}">
                            ${status}
                        </button>

                    </div>

                </td>
            `;

            tbody.appendChild(tr);

        });

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}



document.addEventListener(
    'DOMContentLoaded',
    carregarEstoque
);

