document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".dropdown-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            const dropdown = btn.parentElement;
            const content = dropdown.querySelector(".dropdown-content");

            const isOpen = content.style.maxHeight;

            // Cerrar todos
            document.querySelectorAll(".dropdown-content").forEach(el => {
                el.style.maxHeight = null;
            });

            // Abrir el seleccionado si estaba cerrado
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
            }

        });
    });

});

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggleButton && navLinks) {
        toggleButton.addEventListener('click', function() {
            // Alternar visibilidad del menú
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('hidden');
            
            // Agregar la clase de fondo cuando está visible
            if (navLinks.classList.contains('flex')) {
                navLinks.classList.add('mobile-nav-bg');
            } else {
                navLinks.classList.remove('mobile-nav-bg');
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('flex')) {
                navLinks.classList.remove('flex', 'mobile-nav-bg');
                navLinks.classList.add('hidden');
            }
        });
    });
    
    // En desktop, eliminar estilos móviles
    function handleResize() {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('hidden', 'flex', 'mobile-nav-bg', 'flex-col');
            navLinks.classList.add('flex', 'justify-center', 'gap-[10px]', 'relative');
        } else if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('flex')) {
            navLinks.classList.add('mobile-nav-bg');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
});
