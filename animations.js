// URL de la segunda página
const SECOND_PAGE_URL = 'felicitaciones.html';

// ----------------------------------------------------
// 1. CONTROL DE INICIO Y NAVEGACIÓN GENERAL (index.html a felicitaciones.html)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');

    if (startButton) {
        startButton.addEventListener('click', function() {
            const card = document.getElementById('introCard');
            // 1. Añade la clase para la animación de salida (encogerse)
            card.classList.add('scale-out');

            // 2. Espera 500ms para que la animación termine antes de navegar
            setTimeout(() => {
                window.location.href = SECOND_PAGE_URL;
            }, 500); 
        });
    }

    // Si estamos en la página de felicitaciones, iniciamos todas las animaciones
    if (window.location.pathname.includes(SECOND_PAGE_URL)) {
        initCelebrationAnimations(); // <-- Llama al confeti
        initCarouselSnapLogic();    // <-- Llama al resaltado de tarjetas
        initCarouselNavigation();   // <-- Llama a la navegación con botones
    }
});


// ----------------------------------------------------
// 2. LÓGICA DE CELEBRACIÓN (Confeti)
// ----------------------------------------------------

function initCelebrationAnimations() {
    generateConfetti(50);
}

function generateConfetti(count) {
    const container = document.getElementById('confetti-container');
    // Colores vibrantes y festivos
    const colors = [
        '#FFC0CB', // Rosa pastel
        '#FFD700', // Dorado vibrante
        '#87CEEB', // Azul cielo
        '#90EE90', // Verde menta
        '#FFA07A', // Naranja suave
        '#EE82EE', // Violeta claro
        '#FFFFFF'  // Blanco clásico
    ];

    if (!container) return;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        
        const size = Math.random() * 10 + 5; 
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}vw`; 
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`; 
        confetti.style.animationDelay = `${Math.random() * 5}s`; 
        // confetti.style.opacity = Math.random() * 0.8 + 0.2;
        confetti.style.opacity = Math.random() * 0.3 + 0.7; // Más opaco (0.7 a 1)

        const styleSheet = document.styleSheets[0];
        const keyframesName = `fall-${i}`;
        
        const keyframes = `@keyframes ${keyframesName} {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: ${confetti.style.opacity}; }
            100% { transform: translateY(100vh) rotate(${Math.random() * 360}deg); opacity: 0.2; }
        }`;
        
        if (styleSheet) {
            try {
                // Insertamos las keyframes de la animación de caída dinámica
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            } catch (e) {
                // En caso de error (por ejemplo, CORS), la página sigue funcionando
            }
        }

        confetti.style.animationName = keyframesName;
        confetti.style.animationIterationCount = 'infinite';
        confetti.style.position = 'fixed';
        confetti.style.top = `${-size}px`; 

        container.appendChild(confetti);
    }
}


// ----------------------------------------------------
// 3. LÓGICA DE RESALTADO DEL CARRUSEL (felicitaciones.html)
// ----------------------------------------------------

function initCarouselSnapLogic() {
    const carousel = document.getElementById('messageCarousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    
    const updateActiveItem = () => {
        const observerOptions = {
            root: carousel,
            threshold: 0.7 
        };

        const activeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.7) {
                        items.forEach(item => item.classList.remove('active'));
                        entry.target.classList.add('active');
                    }
                } 
            });
        }, observerOptions);

        items.forEach(item => {
            activeObserver.observe(item);
        });

        // Aseguramos que el primer elemento inicie activo
        if (items.length > 0) {
            items[0].classList.add('active');
        }
    };
    
    updateActiveItem();

    // Re-evaluar después del scroll (para el scroll-snap)
    carousel.addEventListener('scroll', () => {
        setTimeout(updateActiveItem, 100); 
    });
}


// ----------------------------------------------------
// 4. LÓGICA DE NAVEGACIÓN CON BOTONES (Anterior/Siguiente)
// ----------------------------------------------------

function initCarouselNavigation() {
    const carousel = document.getElementById('messageCarousel');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const items = carousel.querySelectorAll('.carousel-item');

    if (!carousel || !prevButton || !nextButton || items.length === 0) return;

    // Calculamos el ancho del primer ítem (incluyendo márgenes)
    const itemWidth = items[0].offsetWidth + 
                      parseFloat(window.getComputedStyle(items[0]).marginRight) + 
                      parseFloat(window.getComputedStyle(items[0]).marginLeft);


    nextButton.addEventListener('click', () => {
        carousel.scrollBy({
            left: itemWidth, // Mover hacia adelante
            behavior: 'smooth'
        });
    });

    prevButton.addEventListener('click', () => {
        carousel.scrollBy({
            left: -itemWidth, // Mover hacia atrás
            behavior: 'smooth'
        });
    });
}