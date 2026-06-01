document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. NAVBAR: Add scrolled class on scroll
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ----------------------------------------------------------
     2. ANIMATED STATS COUNTER
     Triggered once when stats strip enters viewport
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Format with commas or keep raw
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, stepTime);
  };

  if (counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => countUp(counter));
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });

    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) statsObserver.observe(statsStrip);
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     Adds .visible class to elements with .reveal class
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     4. ACTIVE NAV LINK (highlight current page)
  ---------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     5. AID APPLICATION FORM VALIDATION
  ---------------------------------------------------------- */
  const aidForm = document.getElementById('aidForm');
  const successBox = document.getElementById('successBox');

  if (aidForm && successBox) {
    aidForm.addEventListener('submit', function (event) {
      // Prevent default network shipping actions
      event.preventDefault();
      event.stopPropagation();

      if (aidForm.checkValidity()) {
        // Form is structurally valid! Run front-end animations
        aidForm.classList.add('d-none'); // Hide input fields
        successBox.classList.remove('d-none'); // Reveal the dynamic success confirmation
        window.scrollTo({ top: successBox.offsetTop - 100, behavior: 'smooth' });
      } else {
        // Bootstrap standard input indicator highlights
        aidForm.classList.add('was-validated');
      }
    }, false);
  };

  /* ----------------------------------------------------------
     6. PORTFOLIO CARDS FILTERING ENGINE
  ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Toggle Active Button Class Style
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedFilter = button.getAttribute('data-filter');

        // Loop cards and apply conditional visibility transitions
        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (selectedFilter === 'all' || itemCategory === selectedFilter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }
});
