/* ---------- Feature carousel ----------
   .feature-carousel holds .feature-slide children inside .carousel-track.
   Each slide is a whole feature (copy + image row). Prev/next and
   autoplay move between slides. Optional dot indicators are kept in
   sync if present. No dependencies. */
(function () {
    var AUTOPLAY_DELAY_MS = 5000;

    function initCarousel(root) {
        var track = root.querySelector('.carousel-track');
        var slides = track ? Array.prototype.slice.call(track.children) : [];
        if (!track || slides.length < 2) return; // nothing to page through

        var prevBtn = root.querySelector('.carousel-arrow.prev');
        var nextBtn = root.querySelector('.carousel-arrow.next');
        var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel-dot'));
        var index = 0;
        var timer = null;

        function render() {
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

if (nextBtn) nextBtn.addEventListener('click', next);
if (prevBtn) prevBtn.addEventListener('click', prev);

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
        });

        root.addEventListener('mouseenter', stopAutoplay);
        root.addEventListener('mouseleave', startAutoplay);

        render();
        startAutoplay();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var carousels = document.querySelectorAll('.feature-carousel');
        carousels.forEach(initCarousel);
    });
})();