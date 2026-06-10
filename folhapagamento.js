const API_URL = 'http://localhost:5191/api';

document.addEventListener('DOMContentLoaded', () => {

    adicionarEventos();

    calcularFolha();

    const botao =
        document.querySelector('.btn-action-payroll2');

    if (botao) {

        botao.addEventListener('click', async (e) => {

            e.preventDefault();

            await salvarFolhaPagamento();

            window.location.href =
                'listaFinanceiro.html';
        });
    }
});

function adicionarEventos() {

    const campos = [
        'salario-base',
        'outros-proventos',
        'inss',
        'irrf',
        'beneficios',
        'faltas'
    ];

    campos.forEach(id => {

        const campo =
            document.getElementById(id);

        if (campo) {
            campo.addEventListener(
                'input',
                calcularFolha
            );
        }
    });
}

function pegarNumero(id) {

    const valor =
        document.getElementById(id).value
            .replace('R$', '')
            .replace(',', '.');

    return parseFloat(valor) || 0;
}

function calcularFolha() {

    const salario =
        pegarNumero('salario-base');

    const extras =
        pegarNumero('outros-proventos');

    const inss =
        pegarNumero('inss');

    const irrf =
        pegarNumero('irrf');

    const beneficios =
        pegarNumero('beneficios');

    const faltas =
        pegarNumero('faltas');

    const totalProventos =
        salario + extras;

    const totalDescontos =
        inss + irrf + beneficios + faltas;

    const liquido =
        totalProventos - totalDescontos;

    const positivo =
        document.querySelector('.value-positive');

    const negativo =
        document.querySelector('.value-negative');

    const liquidoTela =
        document.querySelector('.total-value');

    if (positivo) {
        positivo.textContent =
            `R$ ${totalProventos.toFixed(2)}`;
    }

    if (negativo) {
        negativo.textContent =
            `- R$ ${totalDescontos.toFixed(2)}`;
    }

    if (liquidoTela) {
        liquidoTela.textContent =
            `R$ ${liquido.toFixed(2)}`;
    }
}

async function salvarFolhaPagamento() {

    const inss =
        pegarNumero('inss');

    const irrf =
        pegarNumero('irrf');

    const extras =
        pegarNumero('outros-proventos');

    const beneficios =
        pegarNumero('beneficios');

    const faltas =
        pegarNumero('faltas');

    const salario =
        pegarNumero('salario-base');

    const totalDesconto =
        inss + irrf + beneficios + faltas;

    const pagamentoFinal =
        (salario + extras) - totalDesconto;

    const payload = {
        funcionarioId: 1,
        horaExtra: parseInt(extras),
        inss: parseInt(inss),
        irrf: parseInt(irrf),
        totalDesconto: parseInt(totalDesconto),
        pagametoFinal: parseInt(pagamentoFinal)
    };

    try {

        const response = await fetch(
            `${API_URL}/FolhaPagamento`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {

            const erro = await response.text();

            console.error(erro);

            throw new Error(
                'Erro ao salvar folha'
            );
        }

        alert('Folha registrada com sucesso');

    } catch (error) {

        console.error(error);

        alert('Erro ao registrar folha');
    }
}