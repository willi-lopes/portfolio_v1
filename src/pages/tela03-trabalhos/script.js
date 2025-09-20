events.on('ready', function() {
    document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".gallery .item");

    items.forEach(item => {
        item.addEventListener("click", () => {
        // Se já estiver ativo, fecha
        if (item.classList.contains("active")) {
            item.classList.remove("active");
            return;
        }

        // Fecha os outros
        items.forEach(i => i.classList.remove("active"));

        // Abre o clicado
        item.classList.add("active");
        });
    });
    });

});