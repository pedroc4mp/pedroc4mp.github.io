/* =========================================================
   D'FIVE — script.js
   Experiência Cinematográfica Premium
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    iniciarLenis();
    iniciarGSAP();
    iniciarAOS();
    iniciarHeaderFixo();
    iniciarBlackoutOpening();
    iniciarCameraScroll();
    iniciarRackFocus();
    iniciarParticulas();
    iniciarParticulasPremium();
    iniciarCarrosselArrastavel();
    iniciarContagemRegressiva();
    iniciarRevealNoScroll();
    iniciarFormularioVIP();
    iniciarCardapio();
    iniciarTemaAthletico();
    iniciarEscudoAthletico();
    iniciarLineupEfeitos();
    iniciarBotaoIngresso();
    iniciarEasterEgg();
});

/* ---------- Lenis: scroll suave + sincronização com GSAP ScrollTrigger ---------- */
function iniciarLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4
    });

    lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    function loopScroll(tempo) {
        lenis.raf(tempo);
        requestAnimationFrame(loopScroll);
    }
    requestAnimationFrame(loopScroll);

    // Expor globalmente para uso em links âncora
    window.lenisDfive = lenis;

    // Links âncora rolam suavemente via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const alvo = document.querySelector(id);
            if (!alvo) return;
            e.preventDefault();
            lenis.scrollTo(alvo, { offset: -72, duration: 1.2 });
        });
    });
}

/* ---------- Registro centralizado do GSAP ScrollTrigger ---------- */
function iniciarGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
}

/* ---------- Header fixo: menu overlay + fundo em vidro ao passar da Hero ---------- */
function iniciarHeaderFixo() {
    const nav = document.getElementById('navFixa');
    const botao = document.getElementById('navToggle');
    const overlay = document.getElementById('navOverlay');
    if (!nav || !botao || !overlay) return;

    const linksDoMenu = overlay.querySelectorAll('.nav-overlay-links li');

    const abrirMenu = () => {
        overlay.classList.add('aberto');
        botao.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        // Entrada do menu em fade + stagger + ease suave
        if (typeof anime !== 'undefined') {
            anime({
                targets: linksDoMenu,
                opacity: [0, 1],
                translateY: [18, 0],
                duration: 500,
                delay: anime.stagger(70, { start: 100 }),
                easing: 'easeOutQuad'
            });
        }
    };

    const fecharMenu = () => {
        overlay.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    botao.addEventListener('click', () => {
        const estaAberto = botao.getAttribute('aria-expanded') === 'true';
        estaAberto ? fecharMenu() : abrirMenu();
    });

    // Fecha o menu ao clicar em qualquer link/botão dentro do overlay
    overlay.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));

    // Fecha com a tecla Esc, por acessibilidade
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') fecharMenu();
    });

    // Entrada do header ao carregar a página
    if (typeof anime !== 'undefined') {
        anime({
            targets: nav,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 700,
            easing: 'easeOutQuad'
        });
    }

    // Fundo em vidro assim que o usuário ultrapassa a Hero
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'bottom top',
            end: 99999,
            toggleClass: { targets: nav, className: 'nav-fixa--scrolled' }
        });
    } else {
        // Sem GSAP disponível: aplica o vidro direto, pra nunca deixar
        // o header transparente demais por cima do conteúdo.
        nav.classList.add('nav-fixa--scrolled');
    }
}

/* ---------- Partículas douradas flutuantes no fundo ---------- */
function iniciarParticulas() {
    const container = document.getElementById('particulas');
    if (!container) return;

    const total = window.innerWidth < 600 ? 18 : 32;

    for (let i = 0; i < total; i++) {
        const p = document.createElement('div');
        p.className = 'particula';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (8 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.opacity = (0.2 + Math.random() * 0.4).toFixed(2);
        container.appendChild(p);
    }
}

/* ---------- Carrossel de vídeos arrastável (mouse + touch) ---------- */
function iniciarCarrosselArrastavel() {
    const carrossel = document.getElementById('carrossel');
    if (!carrossel) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const inicioArrasto = (pageX) => {
        isDown = true;
        carrossel.classList.add('arrastando');
        startX = pageX - carrossel.offsetLeft;
        scrollLeft = carrossel.scrollLeft;
    };

    const fimArrasto = () => {
        isDown = false;
        carrossel.classList.remove('arrastando');
    };

    const moverArrasto = (pageX) => {
        if (!isDown) return;
        const x = pageX - carrossel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carrossel.scrollLeft = scrollLeft - walk;
    };

    // Mouse
    carrossel.addEventListener('mousedown', (e) => inicioArrasto(e.pageX));
    carrossel.addEventListener('mouseleave', fimArrasto);
    carrossel.addEventListener('mouseup', fimArrasto);
    carrossel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        moverArrasto(e.pageX);
    });

    // Touch (celular)
    carrossel.addEventListener('touchstart', (e) => inicioArrasto(e.touches[0].pageX), { passive: true });
    carrossel.addEventListener('touchend', fimArrasto);
    carrossel.addEventListener('touchmove', (e) => moverArrasto(e.touches[0].pageX), { passive: true });
}

/* ---------- Contagem regressiva até o próximo evento ---------- */
function iniciarContagemRegressiva() {
    const elDias = document.getElementById('dias');
    if (!elDias) return;

    // Ajuste esta data para a data real do próximo evento
    const dataEvento = new Date('2026-08-09T23:00:00').getTime();

    const elHoras = document.getElementById('horas');
    const elMinutos = document.getElementById('minutos');
    const elSegundos = document.getElementById('segundos');

    function atualizar() {
        const agora = new Date().getTime();
        const diferenca = dataEvento - agora;

        if (diferenca <= 0) {
            elDias.textContent = '00';
            elHoras.textContent = '00';
            elMinutos.textContent = '00';
            elSegundos.textContent = '00';
            return;
        }

        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        elDias.textContent = String(dias).padStart(2, '0');
        elHoras.textContent = String(horas).padStart(2, '0');
        elMinutos.textContent = String(minutos).padStart(2, '0');
        elSegundos.textContent = String(segundos).padStart(2, '0');
    }

    atualizar();
    setInterval(atualizar, 1000);
}

/* ---------- AOS.js: animações de entrada (complementa o .reveal existente) ---------- */
function iniciarAOS() {
    if (typeof AOS === 'undefined') return;

    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
}

/* ---------- Line-up: flashes paparazzi + hover premium com Anime.js ---------- */
function iniciarLineupEfeitos() {
    const cards = document.querySelectorAll('.lineup-card-inner');
    if (!cards.length) return;

    // Vanilla Tilt nos cards (touch-friendly no mobile)
    if (typeof VanillaTilt !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        VanillaTilt.init(cards, {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.35,
            gyroscope: false
        });
    }

    // Flash aleatório estilo paparazzi
    cards.forEach((card) => {
        const dispararFlash = () => {
            card.classList.remove('flash-ativo');
            void card.offsetWidth; // reflow para reiniciar animação
            card.classList.add('flash-ativo');
        };

        card.closest('.lineup-card').addEventListener('mouseenter', () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    scale: [1, 1.02, 1],
                    duration: 400,
                    easing: 'easeOutQuad'
                });
            }
            dispararFlash();
        });
    });

    // Flashes automáticos sutis enquanto visível
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                const intervalo = setInterval(() => {
                    if (!entrada.target.querySelector('.lineup-card-inner')) return;
                    const cardAleatorio = cards[Math.floor(Math.random() * cards.length)];
                    cardAleatorio.classList.remove('flash-ativo');
                    void cardAleatorio.offsetWidth;
                    cardAleatorio.classList.add('flash-ativo');
                }, 3500);

                entrada.target._flashInterval = intervalo;
            } else if (entrada.target._flashInterval) {
                clearInterval(entrada.target._flashInterval);
            }
        });
    }, { threshold: 0.3 });

    const secaoLineup = document.getElementById('lineup');
    if (secaoLineup) observador.observe(secaoLineup);
}

/* ---------- Botão de ingressos flutuante: centralizado, glow, tilt, ScrollTrigger ---------- */
function iniciarBotaoIngresso() {
    const botao = document.getElementById('btnIngresso');
    if (!botao) return;

    // Tilt suave no botão — anima só o ícone para não conflitar com translateX(-50%)
    if (typeof anime !== 'undefined') {
        botao.addEventListener('mouseenter', () => {
            anime({
                targets: botao.querySelector('.btn-ingresso-icone'),
                rotate: [0, -8, 8, 0],
                duration: 500,
                easing: 'easeOutQuad'
            });
        });

        botao.addEventListener('click', () => {
            anime({
                targets: botao.querySelector('.btn-ingresso-icone'),
                scale: [{ value: 1 }, { value: 0.85 }, { value: 1 }],
                duration: 350,
                easing: 'easeOutQuad'
            });
        });
    }

    // Aparece após ultrapassar a Hero — fixo centralizado acompanhando o scroll
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'bottom 80%',
            onEnter: () => botao.classList.add('visivel'),
            onLeaveBack: () => botao.classList.remove('visivel')
        });
    } else {
        botao.classList.add('visivel');
    }
}
function iniciarRevealNoScroll() {
    const elementos = document.querySelectorAll('.reveal');
    if (!elementos.length) return;

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach((el) => observador.observe(el));
}

/* ---------- Abrir/fechar o cardápio com animação em cascata ---------- */
function iniciarCardapio() {
    const botao = document.getElementById('btnCardapio');
    const wrapper = document.getElementById('cardapioWrapper');
    const grid = document.getElementById('cardapioGrid');
    const textoBotao = botao ? botao.querySelector('.btn-cardapio-texto') : null;
    if (!botao || !wrapper || !grid) return;

    botao.addEventListener('click', () => {
        const estaAberto = wrapper.classList.toggle('aberto');
        botao.classList.toggle('aberto', estaAberto);
        botao.setAttribute('aria-expanded', estaAberto);

        if (textoBotao) {
            textoBotao.textContent = estaAberto ? 'Fechar cardápio' : 'Ver cardápio completo';
        }

        if (estaAberto) {
            // pequeno delay pra garantir que a grade já esteja com altura
            // antes de disparar a animação de entrada dos cards
            requestAnimationFrame(() => grid.classList.add('aberto'));
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            grid.classList.remove('aberto');
        }
    });
}

/* ---------- Área do Athletico: transição dourado ↔ vermelho via GSAP ScrollTrigger ---------- */
function iniciarTemaAthletico() {
    const secao = document.getElementById('athletico');
    if (!secao) return;

    const paletaOuro = {
        ouro: [212, 175, 55, 1],
        ouroClaro: [252, 227, 138, 1],
        vidro: [212, 175, 55, 0.10],
        borda: [212, 175, 55, 0.40]
    };
    const paletaVermelha = {
        ouro: [225, 6, 0, 1],
        ouroClaro: [255, 59, 48, 1],
        vidro: [225, 6, 0, 0.12],
        borda: [225, 6, 0, 0.50]
    };

    const paraRgba = (c) => `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${c[3].toFixed(2)})`;
    const misturar = (a, b, t) => [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
        a[3] + (b[3] - a[3]) * t
    ];

    const aplicarQuadro = (t) => {
        secao.style.setProperty('--ouro', paraRgba(misturar(paletaOuro.ouro, paletaVermelha.ouro, t)));
        secao.style.setProperty('--ouro-claro', paraRgba(misturar(paletaOuro.ouroClaro, paletaVermelha.ouroClaro, t)));
        secao.style.setProperty('--vidro', paraRgba(misturar(paletaOuro.vidro, paletaVermelha.vidro, t)));
        secao.style.setProperty('--borda', paraRgba(misturar(paletaOuro.borda, paletaVermelha.borda, t)));
    };

    const estado = { progresso: 0 };
    let jaAnimouBrasao = false;

    const animarTema = (paraVermelho) => {
        const destino = paraVermelho ? 1 : 0;

        if (typeof gsap !== 'undefined') {
            gsap.to(estado, {
                progresso: destino,
                duration: 1.2,
                ease: 'power2.inOut',
                onUpdate: () => aplicarQuadro(estado.progresso)
            });

            if (paraVermelho) {
                gsap.to('.athletico-fundo', { opacity: 0.55, duration: 1.2, ease: 'power2.inOut' });
            } else {
                gsap.to('.athletico-fundo', { opacity: 0.32, duration: 1.2, ease: 'power2.inOut' });
            }
        } else if (typeof anime !== 'undefined') {
            anime({
                targets: estado,
                progresso: destino * 100,
                duration: 1400,
                easing: 'easeInOutQuad',
                update: () => aplicarQuadro(estado.progresso / 100)
            });
        } else {
            aplicarQuadro(destino);
        }

        // Animação do brasão apenas na primeira entrada
        if (paraVermelho && !jaAnimouBrasao) {
            jaAnimouBrasao = true;
            if (typeof anime !== 'undefined') {
                anime({
                    targets: '.athletico-card',
                    scale: [0.94, 1],
                    duration: 900,
                    delay: 150,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
        }
    };

    // GSAP ScrollTrigger: entra vermelho, sai dourado
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: secao,
            start: 'top 65%',
            end: 'bottom 35%',
            onEnter: () => animarTema(true),
            onLeave: () => animarTema(false),
            onEnterBack: () => animarTema(true),
            onLeaveBack: () => animarTema(false)
        });
    } else {
        // Fallback: IntersectionObserver (comportamento anterior)
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                animarTema(entrada.isIntersecting);
            });
        }, { threshold: 0.35 });
        observador.observe(secao);
    }
}

/* ---------- Escudo Athletico: animação de entrada (fade + rotação + glow ao scroll) ---------- */
function iniciarEscudoAthletico() {
    const brasao = document.getElementById('athleticoBrasao');
    if (!brasao) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Reset visual inicial
    gsap.set(brasao, { 
        autoAlpha: 0, 
        scale: 0.6, 
        rotate: -15,
        filter: 'brightness(0.8)'
    });

    // Animação: fade in + girar + crescer + brilho ao entrar na tela
    ScrollTrigger.create({
        trigger: brasao,
        start: 'top 75%',
        once: true,
        onEnter: () => {
            gsap.to(brasao, {
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                filter: 'brightness(1)',
                duration: 1.2,
                ease: 'back.out(1.7)',
                onStart: () => {
                    // Brilho dourado pulsante ao aparecer
                    gsap.to(brasao, {
                        boxShadow: '0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(212,175,55,0.3)',
                        duration: 0.6,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    });
                }
            });
        }
    });

    // Brilho suave e contínuo enquanto a seção está visível
    ScrollTrigger.create({
        trigger: '.athletico-brasao',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            gsap.to(brasao, {
                scale: 1.03,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });
        },
        onLeave: () => gsap.killTweensOf(brasao)
    });
}
function iniciarFormularioVIP() {
    const form = document.getElementById('vipForm');
    const confirmacao = document.getElementById('vipConfirmacao');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Aqui você pode integrar com um backend, planilha (Google Sheets API),
        // Mailchimp, ou disparar direto pro seu WhatsApp Business.
        // Por enquanto, apenas exibe a confirmação visual:

        confirmacao.classList.add('mostrar');
        form.reset();

        setTimeout(() => confirmacao.classList.remove('mostrar'), 4000);
    });
}

/* =========================================================
   1. 🎬 BLACKOUT OPENING — Abertura Cinematográfica
   GSAP Timeline: tela preta → partículas → logo → reflexo → hero
   ========================================================= */
function iniciarBlackoutOpening() {
    const blackout = document.getElementById('blackout');
    if (!blackout) return;
    if (typeof gsap === 'undefined') {
        blackout.classList.add('blackout--revelar');
        return;
    }

    const hero = document.querySelector('.hero');
    const heroTitulo = hero?.querySelector('h1');
    const heroEyebrow = hero?.querySelector('.hero-eyebrow');
    const heroSub = hero?.querySelector('h2');
    const heroCta = hero?.querySelector('.hero-cta');
    const scrollHint = hero?.querySelector('.scroll-hint');
    const logo = document.querySelector('.nav-logo');
    const particulas = document.getElementById('particulas');

    // Garantir que hero comece invisível
    gsap.set([heroTitulo, heroEyebrow, heroSub, heroCta, scrollHint, logo], { autoAlpha: 0 });
    gsap.set(hero, { autoAlpha: 0 });
    gsap.set(particulas, { autoAlpha: 0 });

    const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => blackout.classList.add('blackout--revelar')
    });

    tl
        // 1. Blackout fade out (revela hero com blur)
        .to(blackout, {
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.in'
        })
        // 2. Hero aparece com blur sutil
        .set(hero, { autoAlpha: 1 })
        .fromTo(hero, { scale: 1.05, filter: 'blur(8px)' }, { scale: 1, filter: 'blur(0px)', duration: 1.2 }, '-=0.3')
        // 3. Partículas douradas aparecem
        .to(particulas, { autoAlpha: 1, duration: 0.6 }, '-=0.8')
        // 4. Logo aparece com glow
        .to(logo, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.5')
        // 5. Eyebrow fade in
        .to(heroEyebrow, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3')
        // 6. Título principal com glow
        .to(heroTitulo, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            onStart: () => {
                heroTitulo.style.textShadow = '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.2)';
            }
        }, '-=0.2')
        // 7. Subtítulo
        .to(heroSub, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3')
        // 8. CTAs com stagger
        .to(heroCta?.children || [], { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }, '-=0.2')
        // 9. Scroll hint
        .to(scrollHint, { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.1');
}

/* =========================================================
   2. 📷 CÂMERA SCROLL — Experiência de Profundidade
   ScrollTrigger controla zoom, parallax, rotação
   ========================================================= */
function iniciarCameraScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Lens flare segue o mouse (suave)
    const lens = document.getElementById('cameraLens');
    if (lens) {
        let mouseX = 50;
        let mouseY = 50;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
            lens.style.setProperty('--mouse-x', mouseX + '%');
            lens.style.setProperty('--mouse-y', mouseY + '%');
        });
    }

    // Cada seção com data-cena ganha efeito de profundidade suave (apenas opacidade)
    document.querySelectorAll('[data-cena]').forEach((cena) => {
        ScrollTrigger.create({
            trigger: cena,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const progresso = self.progress;
                // Suave fade de entrada/saída (sem blur/scale para não conflitar com .reveal)
                gsap.set(cena, {
                    opacity: Math.min(1, 0.5 + progresso)
                });
            },
            onLeave: () => gsap.set(cena, { opacity: 1, clearProps: 'filter,transform' }),
            onLeaveBack: () => gsap.set(cena, { opacity: 0.5 })
        });
    });

    // Parallax nos elementos com data-speed
    gsap.utils.toArray('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.3;
        const direcao = parseFloat(el.dataset.direcao) || 1;
        gsap.to(el, {
            y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * direcao * 0.15,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    });

    // Pequena rotação sutil no hero durante scroll
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
            const rotacao = self.progress * 3 - 1.5;
            const escala = 1 - self.progress * 0.08;
            gsap.set('.hero-atmosfera', {
                rotate: rotacao,
                scale: escala,
                opacity: 1 - self.progress * 0.3
            });
        }
    });
}

/* =========================================================
   3. 🎯 RACK FOCUS — Transição de Foco Cinematográfico
   Pequeno blur de entrada nos cards (sem conflitar com .reveal)
   ========================================================= */
function iniciarRackFocus() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Apenas cards individuais (evita blur em containers grandes como .destaque)
    const cards = document.querySelectorAll('.ingresso-card, .lineup-card');

    cards.forEach((card) => {
        // Rack focus: entra com blur suave e fica nítido
        ScrollTrigger.create({
            trigger: card,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1,
            onUpdate: (self) => {
                const progresso = self.progress;
                // Apenas blur, sem scale/opacity para não conflitar com .reveal
                const blur = (1 - progresso) * 2;
                gsap.set(card, {
                    filter: `blur(${blur}px)`
                });
            },
            onLeave: () => gsap.set(card, { filter: 'blur(0px)' }),
            onLeaveBack: () => gsap.set(card, { filter: 'blur(2px)' })
        });
    });
}

/* =========================================================
   4. ✨ PARTÍCULAS PREMIUM — Suaves, Elegantes, Leves
   Otimizado para celular
   ========================================================= */
function iniciarParticulasPremium() {
    const container = document.getElementById('particulas');
    if (!container) return;

    const isMobile = window.innerWidth < 600;
    const maxParticulas = isMobile ? 15 : 35;
    const intervaloTempo = isMobile ? 500 : 250;

    let animacaoAtiva = true;
    let timeoutId = null;

    function criarParticulaPremium() {
        if (!animacaoAtiva) return;

        const tipos = ['ouro', 'estrela'];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];

        const p = document.createElement('div');
        p.className = `particula-premium particula-premium--${tipo}`;
        p.style.left = Math.random() * 100 + '%';

        const tamanho = isMobile ? (2 + Math.random() * 3) : (3 + Math.random() * 5);
        p.style.width = tamanho + 'px';
        p.style.height = p.style.width;

        container.appendChild(p);

        // Anime.js para animação suave
        if (typeof anime !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            anime({
                targets: p,
                translateY: window.innerHeight * -1.2,
                translateX: () => anime.random(-40, 40),
                rotate: () => anime.random(0, 360),
                opacity: [
                    { value: 0.7, duration: 0 },
                    { value: 0.3, duration: 6000 },
                    { value: 0, duration: 1500 }
                ],
                scale: [
                    { value: 1, duration: 0 },
                    { value: 0.3, duration: 8000 }
                ],
                duration: 8000 + Math.random() * 5000,
                easing: 'linear',
                complete: () => p.remove()
            });
        } else {
            // Fallback CSS animation
            p.style.animation = `subir ${8 + Math.random() * 6}s linear infinite`;
            p.style.opacity = (0.2 + Math.random() * 0.4).toFixed(2);
            setTimeout(() => p.remove(), 12000);
        }

        const containerAtual = container.children.length;
        if (containerAtual < maxParticulas) {
            timeoutId = setTimeout(criarParticulaPremium, intervaloTempo);
        }
    }

    // Iniciar criação
    for (let i = 0; i < Math.min(5, maxParticulas); i++) {
        setTimeout(() => criarParticulaPremium(), i * intervaloTempo * 2);
    }

    // Parar quando não visível (performance)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animacaoAtiva = true;
                criarParticulaPremium();
            } else {
                animacaoAtiva = false;
                if (timeoutId) clearTimeout(timeoutId);
            }
        });
    });

    observer.observe(container);

    // Cleanup em resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Remove excesso de partículas se necessário
            const atual = container.querySelectorAll('.particula-premium').length;
            const max = window.innerWidth < 600 ? 15 : 35;
            if (atual > max) {
                const excesso = container.querySelectorAll('.particula-premium');
                for (let i = max; i < excesso.length; i++) {
                    excesso[i]?.remove();
                }
            }
        }, 500);
    });
}

/* =========================================================
   5. 🥚 EASTER EGG — 5 cliques no logo ativa Secret VIP Mode
   "Welcome to Dfive Secret Room"
   ========================================================= */
function iniciarEasterEgg() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;

    // Caso não tenha data-click-easter no HTML, adiciona via JS
    if (!logo.hasAttribute('data-click-easter')) {
        logo.setAttribute('data-click-easter', '0');
    }

    let contadorCliques = 0;
    let timeoutReset = null;

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        contadorCliques++;

        // Feedback visual a cada clique
        if (typeof anime !== 'undefined') {
            anime({
                targets: logo,
                scale: [{ value: 0.9, duration: 100 }, { value: 1, duration: 200 }],
                easing: 'easeOutQuad'
            });
        }

        // Atualizar atributo
        logo.dataset.clickEaster = contadorCliques;

        // Resetar contagem após 3s sem clique
        if (timeoutReset) clearTimeout(timeoutReset);
        timeoutReset = setTimeout(() => {
            contadorCliques = 0;
            logo.dataset.clickEaster = '0';
        }, 3000);

        // 5 cliques → ativar modo secreto
        if (contadorCliques >= 5) {
            contadorCliques = 0;
            logo.dataset.clickEaster = '0';
            ativarModoSecretoVIP();
        }
    });

    function ativarModoSecretoVIP() {
        // Apenas confetes — sem overlay, sem texto, sem camera shake
        if (typeof anime !== 'undefined') {
            const confetes = [];
            for (let i = 0; i < 40; i++) {
                const confete = document.createElement('div');
                confete.className = 'easter-confete';
                confete.style.left = Math.random() * 100 + '%';
                confete.style.top = '-10px';
                confete.style.background = ['#D4AF37', '#FCE38A', '#FFD700', '#7A1F3D', '#FF6B6B'][Math.floor(Math.random() * 5)];
                confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                confete.style.width = (6 + Math.random() * 8) + 'px';
                confete.style.height = confete.style.width;
                document.body.appendChild(confete);
                confetes.push(confete);
            }

            anime({
                targets: confetes,
                translateY: () => [0, window.innerHeight + 100],
                translateX: () => anime.random(-100, 100),
                rotate: () => anime.random(0, 720),
                opacity: [{ value: 1, duration: 0 }, { value: 0, duration: 4000 }],
                duration: 4000 + Math.random() * 2000,
                easing: 'easeOutQuad',
                delay: anime.stagger(50),
                complete: () => confetes.forEach(el => el.remove())
            });
        }

        // Feedback visual sutil: logo pisca
        if (typeof anime !== 'undefined') {
            anime({
                targets: logo,
                textShadow: [
                    '0 0 20px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)',
                    '0 0 30px rgba(212,175,55,1), 0 0 80px rgba(212,175,55,0.6)',
                    '0 0 20px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)'
                ],
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
    }
}

