import { apiFetch } from './api.js';
const ENDPOINT_FUNC = "http://localhost:5191/api/Funcionario"; 

document.addEventListener('DOMContentLoaded', () => {
   
    if (document.getElementById('tabela-funcionarios-body')) {
        carregarFuncionarios();
    }

    if (document.getElementById('form-cadastro-funcionario')) {
        configurarFormCadastro();
    }
});

async function carregarFuncionarios() {
    const corpoTabela = document.getElementById('tabela-funcionarios-body');
    if (!corpoTabela) return;

    try {
       
        const funcionarios = await apiFetch('/Funcionario', 'GET'); 
        
        corpoTabela.innerHTML = ''; 

        if (funcionarios.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum funcionário cadastrado.</td></tr>`;
            return;
        }

        funcionarios.forEach(func => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="employee-cell">
                        <span>${func.nome}</span>
                        <button type="button" class="btn-detail-arrow" title="Ver detalhes" 
                            onclick="abrirDetalhesFunc('${func.id}', '${func.nome}', '${func.cpf}', '${func.cargo || ''}', '${func.salario || 0}', '${func.telefone}', '${func.cidade}')">
                            &#10142;
                        </button>
                    </div>
                </td>
                <td>${func.email}</td>
                <td>${func.telefone}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action edit" onclick="abrirDetalhesFunc('${func.id}', '${func.nome}', '${func.cpf}', '${func.cargo || ''}', '${func.salario || 0}', '${func.telefone}', '${func.cidade}')">Editar</button>
                    <button type="button" class="btn-action delete" onclick="excluirFuncionario('${func.id}')">Excluir</button>
                </td>
            `;
            corpoTabela.appendChild(tr);
        });
    } catch (error) {
        alert('Falha ao carregar os funcionários: ' + error.message);
    }
}

window.abrirDetalhesFunc = function(id, nome, cpf, cargo, salario, telefone, cidade) {
 
    const drawer = document.getElementById('drawer-funcionario');
    drawer.dataset.id = id;

    document.getElementById('func-nome').value = nome;
    document.getElementById('func-cpf').value = cpf;
    document.getElementById('func-cargo').value = cargo;
    document.getElementById('func-salario').value = salario;
    document.getElementById('func-telefone').value = telefone;
    document.getElementById('func-cidade').value = cidade;

    drawer.classList.add('active');
}

window.fecharDetalhesFunc = function() {
    document.getElementById('drawer-funcionario').classList.remove('active');
}

window.salvarFuncionario = async function() {
    const drawer = document.getElementById('drawer-funcionario');
    const id = drawer.dataset.id;

    const payload = {
        id: id,
        nome: document.getElementById('func-nome').value,
        cpf: document.getElementById('func-cpf').value,
        cargo: document.getElementById('func-cargo').value,
        salario: parseFloat(document.getElementById('func-salario').value) || 0,
        telefone: document.getElementById('func-telefone').value,
        cidade: document.getElementById('func-cidade').value
    };

    try {
        await apiFetch(`/Funcionario/${id}`, 'PUT', payload);
        alert("Dados do funcionário atualizados com sucesso!");
        fecharDetalhesFunc();
        carregarFuncionarios();
    } catch (error) {
        alert("Erro ao salvar alterações: " + error.message);
    }
}


window.excluirFuncionario = async function(id) {
    if (confirm('Tem certeza de que deseja excluir este funcionário?')) {
        try {
          await apiFetch(`/Funcionario/${id}`, 'DELETE');
            alert('Funcionário excluído com sucesso!');
            carregarFuncionarios(); 
        } catch (error) {
            alert('Erro ao excluir funcionário: ' + error.message);
        }
    }
}


function configurarFormCadastro() {
    const form = document.getElementById('form-cadastro-funcionario');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value,
            cidade: document.getElementById('cidade').value
        };

        try {
           await apiFetch('/Funcionario', 'POST', payload);
            alert('Funcionário cadastrado com sucesso!');
          
            window.location.href = 'funcionario.html';
        } catch (error) {
            alert('Erro ao cadastrar funcionário: ' + error.message);
        }
    });
}