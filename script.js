
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. DICHIARAZIONE VARIABILI GLOBALI (Prendi gli elementi una volta sola) ---
    const cursor = document.getElementById('cursor-effect');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav-menu');
    const spawnContainer = document.getElementById('spawn-container');
    const gallery = document.querySelector('.col-gallery');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const projectItems = document.querySelectorAll('.project-item'); // Per lo spawn dei progetti
    const hoverContainer = document.getElementById('hover-container'); // Per le immagini floating
    const galleryCol = document.querySelector('.col-gallery');
    const textCol = document.querySelector('.col-text');

    // --- 1. MOVIMENTO CURSORE (Unificato) ---
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                // Parallax per immagini floating (se presenti)
                const floatingImgs = document.querySelectorAll('.floating-img');
                floatingImgs.forEach((img, i) => {
                    const ratio = (i + 1) * 0.012;
                    const moveX = (window.innerWidth / 2 - e.clientX) * ratio;
                    const moveY = (window.innerHeight / 2 - e.clientY) * ratio;
                    img.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(${img.dataset.rotation}deg)`;
                });
            });
        });

        // Hover effetti sui link della Hero
        document.querySelectorAll('.hero-link').forEach(link => {
            link.addEventListener('mouseenter', () => cursor.classList.add('cursor-hero'));
            link.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hero'));
        });
    }

    // --- 2. BURGER MENU ---
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }

    // --- 3. SPAWN IMMAGINI (INDEX/HOME) ---
    if (spawnContainer) {
        const imagesList = [
            'links/dumbo.webp', 'links/guerrilla.webp', 'links/costa copta.webp', 
            'links/35x70NonIstituzionale.webp', 'links/appbernina3.webp', 
            'links/artifacts.webp', 'links/copertineimpilate2.webp', 
            'links/DSC_1652.webp', 'links/DSC_9115-2.webp', 'links/DSC08061.webp'
            // ... aggiungi le altre qui
        ];

        let imgIndex = 0;
        let lastMousePos = { x: 0, y: 0 };
        const pixelsPerSpawn = 80;

        window.addEventListener('mousemove', (e) => {
            const dist = Math.hypot(e.clientX - lastMousePos.x, e.clientY - lastMousePos.y);
            if (dist > pixelsPerSpawn) {
                spawnImageAtMouse(e.clientX, e.clientY);
                lastMousePos = { x: e.clientX, y: e.clientY };
            }
        });

        function spawnImageAtMouse(x, y) {
            const imgElement = document.createElement('img');
            imgElement.src = imagesList[imgIndex];
            imgElement.className = 'spawned-img';
            imgElement.style.left = `${x}px`;
            imgElement.style.top = `${y}px`;

            const randomRotation = (Math.random() - 0.5) * 15;
            spawnContainer.appendChild(imgElement);
            imgIndex = (imgIndex + 1) % imagesList.length;

            requestAnimationFrame(() => {
                imgElement.classList.add('visible');
                imgElement.style.transform = `translate(-50%, -50%) scale(1) rotate(${randomRotation}deg)`;
            });

            setTimeout(() => { 
                imgElement.style.opacity = '0'; 
            }, 800);

            setTimeout(() => { 
                imgElement.remove(); 
            }, 1500);
        }
    }

    // SPAWN IMMAGINI PROGETTI 
        // Creiamo un oggetto per memorizzare le immagini già caricate
        const preloadedImages = {};

        function preloadProjectImages() {
            projectItems.forEach(item => {
                const sources = item.getAttribute('data-images').split(',');
                const id = item.innerText.trim(); // Usiamo il nome come chiave
                preloadedImages[id] = [];

                sources.forEach(src => {
                    const img = new Image(); // Crea oggetto immagine in memoria
                    img.src = src.trim();
                    preloadedImages[id].push(img); // Il browser la scarica ora
                });
            });
        }
        // Avviamo il preload al caricamento della pagina
        window.addEventListener('load', preloadProjectImages);

        // movimento cursore e parallax
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                const images = document.querySelectorAll('.floating-img');
                images.forEach((img, i) => {
                    const ratio = (i + 1) * 0.012; // Parallax leggermente più sottile
                    const moveX = (window.innerWidth / 2 - e.clientX) * ratio;
                    const moveY = (window.innerHeight / 2 - e.clientY) * ratio;
                    img.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(${img.dataset.rotation}deg)`;
                });
            });
        });
        // eventi hover
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const id = item.innerText.trim();
                const sources = item.getAttribute('data-images').split(',');
                hoverContainer.innerHTML = ''; 
                
                const rect = item.getBoundingClientRect();
                const centerY = rect.top + (rect.height / 2);
                const slotsX = [31, 43, 56, 70];

                sources.forEach((src, index) => {
                    if (index < slotsX.length) {
                        const img = document.createElement('img');
                        img.src = src.trim();
                        img.className = 'floating-img';

                        const rotation = (index % 2 === 0) ? -4 : 4;
                        img.dataset.rotation = rotation; // Salviamo la rotazione per il parallax

                        img.style.left = `${slotsX[index]}%`;
                        img.style.top = `${centerY + (index % 2 === 0 ? -15 : 15)}px`;
                        
                        // Applichiamo la trasformazione iniziale
                        img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                        
                        hoverContainer.appendChild(img);
                    }
                });

                hoverContainer.style.opacity = '1';
            });

            item.addEventListener('mouseleave', () => {
                hoverContainer.style.opacity = '0';
            });
        });


    // --- 4. BARRA SCROLL (PAGINE PROGETTO) ---
    if (gallery && progressBar) {
        gallery.addEventListener('scroll', () => {
            const scrollHeight = gallery.scrollHeight - gallery.clientHeight;
            const scrollTop = gallery.scrollTop;
            let scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.height = (scrollPercent < 5 ? 5 : scrollPercent) + "%";
        });
    }
 // Funzione generica per calcolare lo scroll
function updateScroll(element) {
    if (!element || !progressBar) return;
    
    element.addEventListener('scroll', () => {
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const scrollTop = element.scrollTop;
        let scrollPercent = (scrollTop / scrollHeight) * 100;
        
        // Applica il progresso (minimo 15px per visibilità)
        progressBar.style.height = scrollPercent < 5 ? "15px" : scrollPercent + "%";
    });
}

// Attiva sulla colonna che trova nella pagina attuale
updateScroll(galleryCol);
updateScroll(textCol);


    // --- 5. COLORAZIONE IMG x MOBILE (Intersection Observer) ---
const elementsToWatch = document.querySelectorAll('.project-detail-container img, .project-detail-container video, .vimeo-container, .css-gif, .col-image, .fixed-img');

const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -25% 0px', 
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active-mobile');
        } else {
            entry.target.classList.remove('active-mobile');
        }
    });
}, observerOptions);

elementsToWatch.forEach(el => observer.observe(el));

    // --- 6. VIDEO PLAYER (Vimeo & HTML5) ---
    const vimeoIframe = document.querySelector('#vimeo-player');
    const vimeoWrapper = document.querySelector('#vimeo-wrapper');
    
    if (vimeoIframe && typeof Vimeo !== 'undefined') {
        const player = new Vimeo.Player(vimeoIframe);
        player.on('play', () => vimeoWrapper.classList.add('is-playing'));
        player.on('pause', () => vimeoWrapper.classList.remove('is-playing'));
    }

});

// Funzione globale fuori dal DOMContentLoaded se chiamata da attributo HTML (es: onclick)
function togglePlay() {
    const video = document.getElementById("guerrillavideo");
    if (video) {
        video.paused ? video.play() : video.pause();
    }
}

//CONTATTII
// Aggiungi questo nel tuo DOMContentLoaded
function updateClock() {
    const clock = document.getElementById('digital-clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('it-IT', { hour12: false });
    }
}
setInterval(updateClock, 1000);
updateClock();

// La barra di progresso corta a sinistra (se la pagina scorre)
const contactPage = document.querySelector('.contact-page');
const progressBar = document.querySelector('.scroll-progress-bar');
if (contactPage && progressBar) {
    window.addEventListener('scroll', () => {
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        progressBar.style.height = (scrolled < 5 ? 5 : scrolled) + "%";
    });
}