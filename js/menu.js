// Função para abrir/fechar o menu lateral com transição suave
function openMenu() {
  const menu = document.querySelector('.menu-lateral');
  menu.classList.toggle('ativo');
}

// Eventos para os dois ícones de menu, se existirem
document.addEventListener('DOMContentLoaded', () => {
  const iconHeader = document.getElementById('icone-menu-header');
  const iconLateral = document.getElementById('icone-menu-lateral');

  if (iconHeader) {
    iconHeader.addEventListener('click', openMenu);
  }

  if (iconLateral) {
    iconLateral.addEventListener('click', openMenu);
  }
});
