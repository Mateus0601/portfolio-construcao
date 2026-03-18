// ===== AOS INIT =====
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

// ===== SCROLL PROGRESS =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / height) * 100;
  scrollProgress.style.width = progress + '%';
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const originalText = counter.textContent;
        const hasPlus = originalText.startsWith('+');
        const hasPercent = originalText.includes('%');
        const hasDot = originalText.includes('.');
        const duration = 2200;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(eased * target);

          let display = '';
          if (hasPlus) display += '+';
          if (hasDot && current >= 1000) {
            display += current.toLocaleString('pt-BR');
          } else {
            display += current;
          }
          if (hasPercent) display += '%';

          counter.textContent = display;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = originalText;
          }
        }

        requestAnimationFrame(update);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroStatsCol = document.querySelector('.hero-stats-col');
if (heroStatsCol) {
  counterObserver.observe(heroStatsCol);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all items
    faqItems.forEach(faq => faq.classList.remove('active'));

    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ===== FORM HANDLING =====
const form = document.getElementById('contatoForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
    .then((response) => {
      if (response.ok) {
        btn.innerHTML = '<i class="fas fa-check"></i> Orçamento Enviado!';
        btn.style.background = '#059669';
        btn.style.borderColor = '#059669';
        btn.style.opacity = '1';
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Erro ao enviar');
      }
    })
    .catch(() => {
      btn.innerHTML = '<i class="fas fa-times"></i> Erro ao enviar';
      btn.style.background = '#dc2626';
      btn.style.borderColor = '#dc2626';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 3000);
    });
});
