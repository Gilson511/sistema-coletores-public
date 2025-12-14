let editandoId = null;

// Verifica se usuário está logado
const usuario = localStorage.getItem("usuarioLogado");
if (!usuario) {
  alert("Você precisa estar logado para acessar esta página.");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#tabela-coletores tbody");
  const form = document.getElementById("form-coletor");

  const msg = document.createElement("p");
  msg.style.marginTop = "10px";
  msg.style.fontWeight = "bold";
  form.appendChild(msg);

  function exibirMensagem(texto, cor = "green") {
    msg.textContent = texto;
    msg.style.color = cor;
    setTimeout(() => (msg.textContent = ""), 3000);
  }

  function carregarColetores() {
    const estaLogado = !!localStorage.getItem("usuarioLogado");

    fetch("http://localhost:3000/api/basecoletores")
      .then((res) => res.json())
      .then((coletores) => {
        tbody.innerHTML = "";

        coletores.sort(
          (a, b) => parseInt(a.numero_coletor) - parseInt(b.numero_coletor)
        );

        coletores.forEach((c) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${c.numero_coletor}</td>
            <td>${c.marca}</td>
            <td>${c.sn}</td>
            <td>
              <button onclick="editarColetor(this, ${c.id})">Editar</button>
              ${
                estaLogado
                  ? `<button class="btn-excluir" data-id="${c.id}">Excluir</button>`
                  : ""
              }
            </td>
          `;
          tbody.appendChild(row);
        });

        document.querySelectorAll(".btn-excluir").forEach((btn) => {
          btn.addEventListener("click", () => {
            excluirColetor(btn.dataset.id);
          });
        });
      })
      .catch(() => {
        exibirMensagem("Erro ao carregar dados da tabela.", "red");
      });
  }

  // 👉 EDITAR (preenche o formulário)
  window.editarColetor = function (btn, id) {
    const row = btn.closest("tr");
    const tds = row.querySelectorAll("td");

    document.getElementById("numero").value = tds[0].innerText.trim();
    document.getElementById("marca").value = tds[1].innerText.trim();
    document.getElementById("sn").value = tds[2].innerText.trim();

    editandoId = id;
    exibirMensagem(`Editando coletor nº ${tds[0].innerText}`, "blue");
  };

  async function excluirColetor(id) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token não encontrado.");

    try {
      const res = await fetch(`http://localhost:3000/api/basecoletores/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error();

      exibirMensagem("Coletor excluído com sucesso.");
      carregarColetores();
    } catch {
      exibirMensagem("Erro ao excluir coletor.", "red");
    }
  }

  // 👉 SUBMIT (POST ou PUT)
  document
    .getElementById("cadastrar-coletor")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const numero = document.getElementById("numero").value.trim();
      const marca = document.getElementById("marca").value.trim();
      const sn = document.getElementById("sn").value.trim();

      if (!numero || !marca || !sn) {
        exibirMensagem("Todos os campos são obrigatórios!", "red");
        return;
      }

      const metodo = editandoId ? "PUT" : "POST";
      const url = editandoId
        ? `http://localhost:3000/api/basecoletores/${editandoId}`
        : "http://localhost:3000/api/basecoletores";

      fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_coletor: numero, marca, sn }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => {
          exibirMensagem(
            editandoId
              ? "Coletor atualizado com sucesso!"
              : "Coletor cadastrado com sucesso!"
          );
          form.reset();
          editandoId = null;
          carregarColetores();
        })
        .catch(() => {
          exibirMensagem("Erro ao salvar coletor.", "red");
        });
    });

  carregarColetores();
});

// Exibe usuário logado
const textoUsuario = document.getElementById("usuarioLogadoTexto");
if (textoUsuario) {
  textoUsuario.innerText = "Usuário: " + localStorage.getItem("usuarioLogado");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
