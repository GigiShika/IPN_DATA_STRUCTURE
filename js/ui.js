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

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleButton && navLinks) {
        toggleButton.addEventListener('click', function () {
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

(function () {
    var scale = 1, posX = 0, posY = 0;
    var isDragging = false, startX, startY, lastX, lastY;
    var lastDist = null;
    var MIN_SCALE = 1, MAX_SCALE = 5;

    var overlay = document.getElementById('lbOverlay');
    var lbImg = document.getElementById('lbImg');

    function applyTransform() {
        lbImg.style.transform = 'translate(' + posX + 'px, ' + posY + 'px) scale(' + scale + ')';
    }

    function resetZoom() {
        scale = 1; posX = 0; posY = 0;
        lbImg.classList.remove('zoomed', 'dragging');
        applyTransform();
    }

    // ── Open ──────────────────────────────────────────
    document.querySelectorAll('.img-card').forEach(function (card) {
        var img = card.querySelector('img');
        if (!img) return;

        var btn = document.createElement('button');
        btn.className = 'img-zoom-btn';
        btn.title = 'Ver en pantalla completa';
        btn.innerHTML = '&#x26F6;';
        btn.setAttribute('aria-label', 'Ver en pantalla completa');
        card.appendChild(btn);

        function openFullscreen() {
            var captionEl = card.querySelector('.img-caption');
            var lbCap = document.getElementById('lbCaption');

            resetZoom();
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            var capText = captionEl
                ? captionEl.textContent.replace(/^[\u25b8\s]+/, '').trim()
                : '';
            lbCap.textContent = capText;
            lbCap.style.display = capText ? 'block' : 'none';

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (overlay.requestFullscreen) overlay.requestFullscreen();
            else if (overlay.webkitRequestFullscreen) overlay.webkitRequestFullscreen();
            else if (overlay.mozRequestFullScreen) overlay.mozRequestFullScreen();

            // Show hint briefly
            var hint = document.getElementById('lbZoomHint');
            hint.style.opacity = '1';
            setTimeout(function () { hint.style.opacity = '0'; }, 2200);
        }

        btn.addEventListener('click', function (e) { e.stopPropagation(); openFullscreen(); });
        img.addEventListener('dblclick', openFullscreen);
    });

    // ── Close ─────────────────────────────────────────
    function closeLb() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        resetZoom();
        if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
        else if (document.webkitExitFullscreen && document.webkitFullscreenElement) document.webkitExitFullscreen();
    }

    document.addEventListener('fullscreenchange', function () {
        if (!document.fullscreenElement) { overlay.classList.remove('active'); document.body.style.overflow = ''; resetZoom(); }
    });
    document.addEventListener('webkitfullscreenchange', function () {
        if (!document.webkitFullscreenElement) { overlay.classList.remove('active'); document.body.style.overflow = ''; resetZoom(); }
    });

    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

    // ── Click overlay background to close (only when not zoomed) ──
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay && scale === 1) closeLb();
    });

    // ── Scroll wheel zoom ──────────────────────────────
    lbImg.addEventListener('wheel', function (e) {
        e.preventDefault();
        var delta = e.deltaY > 0 ? -0.15 : 0.15;
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
        if (scale === 1) { posX = 0; posY = 0; }
        lbImg.classList.toggle('zoomed', scale > 1);
        applyTransform();
    }, { passive: false });

    // ── Click to toggle zoom (2× / reset) ─────────────
    lbImg.addEventListener('click', function (e) {
        if (isDragging) return;
        if (scale > 1) {
            scale = 1; posX = 0; posY = 0;
            lbImg.classList.remove('zoomed');
        } else {
            scale = 2.5;
            lbImg.classList.add('zoomed');
        }
        applyTransform();
    });

    // ── Mouse drag (pan when zoomed) ───────────────────
    lbImg.addEventListener('mousedown', function (e) {
        if (scale <= 1) return;
        isDragging = false;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
        lastX = e.clientX; lastY = e.clientY;
        lbImg.classList.add('dragging');

        function onMove(e) {
            if (Math.abs(e.clientX - lastX) > 2 || Math.abs(e.clientY - lastY) > 2) isDragging = true;
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            applyTransform();
        }
        function onUp() {
            lbImg.classList.remove('dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            setTimeout(function () { isDragging = false; }, 50);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });

    // ── Touch: pinch-to-zoom + pan ─────────────────────
    var touchStartScale = 1, touchStartX, touchStartY, touchStartPosX, touchStartPosY;

    lbImg.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
            lastDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            touchStartScale = scale;
        } else if (e.touches.length === 1 && scale > 1) {
            touchStartX = e.touches[0].clientX - posX;
            touchStartY = e.touches[0].clientY - posY;
        }
    }, { passive: true });

    lbImg.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (e.touches.length === 2) {
            var dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, touchStartScale * (dist / lastDist)));
            if (scale === 1) { posX = 0; posY = 0; }
            lbImg.classList.toggle('zoomed', scale > 1);
            applyTransform();
        } else if (e.touches.length === 1 && scale > 1) {
            posX = e.touches[0].clientX - touchStartX;
            posY = e.touches[0].clientY - touchStartY;
            applyTransform();
        }
    }, { passive: false });

    // Double-tap to zoom on touch
    var lastTap = 0;
    lbImg.addEventListener('touchend', function (e) {
        var now = Date.now();
        if (now - lastTap < 300) {
            if (scale > 1) { scale = 1; posX = 0; posY = 0; lbImg.classList.remove('zoomed'); }
            else { scale = 2.5; lbImg.classList.add('zoomed'); }
            applyTransform();
        }
        lastTap = now;
        lastDist = null;
    });
})();
(function () {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;

    const iconSpan = toggleBtn.querySelector('span:first-child');
    const textSpan = toggleBtn.querySelector('span:last-child');

    // Verificar preferencia guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (iconSpan) iconSpan.textContent = '☀️';
        if (textSpan) textSpan.textContent = ' Modo claro';
    } else {
        document.body.classList.remove('dark-mode');
        if (iconSpan) iconSpan.textContent = '🌙';
        if (textSpan) textSpan.textContent = ' Modo oscuro';
    }

    // Evento toggle
    toggleBtn.addEventListener('click', function () {
        const nowDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', nowDark);
        if (iconSpan && textSpan) {
            if (nowDark) {
                iconSpan.textContent = '☀️';
                textSpan.textContent = ' Modo claro';
            } else {
                iconSpan.textContent = '🌙';
                textSpan.textContent = ' Modo oscuro';
            }
        }
    });
})();