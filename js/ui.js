// =============================
// DROPDOWN FUNCIONAL UPIICSA
// =============================

document.addEventListener("DOMContentLoaded", function () {

    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {

        const button = dropdown.querySelector(".dropdown-btn");

        button.addEventListener("click", function () {

            // Cerrar todos menos el actual
            dropdowns.forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove("active");
                }
            });

            // Alternar el actual
            dropdown.classList.toggle("active");

        });

    });

});

const toggle = document.getElementById("toggleTheme");

toggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
});

