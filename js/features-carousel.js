/* ---------- Feature carousel ----------
   .feature-carousel holds .feature-slide children inside .carousel-track.
   Each slide is a whole feature (copy + image row). Prev/next and
   autoplay move between slides. Optional dot indicators are kept in
   sync if present. No dependencies. */
(function () {
    var AUTOPLAY_DELAY_MS = 4500;

    function initCarousel(root) {
        var viewport = root.querySelector('.carousel-viewport');
        var track = root.querySelector('.carousel-track');
        var slides = track ? Array.prototype.slice.call(track.children) : [];
        if (!track || slides.length < 2) return; // nothing to page through

        var prevBtn = root.querySelector('.carousel-arrow.prev');
        var nextBtn = root.querySelector('.carousel-arrow.next');
        var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel-dot'));
        var index = 0;
        var timer = null;

        function render() {
            track.style.transition = '';
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        function goTo(newIndex) {
            index = (newIndex + slides.length) % slides.length;
            render();
        }

        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        function startAutoplay() {
            stopAutoplay();
            timer = window.setInterval(next, AUTOPLAY_DELAY_MS);
        }

        function stopAutoplay() {
            if (timer) window.clearInterval(timer);
        }

        // Just change the slide — don't restart autoplay here. If the
        // mouse is still over the carousel (which it is, since these
        // buttons are inside it), autoplay stays paused until mouseleave.
        if (nextBtn) nextBtn.addEventListener('click', next);
        if (prevBtn) prevBtn.addEventListener('click', prev);

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
        });

        root.addEventListener('mouseenter', stopAutoplay);
        root.addEventListener('mouseleave', startAutoplay);

        // ---------- Drag / swipe (mouse and touch, via Pointer Events) ----------
        var DRAG_THRESHOLD_PX = 60;
        var dragging = false;
        var dragStartX = 0;
        var dragDeltaX = 0;
        var pointerId = null;

        function onPointerDown(e) {
            dragging = true;
            pointerId = e.pointerId;
            dragStartX = e.clientX;
            dragDeltaX = 0;
            stopAutoplay();
            track.style.transition = 'none'; // follow the pointer with no easing lag
            viewport.setPointerCapture(pointerId);
        }

        function onPointerMove(e) {
            if (!dragging) return;
            dragDeltaX = e.clientX - dragStartX;
            var viewportWidth = viewport.offsetWidth;
            var basePx = -index * viewportWidth;
            track.style.transform = 'translateX(' + (basePx + dragDeltaX) + 'px)';
        }

        function onPointerUp() {
            if (!dragging) return;
            dragging = false;
            if (pointerId !== null) {
                try { viewport.releasePointerCapture(pointerId); } catch (err) { /* already released */ }
            }
            track.style.transition = ''; // restore the CSS transition for the snap/settle
            if (dragDeltaX <= -DRAG_THRESHOLD_PX) {
                next();
            } else if (dragDeltaX >= DRAG_THRESHOLD_PX) {
                prev();
            } else {
                render(); // not far enough — snap back to the current slide
            }
            dragDeltaX = 0;
            startAutoplay();
        }

        viewport.addEventListener('pointerdown', onPointerDown);
        viewport.addEventListener('pointermove', onPointerMove);
        viewport.addEventListener('pointerup', onPointerUp);
        viewport.addEventListener('pointercancel', onPointerUp);

        render();
        startAutoplay();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var carousels = document.querySelectorAll('.feature-carousel');
        carousels.forEach(initCarousel);
    });
})();