// Verifica se usuário está logado
const usuario = localStorage.getItem('usuarioLogado');
if (!usuario) {
  alert("Você precisa estar logado para acessar esta página.");
  window.location.href = "index.html"; // ou página de login
}


document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#tabela-coletores tbody');
  const form = document.getElementById('form-coletor');

  const msg = document.createElement('p');
  msg.style.marginTop = '10px';
  msg.style.fontWeight = 'bold';
  form.appendChild(msg); // adiciona sempre que tiver um coletor cadastro como primeiro elemento;

  function exibirMensagem(texto, cor = 'green') {
    msg.textContent = texto;
    msg.style.color = cor;
    setTimeout(() => {
      msg.textContent = ''; // setTime out executa apos 4 segundos limpando o campo;
    }, 3000);
  }

  function carregarColetores() {

    const estaLogado = !!localStorage.getItem('usuarioLogado');

    fetch('http://192.168.0.106:3000/api/basecoletores')

      .then(res => res.json())
      .then(coletores => {
          tbody.innerHTML = '';

          // 🔽 Ordenar do menor para o maior (convertendo para número)
          coletores.sort((a, b) => parseInt(a.numero_coletor) - parseInt(b.numero_coletor));

          coletores.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${c.numero_coletor}</td>
              <td>${c.marca}</td>
              <td>${c.sn}</td>
              <td>
                ${estaLogado ? `<button class="btn-excluir" data-id="${c.id}">Excluir</button>` : ''}
              </td>`;
            tbody.appendChild(row);
      });


        document.querySelectorAll('.btn-excluir').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            excluirColetor(id);
          });
        });
      })
      .catch(() => {
        exibirMensagem("Erro ao carregar dados da tabela.", "red");
      });
  }
  async function excluirColetor(id) {
    const token = localStorage.getItem("token");
  
    try {
      // Primeiro busca os dados da base pelo ID
      const baseRes = await fetch('http://192.168.0.106:3000/api/basecoletores')
;
      const baseData = await baseRes.json();
      const coletorBase = baseData.find(c => c.id == id);
  
      if (!coletorBase) {
        alert("Coletor não encontrado na base.");
        return;
      }
  
      // Agora verifica se o número do coletor está em uso
      const coletoresRes = await fetch('http://192.168.0.106:3000/api/basecoletores');
      const coletoresUso = await coletoresRes.json();
  
      const estaEmUso = coletoresUso.some(c => c.numero_coletor === coletorBase.numero_coletor);
  
      if (estaEmUso) {
        const log =   document.querySelector('.log_erro');
        log.style.color =  'red';
        log.style.fontSize = '12px';
        log.innerHTML = '⚠️ Este coletor está em uso e não pode ser excluído.';
        return;
      }
  
      // Se passou, pode excluir

      if (!token) {
         alert("Token não encontrado. Você precisa estar logado.");
         return;
      }

      const res = await fetch(`http://192.168.0.106:3000/api/basecoletores/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization':  'Bearer ' + token
        }
      });
  
      if (!res.ok) {
        throw new Error("Erro ao excluir coletor.");
      }
  
      const log = document.querySelector('.log_erro');
      log.style.color =  'green';
      log.style.fontSize = '16px';
      log.innerHTML = 'Coletor excluído com sucesso.';

      setTimeout(() =>{
        log.innerHTML = '';
      },2000);
      
      carregarColetores();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir coletor.");
    }
  }
  
  

  document.getElementById('cadastrar-coletor').addEventListener('submit', (e) => {
    e.preventDefault();
    const numero = document.getElementById('numero').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const sn = document.getElementById('sn').value.trim();

    if (!numero || !marca || !sn) {
      exibirMensagem("Todos os campos são obrigatórios!", "red");
      return;
    }


    if (!localStorage.getItem('usuarioLogado')) {
      exibirMensagem("Você precisa estar logado para cadastrar!", "red");
      return;
    }
    
    fetch('http://192.168.0.106:3000/api/basecoletores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero_coletor: numero, marca, sn })
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Erro desconhecido.");
        }
        return res.json();
      })
      .then(() => {
        exibirMensagem("Coletor cadastrado com sucesso!");
        form.reset();
        carregarColetores();
      })
      .catch(err => {
        console.error(err);
        if (err.message.includes('duplic')) {
          exibirMensagem("Já existe um coletor com este SN.", "red");
        } else {
          exibirMensagem(`Erro: ${err.message}`, "red");
        }
      });
  });

  carregarColetores();
});


// Exibe nome do usuário logado
const textoUsuario = document.getElementById("usuarioLogadoTexto");
if (textoUsuario) {
  textoUsuario.innerText = "Usuário: " + localStorage.getItem("usuarioLogado");
}

// Função de logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
