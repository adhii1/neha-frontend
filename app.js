/* ==========================================================================
   NEHA ELECTRICALS - CORE APPLICATION JS (UPDATED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------
     1. Lenis Smooth Scrolling Integration
     ---------------------------------------------------- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to requestAnimationFrame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Link Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  /* ----------------------------------------------------
     2. Dynamic Hero Section Scroll Transition (GSAP)
     ---------------------------------------------------- */
  // Pin the entire hero section while executing the background crossfade
  const heroTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: '+=100%', // Scroll depth equal to 100vh
      scrub: true,
      pin: '.hero-pinned-container',
      pinSpacing: false, // Do not leave space after unpinning
    }
  });

  // Animate Background layer transition: Exterior (1 -> 0) & Interior (0 -> 1)
  heroTL.to('.hero-bg-layer.exterior', { opacity: 0, duration: 1 }, 0);
  heroTL.to('.hero-bg-layer.interior', { opacity: 1, duration: 1 }, 0);

  // Text transitions in the hero section
  heroTL.to(['#hero-headline-1', '#hero-desc-1'], { opacity: 0, scale: 0.98, duration: 0.4 }, 0);
  
  heroTL.set(['#hero-headline-2', '#hero-desc-2'], { display: 'block' }, 0.4);
  heroTL.to(['#hero-headline-2', '#hero-desc-2'], { opacity: 1, scale: 1, duration: 0.6 }, 0.4);
  heroTL.to(['#hero-headline-1', '#hero-desc-1'], { display: 'none' }, 0.4);


  /* ----------------------------------------------------
     3. Responsive Mobile Menu Sidebar Toggle
     ---------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.add('drawer-open');
      lenis.stop(); // Stop scroll when drawer is open
    });
  }

  if (menuClose && sidebar) {
    menuClose.addEventListener('click', () => {
      sidebar.classList.remove('drawer-open');
      lenis.start(); // Resume scroll
    });
  }

  // Close sidebar drawer when clicking links on tablet/mobile
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      
      // Close drawer first
      sidebar.classList.remove('drawer-open');
      lenis.start();

      // Scroll to target using Lenis
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: window.innerWidth < 1024 ? -70 : 0, // offset mobile header height
          duration: 1.2
        });
      }
    });
  });

  // Watch showreel scroll target
  const watchShowreelBtn = document.querySelector('.btn-watch-showreel');
  if (watchShowreelBtn) {
    watchShowreelBtn.addEventListener('click', () => {
      const targetElement = document.querySelector('#projects');
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: window.innerWidth < 1024 ? -70 : 0,
          duration: 1.2
        });
      }
    });
  }

  // Track active section and highlight current sidebar link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 150; // offset buffer

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });


  /* ----------------------------------------------------
     4. Service Cards Hover Glow Tracking
     ---------------------------------------------------- */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });




  /* ----------------------------------------------------
     6. Blueprint & Services Cards Reveal (GSAP Fade Up)
     ---------------------------------------------------- */
  gsap.from('.about-floating-img-card', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.25,
    ease: 'power3.out'
  });

  // Fix: Animate each service card individually when it enters the viewport.
  // The old single-trigger approach (on '.services-section') fired only once when the
  // section top hit 75% — cards in the second row never completed their animation,
  // leaving them permanently faded at opacity: 0.
  document.querySelectorAll('.service-card').forEach((card) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        }
      }
    );
  });


  /* ----------------------------------------------------
     8. How We Work Timeline Electric Line (SVG GSAP)
     ---------------------------------------------------- */
  const electricPath = document.getElementById('electric-path-glowing');
  if (electricPath) {
    const pathLength = electricPath.getTotalLength();
    
    // Set up path dash properties
    gsap.set(electricPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    // Animate the stroke dashoffset as timeline is scrolled into view
    gsap.to(electricPath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.how-we-work-section',
        start: 'top 65%',
        end: 'bottom 80%',
        scrub: 1.2
      }
    });
  }

  // Stagger reveal of timeline step nodes
  gsap.from('.timeline-step', {
    scrollTrigger: {
      trigger: '.how-we-work-section',
      start: 'top 70%',
    },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });



  /* ----------------------------------------------------
     10. Button Ripple Animation
     ---------------------------------------------------- */
  const rippleBtns = document.querySelectorAll('.ripple-btn');
  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Create ripple element
      const x = e.clientX - btn.getBoundingClientRect().left;
      const y = e.clientY - btn.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-circle');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Remove ripple element after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });


  /* ----------------------------------------------------
     11. Contact Form Submission (Fetch API & Success Modal)
     ---------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const spinner = document.getElementById('form-spinner');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show loader
      submitBtn.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';

      // Gather input data
      const formData = {
        name: document.getElementById('form-name').value,
        phone: document.getElementById('form-phone').value,
        email: document.getElementById('form-email').value,
        company: document.getElementById('form-company').value,
        service: document.getElementById('form-service').value
      };

      try {
        // Construct WhatsApp message
        const whatsappNumber = 'YOUR_WHATSAPP_NUMBER'; // TODO: replace with actual number
        const textLines = [
          '*New Consultation Request – Neha Electricals*',
          `Name: ${formData.name}`,
          `Phone: ${formData.phone}`,
          `Email: ${formData.email}`,
          `Company: ${formData.company}`,
          `Service: ${formData.service}`
        ];
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textLines.join('\n'))}`;
        // Open WhatsApp link in new tab/window
        window.open(whatsappUrl, '_blank');
        // Reset form and optionally show success modal
        contactForm.reset();
        // showSuccessModal(); // uncomment if you want modal feedback
      } catch (err) {
        console.error('WhatsApp URL Error:', err);
        alert('Unable to open WhatsApp. Please try again later.');
      } finally {
        // Reset loader
        submitBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
      }
    });
  }

  function showSuccessModal() {
    if (successModal) {
      successModal.classList.add('active');
      lenis.stop(); // Stop page scroll
    }
  }

  function hideSuccessModal() {
    if (successModal) {
      successModal.classList.remove('active');
      lenis.start(); // Resume page scroll
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', hideSuccessModal);
  }

  if (successModal) {
    // Hide when clicking background overlay
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        hideSuccessModal();
      }
    });
  }


  /* ----------------------------------------------------
     12. Gallery Category Filtering & 2-Row Limit Toggle
     ---------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const seeAllBtnWrap = document.getElementById('see-all-projects-btn-wrap');
  const seeAllBtn = document.getElementById('see-all-projects-btn');

  let isGalleryExpanded = false;

  // Determine items in 2 rows based on grid layout columns
  function getInitialRowLimit() {
    const width = window.innerWidth;
    if (width <= 640) return 2;   // Mobile: 1 column x 2 rows = 2 items
    if (width <= 1024) return 4;  // Tablet: 2 columns x 2 rows = 4 items
    return 8;                     // Desktop: 4 columns x 2 rows = 8 items
  }

  function applyGalleryFilterAndLimit() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    const visibleCategoryItems = [];
    galleryItems.forEach(item => {
      const categories = item.getAttribute('data-category') || '';
      if (filterValue === 'all' || categories.includes(filterValue)) {
        visibleCategoryItems.push(item);
      } else {
        item.classList.add('hide');
      }
    });

    if (filterValue === 'all') {
      const limit = getInitialRowLimit();
      if (visibleCategoryItems.length > limit) {
        if (seeAllBtnWrap) seeAllBtnWrap.style.display = 'block';
        visibleCategoryItems.forEach((item, idx) => {
          if (!isGalleryExpanded && idx >= limit) {
            item.classList.add('hide');
          } else {
            item.classList.remove('hide');
          }
        });
        if (seeAllBtn) {
          seeAllBtn.innerHTML = isGalleryExpanded 
            ? '<span>SHOW LESS</span> <i class="fa-solid fa-chevron-up"></i>' 
            : '<span>SEE ALL PROJECTS</span> <i class="fa-solid fa-chevron-down"></i>';
        }
      } else {
        if (seeAllBtnWrap) seeAllBtnWrap.style.display = 'none';
        visibleCategoryItems.forEach(item => item.classList.remove('hide'));
      }
    } else {
      // Non-all filter: show all items for that category without row limit
      if (seeAllBtnWrap) seeAllBtnWrap.style.display = 'none';
      visibleCategoryItems.forEach(item => item.classList.remove('hide'));
    }

    // Refresh GSAP ScrollTrigger layout after grid height changes
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyGalleryFilterAndLimit();
    });
  });

  // See All / Show Less button click
  if (seeAllBtn) {
    seeAllBtn.addEventListener('click', () => {
      isGalleryExpanded = !isGalleryExpanded;
      applyGalleryFilterAndLimit();
      if (!isGalleryExpanded) {
        const galleryElem = document.getElementById('gallery');
        if (galleryElem && lenis) {
          lenis.scrollTo(galleryElem, { offset: -80, duration: 0.8 });
        }
      }
    });
  }

  // Window resize handler for responsive limit
  window.addEventListener('resize', () => {
    applyGalleryFilterAndLimit();
  });

  // Initial call
  applyGalleryFilterAndLimit();

  // Lightbox Modal
  const lightboxModal = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-lightbox');
      const captionText = card.getAttribute('data-caption');
      if (imgSrc && lightboxModal && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText || '';
        lightboxModal.classList.add('active');
        if (window.lenis) lenis.stop();
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      if (window.lenis) lenis.start();
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        if (window.lenis) lenis.start();
      }
    });
  }


  /* ----------------------------------------------------
     Clients Carousel — Arrow Scroll
     ---------------------------------------------------- */
  const carouselTrack = document.getElementById('clients-carousel-track');
  const arrowLeft = document.getElementById('clients-arrow-left');
  const arrowRight = document.getElementById('clients-arrow-right');

  if (carouselTrack && arrowLeft && arrowRight) {
    const getScrollDistance = () => {
      const card = carouselTrack.querySelector('.client-logo-card');
      const cardWidth = card ? card.offsetWidth : 180;
      const gap = 24;
      // Scroll by visible area portion or at least one full card
      return Math.max(cardWidth + gap, Math.floor(carouselTrack.clientWidth * 0.75));
    };

    arrowRight.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
    });

    arrowLeft.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
    });
  }

});
