// ARENA SQUAD - INSTITUCIONAL JS
// Design: Militar / Tático / Sério

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Close menu when clicking on a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}

// ========================================
// STICKY NAVBAR
// ========================================
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ========================================
// GALERIA DE FOTOS
// ========================================
const galeriaGrid = document.getElementById('galeriaGrid');

if (galeriaGrid) {
  const fotos = [
    {
      src: 'https://via.placeholder.com/400x300/4a5f3a/ffffff?text=Arena+Vista+1',
      alt: 'Arena Squad - Vista principal do campo'
    },
    {
      src: 'https://via.placeholder.com/400x300/2d3b2a/ffffff?text=Obstaculos',
      alt: 'Arena Squad - Obstáculos táticos'
    },
    {
      src: 'https://via.placeholder.com/400x300/4a5f3a/ffffff?text=Area+CQB',
      alt: 'Arena Squad - Área de combate CQB'
    },
    {
      src: 'https://via.placeholder.com/400x300/2d3b2a/ffffff?text=Infraestrutura',
      alt: 'Arena Squad - Infraestrutura completa'
    },
    {
      src: 'https://via.placeholder.com/400x300/4a5f3a/ffffff?text=Time+em+Acao',
      alt: 'Arena Squad - Time em ação'
    },
    {
      src: 'https://via.placeholder.com/400x300/2d3b2a/ffffff?text=Equipamentos',
      alt: 'Arena Squad - Equipamentos disponíveis'
    },
    {
      src: 'https://via.placeholder.com/400x300/4a5f3a/ffffff?text=Evento',
      alt: 'Arena Squad - Evento especial'
    },
    {
      src: 'https://via.placeholder.com/400x300/2d3b2a/ffffff?text=Treinamento',
      alt: 'Arena Squad - Sessão de treinamento'
    },
    {
      src: 'https://via.placeholder.com/400x300/4a5f3a/ffffff?text=Estrutura',
      alt: 'Arena Squad - Estrutura do campo'
    }
  ];

  fotos.forEach(foto => {
    const div = document.createElement('div');
    div.className = 'galeria-item';

    const img = document.createElement('img');
    img.src = foto.src;
    img.alt = foto.alt;
    img.loading = 'lazy';

    div.appendChild(img);
    div.addEventListener('click', () => openLightbox(foto.src, foto.alt));

    galeriaGrid.appendChild(div);
  });
}

// ========================================
// LIGHTBOX
// ========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

function openLightbox(src, alt) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Foto ampliada';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ========================================
// SMOOTH SCROLL FALLBACK
// ========================================
// Fallback para navegadores que não suportam scroll-behavior: smooth
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');

    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 70;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// HERO SCROLL INDICATOR
// ========================================
const heroScroll = document.querySelector('.hero-scroll');

if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    const historiaSection = document.getElementById('historia');
    if (historiaSection) {
      const navbarHeight = navbar ? navbar.offsetHeight : 70;
      const targetPosition = historiaSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// ========================================
// INIT
// ========================================
console.log('Arena Squad - Site carregado com sucesso');
