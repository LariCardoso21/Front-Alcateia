const api = "http://localhost:5191/api/Produto";
const FormProduto = document.getElementById("form-group");
const divProdutos = document.getElementById("drawer-produto");

async function buscarProdutos() {

  try {

    const resposta = await fetch(api);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    divProdutos.innerHTML = "";

    dados.forEach((dado) => {

      let card = document.createElement("div");

      card.classList.add("row");

      card.innerHTML = `
      
        <span>${dado.nome}</span>

        <span>R$ ${dado.valorProduto}</span>

        <div class="actions">

          <i class="fa-regular fa-pen-to-square edit"></i>

          <i class="fa-solid fa-circle-xmark delete"
             onclick="deletarProduto(${dado.id})">
          </i>

        </div>
      
      `;

      divProdutos.appendChild(card);

    });

  } catch (error) {

    console.log("Erro ao buscar os produtos: ", error);

  }

}

async function cadastrarProduto(event) {

  event.preventDefault();

  const Nome = document.getElementById("nome").value;

  const Descricao = document.getElementById("descricao").value;

  const Marca = document.getElementById("marca").value;

  const QtdEstoque = document.getElementById("estoque").value;

  const QtdMinima = document.getElementById("minima").value;

  const ValorProduto = document.getElementById("valor").value;

  try {

    const resposta = await fetch(api, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        nome: Nome,
        descricao: Descricao,
        marca: Marca,
        qtdEstoque: QtdEstoque,
        qtdMinima: QtdMinima,
        valorProduto: ValorProduto

      }),

    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar produto");
    }

    FormProduto.reset();

    await buscarProdutos();

    alert("Produto cadastrado com sucesso!");

  } catch (error) {

    console.log("Erro ao cadastrar produto: ", error);

  }

}

async function deletarProduto(id) {

  const confirmar = confirm("Deseja deletar este produto?");

  if (!confirmar) {
    return;
  }

  try {

    const resposta = await fetch(`${api}/${id}`, {

      method: "DELETE",

    });

    if (!resposta.ok) {
      throw new Error("Erro ao deletar produto");
    }

    await buscarProdutos();

  } catch (error) {

    console.log("Erro ao deletar produto: ", error);

  }

}
