function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  fetch("http://localhost:3000/api/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Login bem-sucedido") {
        localStorage.setItem("usuarioLogado", data.usuario);
        localStorage.setItem("tipoUsuario", data.tipo);
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
          let erro_loguim = document.querySelector('.erro-loguim');
          erro_loguim.style.fontSize = '14px';
          erro_loguim.style.color = 'red';
          erro_loguim.innerHTML = 'Usuário ou senha inválidos, repita a senha por favor.';
      }
    })
    .catch(error => {
      console.error("Erro no login:", error);
      alert("Erro ao tentar logar.");
    });
    
}


function mostrarCadastro() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("cadastro-form").classList.remove("hidden");
}

function mostrarLogin() {
  document.getElementById("cadastro-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
}

function cadastrarUsuario() {
  const novoUsuario = document.getElementById("novoUsuario").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const token = localStorage.getItem("token");

  if (!novoUsuario || !novaSenha) {
    alert("Preencha todos os campos!");
    return;
  }

  // 🚫 Bloqueia usuários comuns
  if (tipoUsuario !== "admin") {
    alert("Apenas administradores podem cadastrar novos usuários.");
    return;
  }

  fetch("http://localhost:3000/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ usuario: novoUsuario, senha: novaSenha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Usuário cadastrado com sucesso!") {
        alert("Usuário cadastrado com sucesso!");
        mostrarLogin();
      } else {
        alert(data.error || "Erro ao cadastrar.");
      }
    })
    .catch(error => {
      console.error("Erro no cadastro:", error);
      alert("Erro ao tentar cadastrar.");
    });
}

