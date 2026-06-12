const BASE_URL = "https://api-alcateia.azurewebsites.net/api";
const ENDPOINT = "Funcionario";

let funcionarioSelecionadoId = null;

async function obterTodosFuncionarios() {
  try {
    const response = await fetch(`${BASE_URL}/${ENDPOINT}`);

    if (!response.ok) {
      throw new Error(`Erro https: ${response.status}`);
    }

    const funcionarios = await response.json();

    console.log(funcionarios);

    const tbody = document.getElementById("tabela-funcionarios-body");

    if (!tbody) return;

    tbody.innerHTML = "";

    funcionarios.forEach((funcionario) => {
      const tr = document.createElement("tr");

      const nomeSeguro = (funcionario.nome || "")
        .replace(/\n/g, " ")
        .replace(/'/g, "\\'");
      const cpfSeguro = (funcionario.cpf || "")
        .replace(/\n/g, " ")
        .replace(/'/g, "\\'");
      const cargoSeguro = (funcionario.cargo || "")
        .replace(/\n/g, " ")
        .replace(/'/g, "\\'");
      const telefoneSeguro = (funcionario.telefoneFuncionario || "")
        .replace(/\n/g, " ")
        .replace(/'/g, "\\'");
      const cidadeSeguro = (funcionario.cidade || "")
        .replace(/\n/g, " ")
        .replace(/'/g, "\\'");

      tr.innerHTML = `
            
                <td>
                    <div class="product-cell">

                        <span>${funcionario.nome}</span>

                        <button
                            type="button"
                            class="btn-detail-arrow"
                            title="Ver detalhes"
                            onclick="abrirDetalhesFunc(
                                ${funcionario.id},
                                '${nomeSeguro}',
                                '${cpfSeguro}',
                                '${cargoSeguro}',
                                '${funcionario.salario}',
                                '${telefoneSeguro}',
                                '${cidadeSeguro}'
                            )"
                        >
                            &#10142;
                        </button>

                    </div>
                </td>

                <td>${funcionario.salario}</td>

                <td>${telefoneSeguro}</td>

                <td style="text-align:center;">

                    <button
                        type="button"
                        class="btn-action edit"
                        onclick="abrirDetalhesFunc(
                            ${funcionario.id},
                            '${nomeSeguro}',
                            '${cpfSeguro}',
                            '${cargoSeguro}',
                            '${funcionario.salario}',
                            '${telefoneSeguro}',
                            '${cidadeSeguro}'
                        )"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-action delete"
                        onclick="excluirFuncionario(${funcionario.id})"
                    >
                        Excluir
                    </button>

                </td>
            `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar funcionários");
  }
}

async function cadastrarFuncionario(event) {
  event.preventDefault();

  const payload = {
    nome: document.getElementById("nome").value,

    Cpf: document.getElementById("cpf").value,

    cargo: document.getElementById("cargo").value,

    Salario: document.getElementById("salario").value,

    TelefoneFuncionario: document.getElementById("telefone").value,

    Cidade: document.getElementById("cidade").value,
  };

  console.log(payload);

  try {
    const response = await fetch(`${BASE_URL}/${ENDPOINT}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const erro = await response.text();

      console.log(erro);

      throw new Error("Erro ao cadastrar funcionário");
    }

    alert("Funcionário cadastrado com sucesso!");

    window.location.href = "funcionario.html";
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

async function salvarFuncionario() {
  const payload = {
    id: funcionarioSelecionadoId,

    nome: document.getElementById("func-nome").value,

    Cpf: document.getElementById("func-cpf").value,

    cargo: document.getElementById("func-cargo").value,

    Salario: parseFloat(document.getElementById("func-salario").value),

    TelefoneFuncionario: document.getElementById("func-telefone").value,

    cidade: document.getElementById("func-cidade").value,
  };

  try {
    const response = await fetch(
      `${BASE_URL}/${ENDPOINT}/${funcionarioSelecionadoId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const erro = await response.text();

      console.log(erro);

      throw new Error("Erro ao atualizar funcionário");
    }

    alert("Funcionário atualizado com sucesso!");

    fecharDetalhesFunc();

    obterTodosFuncionarios();
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

async function excluirFuncionario(id) {
  const confirmar = confirm("Deseja excluir este funcionário?");

  if (!confirmar) return;

  try {
    const response = await fetch(`${BASE_URL}/${ENDPOINT}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir funcionário");
    }

    alert("Funcionário excluído com sucesso!");

    obterTodosFuncionarios();
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

function abrirDetalhesFunc(id, nome, cpf, cargo, salario, telefone, cidade) {
  funcionarioSelecionadoId = id;

  document.getElementById("func-nome").value = nome;

  document.getElementById("func-cpf").value = cpf;

  document.getElementById("func-cargo").value = cargo;

  document.getElementById("func-salario").value = salario;

  document.getElementById("func-telefone").value = telefone;

  document.getElementById("func-cidade").value = cidade;

  document.getElementById("drawer-funcionario").classList.add("active");
}

function fecharDetalhesFunc() {
  document.getElementById("drawer-funcionario").classList.remove("active");
}

window.abrirDetalhesFunc = abrirDetalhesFunc;

window.fecharDetalhesFunc = fecharDetalhesFunc;

window.salvarFuncionario = salvarFuncionario;

window.excluirFuncionario = excluirFuncionario;

document.addEventListener("DOMContentLoaded", () => {
  obterTodosFuncionarios();

  const form = document.getElementById("form-cadastro-funcionario");

  if (form) {
    form.addEventListener("submit", cadastrarFuncionario);
  }
});
