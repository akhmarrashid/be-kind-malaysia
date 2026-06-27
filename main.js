document.addEventListener('DOMContentLoaded', function () {

  /*LUCIDE ICONS RENDERING*/
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* 1. NAVBAR: Add scrolled class on scroll */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* 2. ANIMATED STATS COUNTER
     Triggered once when stats strip enters viewport */
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

  /* 3. SCROLL REVEAL
     Adds .visible class to elements with .reveal class*/
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

  /* 4. ACTIVE NAV LINK (highlight current page) */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* 5. FORM VALIDATION (FOR AID REQUEST) */
  const aidForm = document.getElementById('aidForm');
  const successBox = document.getElementById('successBox');

  if (aidForm && successBox) {
    aidForm.addEventListener('submit', function (event) {
      // Prevent the page from reloading automatically      
      event.preventDefault();
      event.stopPropagation();

      // If all inputs match the required fields
      if (aidForm.checkValidity()) {
        aidForm.classList.add('d-none'); // Hide the form
        successBox.classList.remove('d-none'); // Show success message
        window.scrollTo({ top: successBox.offsetTop - 100, behavior: 'smooth' });
      } else {
        // Show Bootstrap validation red/green styles
        aidForm.classList.add('was-validated');
      }
    }, false);
  };

  /* 6. CAMPAIGN CARDS FILTERING LOGIC */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active color from all buttons, then add to clicked button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedFilter = button.getAttribute('data-filter');

        // Show or hide cards based on the selected category
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

  /* 7. FORM VALIDATION (FOR FEEDBACK FORM) */
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackSuccessBox = document.getElementById('feedbackSuccessBox');

  if (feedbackForm && feedbackSuccessBox) {
    feedbackForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (feedbackForm.checkValidity()) {
        feedbackForm.classList.add('d-none');
        feedbackSuccessBox.classList.remove('d-none');
        window.scrollTo({ top: feedbackSuccessBox.offsetTop - 100, behavior: 'smooth' });
        
        feedbackForm.reset();
        feedbackForm.classList.remove('was-validated');
      } else {
        feedbackForm.classList.add('was-validated');
      }
    }, false);
  }
});