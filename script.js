// Préparation des animations GSAP et des interactions
// (GSAP doit être inclus via CDN ou localement pour fonctionner)

document.addEventListener('DOMContentLoaded', () => {
  // Animation d'entrée du Hero (exemple)
  // gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1 });

  // Dark mode toggle
  const darkToggle = document.querySelector('.darkmode-toggle');
  const darkIcon = darkToggle.querySelector('.darkmode-icon');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  function setDarkIcon(isDark) {
    if (isDark) {
      darkIcon.classList.remove('fa-moon');
      darkIcon.classList.add('fa-sun');
    } else {
      darkIcon.classList.remove('fa-sun');
      darkIcon.classList.add('fa-moon');
    }
  }
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
    setDarkIcon(true);
  } else {
    setDarkIcon(false);
  }
  darkToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    setDarkIcon(isDark);
  });

  // Animation d'entrée du Hero
  if (window.gsap) {
    gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, ease: 'power2.out' });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, delay: 0.5, ease: 'power2.out' });
  }

  // Reveal au scroll pour les services (avec GSAP)
  if (window.gsap) {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      gsap.set(el, { opacity: 0, y: 40 });
    });
    const revealOnScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      revealElements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom && !el.classList.contains('visible')) {
          el.classList.add('visible');
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
        } else if (boxTop >= triggerBottom && el.classList.contains('visible')) {
          el.classList.remove('visible');
          gsap.to(el, { opacity: 0, y: 40, duration: 0.5, ease: 'power2.in' });
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
  } else {
    // Fallback si GSAP non chargé
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      revealElements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
  }

  // Parallax sur l'image About (exemple simple)
  const parallax = document.querySelector('.about-image.parallax');
  if (parallax) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      parallax.style.transform = `translateY(${offset * 0.1}px)`;
    });
  }

  // Micro-interactions sur le formulaire de contact
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Animation ou feedback ici
      alert('Merci pour votre message !');
      contactForm.reset();
    });
  }

  // Burger menu
  const burger = document.querySelector('.burger');
  const navList = document.getElementById('nav-list');
  burger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Fermer le menu au clic sur un lien
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  // Fermer le menu au clic en dehors
  document.addEventListener('click', (e) => {
    if (navList.classList.contains('open') && !navList.contains(e.target) && !burger.contains(e.target)) {
      navList.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Hero rotating list
  const rotatingTexts = [
    "Créer votre site internet",
    "Mettre en place et maintenir votre hébergement",
    "Sécuriser et maintenir votre site web",
    "Créer votre API sur-mesure",
    "Choisir la meilleure solution d'hébergement"
  ];
  const rotatingEl = document.querySelector('.hero-rotating');
  let rotatingIdx = 0;
  function showRotatingText(idx) {
    if (!rotatingEl) return;
    rotatingEl.classList.add('fade');
    setTimeout(() => {
      rotatingEl.textContent = rotatingTexts[idx];
      rotatingEl.classList.remove('fade');
    }, 500);
  }
  if (rotatingEl) {
    showRotatingText(rotatingIdx);
    setInterval(() => {
      rotatingIdx = (rotatingIdx + 1) % rotatingTexts.length;
      showRotatingText(rotatingIdx);
    }, 2500);
  }

  // Navbar active link on scroll
  const navLinks = document.querySelectorAll('.nav-list a');
  const sections = Array.from(document.querySelectorAll('main section, section'));
  function setActiveNav() {
    let current = '';
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveNav);
  setActiveNav();

  // Flip cards (expertise) : toggle au clic sur mobile, ferme les autres si besoin
  const allFlipCards = document.querySelectorAll('.flip-card');
  allFlipCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        // Fermer toutes les autres cartes
        allFlipCards.forEach(c => { if (c !== this) c.classList.remove('flipped'); });
        // Toggle la carte cliquée
        this.classList.toggle('flipped');
        e.stopPropagation();
      }
    });
    card.addEventListener('keypress', function(e) {
      if ((e.key === 'Enter' || e.key === ' ') && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        e.preventDefault();
        allFlipCards.forEach(c => { if (c !== this) c.classList.remove('flipped'); });
        this.classList.toggle('flipped');
      }
    });
  });
  // Fermer toutes les cartes si clic en dehors
  document.addEventListener('click', function(e) {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      if (![...allFlipCards].some(card => card.contains(e.target))) {
        allFlipCards.forEach(card => card.classList.remove('flipped'));
      }
    }
  });
}); 