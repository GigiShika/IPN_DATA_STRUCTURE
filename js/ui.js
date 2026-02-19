document.addEventListener("DOMContentLoaded", function () {

    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {

        const button = dropdown.querySelector(".dropdown-btn");
        const content = dropdown.querySelector(".dropdown-content");

        button.addEventListener("click", function () {

            // Cerrar todos menos el actual
            dropdowns.forEach(item => {
                if (item !== dropdown) {
                    const c = item.querySelector(".dropdown-content");
                    c.style.height = "0px";  // fuerza altura 0
                    item.classList.remove("active");
                }
            });

            // Alternar el actual
            if (dropdown.classList.contains("active")) {
                // cerrar
                content.style.height = content.scrollHeight + "px"; // fuerza valor actual
                requestAnimationFrame(() => {
                    content.style.height = "0px";
                });
                dropdown.classList.remove("active");
            } else {
                // abrir
                content.style.height = content.scrollHeight + "px";
                dropdown.classList.add("active");
                content.addEventListener(
                    "transitionend",
                    () => {
                        content.style.height = "auto"; // deja que crezca naturalmente
                    },
                    { once: true }
                );
            }

        });

    });

    const toggle = document.getElementById("toggleTheme");
    if(toggle) {
        toggle.addEventListener("change", () => {
            document.body.classList.toggle("light-mode");
        });
    }

});
