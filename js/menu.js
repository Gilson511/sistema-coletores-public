function openMenu() {
  const menu = document.querySelector(".menu-lateral");
  const conteudo = document.querySelector(".conteudo-dashboard");
  const icone = document.querySelector(".menu-lateral .icone-menu");

  const menuAtivo = menu.classList.toggle("ativo");

  conteudo.style.transition = "all 0.3s ease";

  if (menuAtivo) {
    conteudo.style.marginLeft = "200px";
    conteudo.style.opacity = "0.8";
    icone.textContent = "✖"; // muda para "X"
    icone.classList.add("menu-aberto");
    icone.classList.remove("menu-fechado");
    icone.setAttribute("title", "Fechar menu"); // ✔ CORRETO
  } else {
    conteudo.style.marginLeft = "0";
    icone.textContent = "☰"; // muda para hambúrguer
    icone.classList.remove("menu-aberto");
    icone.classList.add("menu-fechado");
    icone.setAttribute("title", "Abrir menu"); // ✔ CORRETO
  }

  setTimeout(() => {
    conteudo.style.opacity = "1";
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const iconHeader = document.getElementById("icone-menu-header");
  const iconLateral = document.getElementById("icone-menu-lateral");

  if (iconHeader) {
    iconHeader.addEventListener("click", openMenu);
  }

  if (iconLateral) {
    iconLateral.addEventListener("click", openMenu);
  }
});
