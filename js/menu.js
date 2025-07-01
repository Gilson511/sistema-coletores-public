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
        iconHeader.addEventListener('click', () => {
            openMenu();
            // se abre o menu lateral 
           let conteudo =  document.querySelector('.conteudo-dashboard');
            conteudo.style.transition = 'all 0.3s ease';
            conteudo.style.marginLeft = '200px';
            conteudo.style.opacity = '0.8';

            setTimeout(()=> {
                conteudo.style.opacity = '1';
            },300)
          


        });

    }

    if (iconLateral) {

        iconLateral.addEventListener('click', () => {
            openMenu();
            // se fechar menu
            document.querySelector('.conteudo-dashboard').style.marginLeft = 0;
        });

    }
});


