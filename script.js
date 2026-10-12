/* ================================================
   LENSQUEEN — Luxury Hotel Portfolio Scripts
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.classList.add('loaded');
        }, 2200);
    });

    // Fallback: hide preloader after 4 seconds max
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('loaded');
    }, 4000);

    // ---- Custom Cursor ----
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .video-card, .video-play-overlay, .video-lightbox-close, .video-lightbox-nav, .pillar-card, .feature-item, .client-placeholder');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    } else {
        // Hide custom cursor on touch devices
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    // ---- Navbar ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinkElements.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // ---- Hero Background Slider ----
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function nextHeroSlide() {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }

    setInterval(nextHeroSlide, 6000);

    // ---- Stat Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;
        
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    stat.textContent = current;
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target;
                    }
                }
                requestAnimationFrame(updateCount);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    // Trigger once on load in case already visible
    setTimeout(animateCounters, 2500);

    // ---- Gallery Lightbox ----
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    const galleryData = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const category = item.querySelector('.gallery-category');
        const title = item.querySelector('.gallery-title');

        galleryData.push({
            src: img.src,
            category: category ? category.textContent : '',
            title: title ? title.textContent : ''
        });

        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        lightboxImage.src = galleryData[index].src;
        lightboxCategory.textContent = galleryData[index].category;
        lightboxTitle.textContent = galleryData[index].title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
        openLightbox(currentImageIndex);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryData.length;
        openLightbox(currentImageIndex);
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
            openLightbox(currentImageIndex);
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % galleryData.length;
            openLightbox(currentImageIndex);
        }
    });

    // ---- Video Cinema Lightbox (Look Wise Modal) ----
    const filmsData = [
        {
            src: 'Assets/Videos/Spa g.mp4',
            tag: 'Luxury Wellness & Spa',
            title: 'The Spa Experience',
            desc: 'A calming, sensory film directed through my lens — capturing tranquil waters, serene treatment spaces, and the restorative atmosphere of luxury wellness.'
        },
        {
            src: 'Assets/Videos/Eg (1).mp4',
            tag: 'Novotel Suites & Spaces',
            title: 'Presidential Suite & Grand Reception — Novotel',
            desc: 'Captured for Novotel during my 4+ year creative partnership — architectural elegance, premium guest accommodations, and warm hospitality in high dynamic range.'
        },
        {
            src: 'Assets/Videos/Eg (2).mp4',
            tag: 'Culinary Festival',
            title: 'Dim Sum Gastronomy Festival',
            desc: 'Intricate handcrafted artistry and rising aromatic steam captured in pure culinary motion through my lens.'
        },
        {
            src: 'Assets/Videos/Eg (3).mp4',
            tag: 'Live Fire Artistry',
            title: 'Teppanyaki Live Fire Art',
            desc: 'High-heat culinary theatrics, vibrant flames, and precision searing on the teppan surface captured in dynamic cinematography.'
        },
        {
            src: 'Assets/Videos/Eg (4).mp4',
            tag: 'Fine Dining Craft',
            title: 'Gourmet Plating & Flavours',
            desc: 'Meticulous chef craftsmanship, vibrant ingredients, and refined sauce finishing touches captured in macro focus.'
        }
    ];

    const videoLightbox = document.getElementById('videoLightbox');
    const videoLightboxPlayer = document.getElementById('videoLightboxPlayer');
    const videoLightboxClose = document.getElementById('videoLightboxClose');
    const videoLightboxBackdrop = document.getElementById('videoLightboxBackdrop');
    const videoLightboxPrev = document.getElementById('videoLightboxPrev');
    const videoLightboxNext = document.getElementById('videoLightboxNext');
    const videoLightboxTag = document.getElementById('videoLightboxTag');
    const videoLightboxTitle = document.getElementById('videoLightboxTitle');
    const videoLightboxDesc = document.getElementById('videoLightboxDesc');
    let currentFilmIndex = 0;

    function openFilm(index) {
        currentFilmIndex = index;
        const film = filmsData[currentFilmIndex];
        if (!film || !videoLightbox || !videoLightboxPlayer) return;

        if (videoLightboxTag) videoLightboxTag.textContent = film.tag;
        if (videoLightboxTitle) videoLightboxTitle.textContent = film.title;
        if (videoLightboxDesc) videoLightboxDesc.textContent = film.desc;

        // Pause any background inline videos
        document.querySelectorAll('video').forEach(v => {
            if (v !== videoLightboxPlayer) v.pause();
        });

        // Set video src and load
        videoLightboxPlayer.src = film.src;
        videoLightboxPlayer.load();

        videoLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        const playPromise = videoLightboxPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay policy handled gracefully
            });
        }
    }

    function closeFilm() {
        if (!videoLightbox) return;
        videoLightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (videoLightboxPlayer) {
            videoLightboxPlayer.pause();
            videoLightboxPlayer.removeAttribute('src');
            videoLightboxPlayer.load();
        }
    }

    // Attach click events to video cards
    document.querySelectorAll('.video-card').forEach((card) => {
        card.addEventListener('click', () => {
            const filmIdx = parseInt(card.getAttribute('data-film-index') || '0', 10);
            openFilm(filmIdx);
        });
    });

    if (videoLightboxClose) videoLightboxClose.addEventListener('click', closeFilm);
    if (videoLightboxBackdrop) videoLightboxBackdrop.addEventListener('click', closeFilm);

    if (videoLightboxPrev) {
        videoLightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentFilmIndex = (currentFilmIndex - 1 + filmsData.length) % filmsData.length;
            openFilm(currentFilmIndex);
        });
    }

    if (videoLightboxNext) {
        videoLightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentFilmIndex = (currentFilmIndex + 1) % filmsData.length;
            openFilm(currentFilmIndex);
        });
    }

    // Keyboard controls for video cinema lightbox
    document.addEventListener('keydown', (e) => {
        if (!videoLightbox || !videoLightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeFilm();
        if (e.key === 'ArrowLeft') {
            currentFilmIndex = (currentFilmIndex - 1 + filmsData.length) % filmsData.length;
            openFilm(currentFilmIndex);
        }
        if (e.key === 'ArrowRight') {
            currentFilmIndex = (currentFilmIndex + 1) % filmsData.length;
            openFilm(currentFilmIndex);
        }
    });

    // ---- Scroll Reveal ----
    const revealElements = [
        ...document.querySelectorAll('.about-visual'),
        ...document.querySelectorAll('.about-content'),
        ...document.querySelectorAll('.gallery-item'),
        ...document.querySelectorAll('.video-card'),
        ...document.querySelectorAll('.pillar-card'),
        ...document.querySelectorAll('.client-card'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.external-video-card'),
        ...document.querySelectorAll('.contact-content'),
        ...document.querySelectorAll('.about-note'),
        ...document.querySelectorAll('.about-features'),
    ];

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        revealObserver.observe(el);
    });

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const top = target.offsetTop - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Parallax Effect (subtle) ----
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Brand section parallax
        const brandBg = document.querySelector('.brand-bg-parallax');
        if (brandBg) {
            const brandSection = document.querySelector('.brand-section');
            const brandRect = brandSection.getBoundingClientRect();
            if (brandRect.top < window.innerHeight && brandRect.bottom > 0) {
                brandBg.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }
    });

});
