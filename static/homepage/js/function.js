document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // INITIAL SETUP
    // =====================================

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Audio element references
    const popupSound = document.getElementById('popupSound'); // For menu and general link clicks
    const myAudio = document.getElementById('myAudio'); // For the equalizer music

    // Lucide Icons initialization
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // =====================================
    // CUSTOM CURSOR
    // =====================================
    // This effect is disabled on smaller screens for better performance.
    if (window.innerWidth > 768) {
        const cursorRing = document.createElement('div');
        cursorRing.classList.add('custom-cursor-ring');
        document.body.appendChild(cursorRing);

        const cursorDot = document.createElement('div');
        cursorDot.classList.add('custom-cursor-dot');
        document.body.appendChild(cursorDot);

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        const speed = 0.1;

        cursorRing.style.opacity = '1';
        cursorDot.style.opacity = '1';

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animate);
        }

        animate();

        const interactiveElements = document.querySelectorAll(
            'a, button, .project-card, .menu-bar-icon, .equalizer, .letsTalkButton-main, .svg-icon, .submit-btn'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    }

    // =====================================
    // SCROLL REVEAL ANIMATION
    // =====================================
    const revealElements = document.querySelectorAll('.reveal-item');
    if (revealElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // =====================================
    // FETCHING ICONS.SVG
    // =====================================
    fetch('icons.svg')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.insertBefore(div, document.body.firstChild);
        })
        .catch(error => {
            console.error("Error fetching icons.svg:", error);
        });

    // =====================================
    // AUDIO PLAYER (EQUALIZER ICON)
    // =====================================
    const equalizer = document.querySelector('.equalizer');
    if (myAudio && equalizer) {
        equalizer.addEventListener('click', () => {
            if (myAudio.paused) {
                myAudio.play()
                    .then(() => {
                        equalizer.classList.add('playing');
                    })
                    .catch(error => {
                        console.error("Autoplay failed:", error);
                    });
            } else {
                myAudio.pause();
                equalizer.classList.remove('playing');
            }
        });
    } else {
        console.warn("Audio player elements (#myAudio or .equalizer) not found. Audio functionality will not work.");
    }

    // =====================================
    // HAMBURGER ICON & POPUP MENU
    // =====================================
    const menuIcon = document.getElementById('menuIcon');
    const menuPopup = document.getElementById('menuPopup');
    const popupNavLinks = menuPopup ? menuPopup.querySelectorAll('ul li a') : [];

    if (menuIcon && menuPopup && popupSound) {
        menuIcon.addEventListener('click', () => {
            popupSound.currentTime = 0;
            popupSound.play().catch(error => console.error("Popup sound play failed:", error));
            menuIcon.classList.toggle('open');
            menuPopup.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        menuPopup.addEventListener('click', (event) => {
            if (event.target === menuPopup) {
                menuIcon.classList.remove('open');
                menuPopup.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    } else {
        console.error("Error: One or more menu elements not found (#menuIcon, #menuPopup, or #popupSound). Menu and popup functionality will not work.");
    }
    
    // Smooth scroll for popup navigation links
    if (popupNavLinks.length > 0 && menuIcon && menuPopup && popupSound) {
        popupNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    if (popupSound) {
                        popupSound.currentTime = 0;
                        popupSound.play().catch(error => console.error("Popup link click sound play failed:", error));
                    }
                    menuIcon.classList.remove('open');
                    menuPopup.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    } else {
        console.warn("No popup navigation links found or necessary elements missing for smooth scrolling.");
    }


    // =====================================
    // UNIVERSAL LINK HANDLING
    // =====================================
    
    // Generic smooth scroll for on-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Sound on all other link clicks
    const allLinks = document.querySelectorAll('a');
    if (popupSound && allLinks.length > 0) {
        allLinks.forEach(link => {
            if (link !== menuIcon && link.closest('.equalizer') === null) {
                link.addEventListener('click', (event) => {
                    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                        event.preventDefault(); 
                    }
                    popupSound.currentTime = 0;
                    popupSound.play().catch(error => console.error("General link click sound failed:", error));

                    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                        const targetId = link.getAttribute('href');
                        const targetSection = document.querySelector(targetId);
                        if (targetSection) {
                            if (menuIcon && menuPopup && menuPopup.classList.contains('open')) {
                                menuIcon.classList.remove('open');
                                menuPopup.classList.remove('open');
                                document.body.classList.remove('no-scroll');
                            }
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }
        });
    }


    // =====================================
    // TYPEWRITER EFFECT
    // =====================================
    const texts = [
        "I'm a Software Developer.",
        "I build things for the Web",
        "Innovating from idea to execution"
    ];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const pauseTime = 1500;
    const typewriterElement = document.getElementById("typewriter-text");

    if (typewriterElement) {
        function typeEffect() {
            const currentText = texts[index];
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            typewriterElement.textContent = currentText.substring(0, charIndex);

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeEffect, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(typeEffect, typingSpeed);
            } else {
                setTimeout(typeEffect, isDeleting ? typingSpeed / 2 : typingSpeed);
            }
        }
        typeEffect();
    }


    // =====================================
    // PROJECT CARDS SECTION
    // =====================================
    const projectCardsWrapper = document.querySelector('.project-cards-wrapper');

    // --- 1. Project Cards Wrapper: Horizontal Scrolling ---
    if (projectCardsWrapper) {
        // a) For Mouse Wheel & Touchpad
        projectCardsWrapper.addEventListener('wheel', (event) => {
            event.preventDefault();
            projectCardsWrapper.scrollLeft += event.deltaY;
        });

        // b) For Touchscreen Dragging
        if (isTouchDevice) {
            let isDown = false;
            let startX;
            let scrollLeft;

            projectCardsWrapper.addEventListener('touchstart', (e) => {
                isDown = true;
                projectCardsWrapper.classList.add('active');
                startX = e.touches[0].pageX - projectCardsWrapper.offsetLeft;
                scrollLeft = projectCardsWrapper.scrollLeft;
            });
            projectCardsWrapper.addEventListener('mouseleave', () => {
                isDown = false;
                projectCardsWrapper.classList.remove('active');
            });
            projectCardsWrapper.addEventListener('mouseup', () => { // Note: mouseup for completeness
                isDown = false;
                projectCardsWrapper.classList.remove('active');
            });
            projectCardsWrapper.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.touches[0].pageX - projectCardsWrapper.offsetLeft;
                const walk = (x - startX) * 2;
                projectCardsWrapper.scrollLeft = scrollLeft - walk;
            });
        }
    }

    // --- 2. Project Cards: 3D Hover & Glow Effect ---
    if (!isTouchDevice) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            let bounds;
            function rotateToMouse(e) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const leftX = mouseX - bounds.left;
                const topY = mouseY - bounds.top;
                const center = {
                    x: leftX - bounds.width / 2,
                    y: topY - bounds.height / 2
                };
                const rotateX = Math.max(-15, Math.min(15, center.y / 10));
                const rotateY = Math.max(-15, Math.min(15, -center.x / 10));

                card.style.transform = `perspective(1000px) scale3d(1.05, 1.05, 1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                const glow = card.querySelector('.glow');
                if (glow) {
                    glow.style.backgroundImage = `radial-gradient(circle at ${leftX}px ${topY}px, #ffffff44, #0000000f)`;
                }
            }

            card.addEventListener('mouseenter', () => {
                bounds = card.getBoundingClientRect();
                document.addEventListener('mousemove', rotateToMouse);
            });
            card.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', rotateToMouse);
                card.style.transform = '';
                const glow = card.querySelector('.glow');
                if (glow) glow.style.backgroundImage = '';
            });
        });
    }

    // --- 3. Project Cards: Scroll-based Animations (Scale/Opacity) ---
    if (projectCardsWrapper) {
        const cards = projectCardsWrapper.querySelectorAll('.project-card');
        const animateCardsOnScroll = () => {
            cards.forEach(card => {
                const cardLeft = card.getBoundingClientRect().left;
                const screenWidth = window.innerWidth;
                if (cardLeft < screenWidth && cardLeft > -card.offsetWidth) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0.7';
                    card.style.transform = 'scale(0.9)';
                }
            });
        };
        projectCardsWrapper.addEventListener('scroll', animateCardsOnScroll);
        animateCardsOnScroll(); // Initial check
    }

    // =====================================
    // GLOBAL SCROLLING TEXT EFFECT
    // =====================================
    const topText = document.getElementById("topText");
    const bottomText = document.getElementById("bottomText");

    if (topText && bottomText) {
        let topOffset = 0;
        let bottomOffset = 0;
        let scrollVelocity = 0;
        const baseSpeed = 0.6;

        bottomOffset = -bottomText.offsetWidth / 2;
        bottomText.style.transform = `translateX(${bottomOffset}px)`;
        topText.style.transform = `translateX(${topOffset}px)`;

        function animateText() {
            topOffset -= scrollVelocity * baseSpeed;
            bottomOffset += scrollVelocity * baseSpeed;
            const topWidth = topText.offsetWidth / 2;
            const bottomWidth = bottomText.offsetWidth / 2;

            if (topOffset < -topWidth) topOffset += topWidth;
            if (topOffset > 0) topOffset -= topWidth;
            if (bottomOffset > 0) bottomOffset -= bottomWidth;
            if (bottomOffset < -bottomWidth) bottomOffset += bottomWidth;

            topText.style.transform = `translateX(${topOffset}px)`;
            bottomText.style.transform = `translateX(${bottomOffset}px)`;
            scrollVelocity *= 0.9;
            requestAnimationFrame(animateText);
        }
        animateText();

        window.addEventListener("wheel", (e) => {
            if (e.target.closest('.project-cards-wrapper')) return;
            scrollVelocity += e.deltaY * 0.1;
        });

        let touchStartY = 0;
        window.addEventListener("touchstart", (e) => {
            if (e.target.closest('.project-cards-wrapper')) return;
            touchStartY = e.touches[0].clientY;
        });
        window.addEventListener("touchmove", (e) => {
            if (e.target.closest('.project-cards-wrapper')) return;
            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            scrollVelocity += deltaY * 0.4;
            touchStartY = touchEndY;
        });
    }

    // =====================================
    // CONTACT FORM (AJAX SUBMISSION)
    // =====================================

    // Function to display toast messages
    function showToast(message, status = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = 'toast show';
            if (status === 'error') {
                toast.classList.add('error');
            }
            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const csrfToken = contactForm.querySelector('[name=csrfmiddlewaretoken]').value;
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showToast(data.message, 'success');
                    contactForm.reset();
                    submitBtn.innerHTML = '<span>Sent!</span><span class="arrow">&check;</span>';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnHTML;
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    showToast(data.message, 'error');
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An unexpected error occurred.', 'error');
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            });
        });
    }

}); // End of DOMContentLoaded