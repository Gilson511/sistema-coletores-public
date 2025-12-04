// js/tabela.js - Versão ajustada para exibir horário corretamente

const baseURL = "http://localhost:3000/api/coletores";

window.onload = function () {
  const usuario = localStorage.getItem("usuarioLogado");

  if (!usuario) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "index.html";
  } else {
    document.getElementById(
      "usuarioLogadoTexto"
    ).textContent = `Usuário logado: ${usuario}`;
    carregarTabela();
  }
};

function carregarTabela() {
  fetch(baseURL)
    .then((res) => res.json())
    .then((coletores) => {
      const tabelaBody = document.querySelector("#tabelaColetores tbody");
      tabelaBody.innerHTML = "";

      if (coletores.length === 0) {
        const linha = document.querySelector(".status-log");
        linha.style.fontSize = "18px";
        linha.style.color = "gray";
        linha.innerHTML = "Não há nenhum registro para exibir!";
        return;
      }

      coletores.forEach((c) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${c.re}</td>
          <td>${c.numero_coletor}</td>
          <td>${c.encarregado}</td>
          <td>${c.turno}</td>
          <td>${c.setor}</td>
          <td>${
            c.hora_pegou
              ? new Date(c.hora_pegou).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })
              : ""
          }</td>
          <td>${
            c.hora_baixa
              ? new Date(c.hora_baixa).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })
              : ""
          }</td>
          <td>${c.estado}</td>
          <td>
            <button onclick="editarColetor(this, ${c.id})">Editar</button>
            <button onclick="salvarColetor(this, ${
              c.id
            })" disabled>Salvar</button>
            <button onclick="excluirColetor(${c.id})">Excluir</button>
          </td>
        `;

        tabelaBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar coletores:", err);
      alert("Erro ao carregar coletores.");
    });
}

function editarColetor(btn, id) {
  const inputs = btn.closest("tr").querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = false));
  btn.nextElementSibling.disabled = false;
}

function salvarColetor(btn, id) {
  const inputs = btn.closest("tr").querySelectorAll("input");
  const [
    re,
    numero_coletor,
    encarregado,
    turno,
    setor,
    hora_pegou,
    hora_baixa,
    estado,
  ] = Array.from(inputs).map((i) => i.value);

  const coletorAtualizado = {
    re,
    numero_coletor,
    encarregado,
    turno,
    setor,
    hora_pegou,
    hora_baixa,
    estado,
  };

  fetch(`${baseURL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coletorAtualizado),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Coletor atualizado com sucesso!");
      carregarTabela();
    })
    .catch((err) => {
      console.error("Erro ao atualizar coletor:", err);
      alert("Erro ao atualizar coletor.");
    });
}

function excluirColetor(id) {
  if (!confirm("Deseja realmente excluir este coletor?")) return;

  fetch(`${baseURL}/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then(() => {
      alert("Coletor excluído com sucesso!");
      carregarTabela();
    })
    .catch((err) => {
      console.error("Erro ao excluir coletor:", err);
      alert("Erro ao excluir coletor.");
    });
}

function exportarExcel() {
  const tabelaOriginal = document.getElementById("tabelaColetores");

  // Clona a tabela para limpar os botões antes de exportar
  const tabelaClone = tabelaOriginal.cloneNode(true);

  // Remove a coluna de ações (última coluna)
  tabelaClone.querySelectorAll("tr").forEach((row) => {
    const ultimaCelula = row.lastElementChild;
    if (ultimaCelula) ultimaCelula.remove();
  });

  // Converte a tabela clonada para planilha
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(tabelaClone);
  XLSX.utils.book_append_sheet(wb, ws, "Coletores");
  XLSX.writeFile(wb, "coletores.xlsx");
}
