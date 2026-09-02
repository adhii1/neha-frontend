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

  /* ----------------------------------------------------
     13. Project Portfolio Data & Multi-Image Gallery Lightbox
     ---------------------------------------------------- */
  const portfolioProjects = {
    'mayuri-bar': {
      title: 'Mayuri Bar & Restaurant',
      badge: 'RETAIL',
      images: [
        { src: 'assets/images/neha/retail mayuri (1).jpeg', caption: 'Mayuri Bar & Restaurant - Architectural Entrance & LED Illumination' },
        { src: 'assets/images/neha/retail mayuri (2).jpeg', caption: 'Mayuri Restaurant - Ambient Dining Area Ceiling Lighting' },
        { src: 'assets/images/the_mayuri.png', caption: 'Mayuri - Custom Architectural Brand Signage' },
        { src: 'assets/images/neha/mayuri 3.jpeg', caption: 'Mayuri - Custom Architectural Brand Signage' },
        { src: 'assets/images/neha/mayuri 4.jpeg', caption: 'Mayuri - Custom Architectural Brand Signage' },

      ]
    },
    'more-hypermarket-1': {
      title: 'Hypermarket More',
      badge: 'RETAIL',
      images: [
        { src: 'assets/images/neha/retail more  (1).JPG', caption: 'Hypermarket More - Overhead Aisle High-Efficiency Illumination' },
        { src: 'assets/images/neha/retail more  (2).JPG', caption: 'Hypermarket More - Retail Floor Power Distribution' },
        { src: 'assets/images/neha/more 3.JPG', caption: 'Hypermarket More - Main Distribution Panel Wiring' },
        { src: 'assets/images/neha/more 4.JPG', caption: 'Hypermarket More - Commercial Cable Tray Network' },
        { src: 'assets/images/neha/more 5.JPG', caption: 'Hypermarket More - Checkout Area Lighting & Power Grid' }
      ]
    },
    'van-heusen': {
      title: 'Van Heusen Women',
      badge: 'RETAIL INTERIORS',
      images: [
        { src: 'assets/images/neha/retail van huesen women (4).jpg', caption: 'Van Heusen Women - Main Showroom Architectural Entrance' },
        { src: 'assets/images/neha/retail van huesen women (3).jpg', caption: 'Van Heusen Women - Precision Apparel Spotlights & Displays' },
        { src: 'assets/images/neha/retail van huesen women (5).jpg', caption: 'Van Heusen Women - Ceiling Cove Lighting & Power Setup' },
        { src: 'assets/images/neha/van huesen 4.jpg', caption: 'Van Heusen Women - Fitting Lounge & Retail Interior Wiring' },
        { src: 'assets/images/neha/van huesen 5.jpg', caption: 'Van Heusen - Retail Brand Frontage' }
      ]
    },
    'louis-philippe': {
      title: 'Louis Philippe',
      badge: 'RETAIL INTERIORS',
      images: [
        { src: 'assets/images/neha/reatil louis phillips (5).jpg', caption: 'Louis Philippe - Main Showroom Illumination & Fixtures' },
        { src: 'assets/images/neha/reatil louis phillips (3).jpg', caption: 'Louis Philippe - Formal Wear Precision Accent Spotlights' },
        { src: 'assets/images/neha/reatil louis phillips (4).jpg', caption: 'Louis Philippe - Architectural Ceiling Cove Detail' },
        { src: 'assets/images/neha/lp 3.jpg', caption: 'Louis Philippe - Brand Flagship Emblem' },
        { src: 'assets/images/neha/lp 4.jpg', caption: 'Aditya Birla Fashion - Corporate Retail Identity' }
      ]
    },

    'nandhini-deluxe': {
      title: 'Nandhini Deluxe',
      badge: 'RETAIL',
      images: [
        { src: 'assets/images/neha/retail nandini/WhatsApp Image 2025-12-25 at 5.48.56 PM.jpeg', caption: 'Nandhini Deluxe - Precision Ceiling Track Spotlighting' },
        { src: 'assets/images/neha/retail nandini/WhatsApp Image 2025-12-25 at 5.49.07 PM.jpeg', caption: 'Nandhini Deluxe - Acoustic Paneling & Accent Lighting' },
        { src: 'assets/images/neha/retail nandini/WhatsApp Image 2025-12-25 at 5.49.08 PM.jpeg', caption: 'Nandhini Deluxe - Dining Hall Atmospheric Lighting Grid' },
        { src: 'assets/images/neha/retail nandini/WhatsApp Image 2025-12-25 at 5.49.16 PM.jpeg', caption: 'Nandhini Deluxe - Main Reception & Cash Counter Wiring' },
        { src: 'assets/images/neha/retail nandini/WhatsApp Image 2025-09-06 at 5.21.06 PM.jpeg', caption: 'Nandhini Deluxe - Exterior Facade Architectural Illumination' }
      ]
    },
    'tata-power': {
      title: 'Tata Power Solar',
      badge: 'SOLAR & POWER',
      images: [
        { src: 'assets/images/neha/tata power.png', caption: 'Tata Power Solar - Commercial Solar Grid Integration' },
        { src: 'assets/images/neha/tata bp office (1).jpg', caption: 'Tata BP Solar Office - Facility Electrical Layout' },
        { src: 'assets/images/neha/tata bp office (2).jpg', caption: 'Tata BP Solar Office - Grid Distribution & Inverters' },

      ]
    },
    'elbit-india': {
      title: 'Elbit India',
      badge: 'CORPORATE INFRASTRUCTURE',
      images: [
        { src: 'assets/images/neha/cor elibit.jpg', caption: 'Elbit Systems - Industrial-Grade Electrical Panels' },
        { src: 'assets/images/neha/corporate elbit.jpg', caption: 'Elbit Systems - Cable Tray Routing & Power Distribution' },
        { src: 'assets/images/neha/elbit 3.JPG', caption: 'Elbit Systems - Heavy-Duty Distribution Transformer' },
        { src: 'assets/images/neha/elbit 4.jpg', caption: 'Elbit Systems - High-Security Server Facility Power' },
        { src: 'assets/images/neha/elbit 5.jpg', caption: 'Elbit Systems - Industrial Conduit & Cable Raceway' }
      ]
    },
    'ather-office': {
      title: 'Ather Office',
      badge: 'CORPORATE INTERIORS',
      images: [
        { src: 'assets/images/neha/corporate arther (1).JPG', caption: 'Ather Energy - Open-Plan Corporate Workspace Lighting' },
        { src: 'assets/images/neha/corporate arther (2).JPG', caption: 'Ather Energy - Modular Ceiling Fixtures & Structured Cabling' },
        { src: 'assets/images/neha/corporate arther.JPG', caption: 'Ather Energy - Corporate Meeting Room Power Distribution' },
        { src: 'assets/images/neha/ai 2 (1).jpg', caption: 'Ather Energy - Workstation Power Trunking Setup' },
        { src: 'assets/images/neha/ather 5.JPG', caption: 'Ather Energy - Collaboration Zone Architectural Lighting' }
      ]
    },
    'ather-center': {
      title: 'Ather Center',
      badge: 'CORPORATE SHOWROOM',
      images: [
        { src: 'assets/images/neha/corporate arther (2).JPG', caption: 'Ather Experience Center - Architectural Interior Lighting' },
        { src: 'assets/images/neha/corporate arther (1).JPG', caption: 'Ather Experience Center - Customer Lounge & Display Power' },
        { src: 'assets/images/neha/corporate arther.JPG', caption: 'Ather Experience Center - EV Showcase Track Lighting' },
        { src: 'assets/images/neha/oi2.jpg', caption: 'Ather Experience Center - Interactive Wall Power Installation' },
        { src: 'assets/images/neha/oi3.JPG', caption: 'Ather Experience Center - Fast Charging Power Station Grid' }
      ]
    },
    'cassadian': {
      title: 'Cassadian',
      badge: 'CORPORATE SHOWROOM',
      images: [
        { src: 'assets/images/neha/corporate cassadian.JPG', caption: 'Cassadian - Corporate Complex Architectural Lighting' },
        { src: 'assets/images/neha/cassadian 2.JPG', caption: 'Cassadian - Executive Floor Power Distribution' },
        { src: 'assets/images/neha/cassadian 1 (1).JPG', caption: 'Cassadian - Server Room Structured Cable Management' },
        { src: 'assets/images/neha/cassadian 1 (2).jpg', caption: 'Cassadian - Main Electrical Riser Shaft Installation' },
        { src: 'assets/images/neha/cassadian 1 (3).jpg', caption: 'Cassadian - HVAC & Central Cooling Power Distribution' }
      ]
    },
    'big-bags-india': {
      title: 'Big Bags India',
      badge: 'COMMERCIAL LOGISTICS',
      images: [
        { src: 'assets/images/neha/big bags.jpg', caption: 'Big Bags India - High-Bay LED Warehouse Illumination' },
        { src: 'assets/images/neha/big bags 1 (1).jpg', caption: 'Big Bags India - Logistics Facility Cable Tray Routing' },
        { src: 'assets/images/neha/big bags 1 (2).jpg', caption: 'Big Bags India - Operations Floor Electrical Wiring' },
        { src: 'assets/images/neha/big bags 1 (3).jpg', caption: 'Big Bags India - Central Main Switchgear Panel' },
        { src: 'assets/images/neha/big bags 1 (4).jpg', caption: 'Big Bags India - Commercial Facility Identification' },
        { src: 'assets/images/neha/big bags 1 (5).jpg', caption: 'Big Bags India - Commercial Facility Identification' }
      ]
    },
    'kivar': {
      title: 'Kivar',
      badge: 'CORPORATE BUILDING',
      images: [
        { src: 'assets/images/neha/corporate kevar (2).JPG', caption: 'Kivar Commercial Complex - Turnkey Electrical Contracting' },
        { src: 'assets/images/neha/corporate kevar (1).JPG', caption: 'Kivar Complex - Interior Lighting Grids & Riser Cables' },
        { src: 'assets/images/neha/kivar 1 (1).JPG', caption: 'Kivar - Commercial Complex Exterior Elevation' },
        { src: 'assets/images/neha/kivar 1 (2).JPG', caption: 'Kivar - Corporate Brand Profile' },
        { src: 'assets/images/neha/kivar 1 (3).JPG', caption: 'Kivar - Commercial Lobby & Corridor Lighting' }
      ]
    },

    'vodafone-reception': {
      title: 'Vodafone Idea Reception',
      badge: 'CORPORATE LOBBY',
      images: [
        { src: 'assets/images/neha/corporate vodaphone (3).jpg', caption: 'Vodafone Idea Reception - Architectural Ceiling Cove Lighting' },
        { src: 'assets/images/neha/corporate vodaphone (1).jpg', caption: 'Vodafone Idea Reception - Office Floor Connector Grid' },
        { src: 'assets/images/neha/corporate vodaphone (2).jpg', caption: 'Vodafone Idea Reception - Conference Lounge Lighting' },
        { src: 'assets/images/neha/corporate vodaphone (4).jpg', caption: 'Vodafone Idea Reception - Automated Lighting Controls' },
        { src: 'assets/images/neha/corporate vodaphone (5).jpg', caption: 'Vodafone Idea Reception - 24/7 Security Power System' }
      ]
    },

    'prestige-tower': {
      title: 'Residential Tower',
      badge: 'RESIDENTIAL TOWER',
      images: [
        { src: 'assets/images/neha/suma 1 (5).jpg', caption: 'Prestige Group Residential Tower - Facade Architectural Lighting' },
        { src: 'assets/images/neha/suma 1 (4).jpg', caption: 'Prestige Group Residential Tower - Grand Entrance Lobby' },
        { src: 'assets/images/neha/suma.jpg', caption: 'Prestige Group Residential Tower - Apartment Interiors' },
        { src: 'assets/images/neha/suma 1 (3).jpg', caption: 'Prestige Group Residential Tower - Apartment Interiors' },
        { src: 'assets/images/neha/suma 1 (2).jpg', caption: 'Prestige Group Residential Tower - Penthouse Skydeck' },
        { src: 'assets/images/suma 1 (1).jpg', caption: 'Prestige Group - Residential Developer Identity' }
      ]
    },
    'prestige-grand': {
      title: 'Prestige Grand',
      badge: 'GRAND LOBBY',
      images: [
        { src: 'assets/images/neha/residential prestige (2).JPG', caption: 'Prestige Grand Lobby - High-End Interior Cove Lighting & Chandeliers' },
        { src: 'assets/images/neha/residential prestige (1).jpg', caption: 'Prestige Grand - High-Voltage Transformer Substation' },
        { src: 'assets/images/neha/residential prestige (3).JPG', caption: 'Prestige Grand - Luxury Living Room Illumination' },
        { src: 'assets/images/neha/residential prestige (4).JPG', caption: 'Prestige Grand - Smart Building Lighting Controls' },
        { src: 'assets/images/neha/resi  light&a 5.jpg', caption: 'Prestige Grand - Ambient Wall Sconces & Accents' }
      ]
    },
    'prestige-living': {
      title: 'Luxury Living Space',
      badge: 'RESIDENTIAL INTERIORS',
      images: [
        { src: 'assets/images/neha/githa 5.jpg', caption: 'Luxury Living Space - Custom Architectural Recessed LED Lighting' },
        { src: 'assets/images/neha/githa 1 (1).jpg', caption: 'Luxury Living Space - Tower Exterior Profile' },
        { src: 'assets/images/neha/githa 1 (2).jpg', caption: 'Luxury Living Space - Foyer & Concierge Illumination' },
        { src: 'assets/images/neha/githa 1 (3).jpg', caption: 'Luxury Living Space - Master Suite Mood Scenes' },
        { src: 'assets/images/neha/githa 1.jpg', caption: 'Luxury Living Space - Smart Dimmer Automation Controls' }
      ]
    },
    'prestige-penthouse': {
      title: 'Penthouse Suite',
      badge: 'PENTHOUSE SUITE',
      images: [
        { src: 'assets/images/neha/sashi (5).jpg', caption: 'Penthouse Suite - Intelligent Lighting Automation & Mood Scenes' },
        { src: 'assets/images/neha/sashi (4).jpg', caption: 'Penthouse Suite - Sky Villa Elevation Lighting' },
        { src: 'assets/images/neha/sashi (3).jpg', caption: 'Penthouse Suite - Private Elevator Lobby Illumination' },
        { src: 'assets/images/neha/sashi (2).jpg', caption: 'Penthouse Suite - Premium Electrical Fittings' },
        { src: 'assets/images/neha/sashi (1).jpg', caption: 'Penthouse Suite - Terrace Architectural Uplighters' }
      ]
    },

  };

  // Lightbox DOM elements
  const lightboxModal = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxCurrentIdx = document.getElementById('lightbox-current-idx');
  const lightboxTotalCount = document.getElementById('lightbox-total-count');
  const lightboxThumbsTrack = document.getElementById('lightbox-thumbs-track');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-card');

  let currentProjectGallery = null;
  let currentImageIndex = 0;

  // Open Lightbox for specific project
  function openProjectGallery(projectId, startIndex = 0) {
    if (!lightboxModal) return;

    let project = portfolioProjects[projectId];

    // Fallback if project id is not registered
    if (!project) {
      const card = document.querySelector(`.gallery-card[data-project="${projectId}"]`);
      const fallbackSrc = card ? card.getAttribute('data-lightbox') : '';
      const fallbackCaption = card ? card.getAttribute('data-caption') : '';
      const fallbackTitle = card && card.querySelector('.gallery-title') ? card.querySelector('.gallery-title').textContent : 'Project Gallery';
      const fallbackBadge = card && card.querySelector('.gallery-badge') ? card.querySelector('.gallery-badge').textContent : 'PROJECT';
      project = {
        title: fallbackTitle,
        badge: fallbackBadge,
        images: [{ src: fallbackSrc, caption: fallbackCaption }]
      };
    }

    currentProjectGallery = project;
    currentImageIndex = startIndex;

    // Set Topbar info
    if (lightboxTitle) lightboxTitle.textContent = project.title;
    if (lightboxBadge) lightboxBadge.textContent = project.badge;
    if (lightboxTotalCount) lightboxTotalCount.textContent = project.images.length;

    // Render Thumbnails
    if (lightboxThumbsTrack) {
      lightboxThumbsTrack.innerHTML = '';
      project.images.forEach((imgObj, idx) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.className = `lightbox-thumb ${idx === startIndex ? 'active-thumb' : ''}`;
        thumbBtn.setAttribute('aria-label', `View image ${idx + 1} of ${project.images.length}`);
        thumbBtn.innerHTML = `<img src="${imgObj.src}" alt="${imgObj.caption || project.title}" loading="lazy">`;
        thumbBtn.addEventListener('click', () => {
          showProjectImage(idx);
        });
        lightboxThumbsTrack.appendChild(thumbBtn);
      });
    }

    // Show selected image
    showProjectImage(startIndex, false);

    // Open modal
    lightboxModal.classList.add('active');
    if (window.lenis) lenis.stop();
  }

  // Display image at specific index with smooth crossfade
  function showProjectImage(index, animate = true) {
    if (!currentProjectGallery || !currentProjectGallery.images.length) return;

    // Clamp / wrap index
    const total = currentProjectGallery.images.length;
    currentImageIndex = (index + total) % total;
    const imgData = currentProjectGallery.images[currentImageIndex];

    if (lightboxCurrentIdx) lightboxCurrentIdx.textContent = currentImageIndex + 1;

    // Update thumbnails active state
    if (lightboxThumbsTrack) {
      const thumbs = lightboxThumbsTrack.querySelectorAll('.lightbox-thumb');
      thumbs.forEach((th, idx) => {
        if (idx === currentImageIndex) {
          th.classList.add('active-thumb');
          th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          th.classList.remove('active-thumb');
        }
      });
    }

    if (lightboxImg) {
      if (animate) {
        lightboxImg.classList.add('fade-out');
        setTimeout(() => {
          lightboxImg.src = imgData.src;
          lightboxImg.alt = imgData.caption || currentProjectGallery.title;
          if (lightboxCaption) lightboxCaption.textContent = imgData.caption || '';
          lightboxImg.classList.remove('fade-out');
        }, 180);
      } else {
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.caption || currentProjectGallery.title;
        if (lightboxCaption) lightboxCaption.textContent = imgData.caption || '';
        lightboxImg.classList.remove('fade-out');
      }
    }
  }

  function nextGalleryImage() {
    showProjectImage(currentImageIndex + 1);
  }

  function prevGalleryImage() {
    showProjectImage(currentImageIndex - 1);
  }

  function closeProjectGallery() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      if (window.lenis) lenis.start();
    }
  }

  // Attach card click handlers
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = card.getAttribute('data-project') || '';
      openProjectGallery(projectId, 0);
    });
  });

  // Lightbox controls
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevGalleryImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextGalleryImage();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProjectGallery();
    });
  }

  // Backdrop click to close (when clicking outside the dialog container)
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      const dialog = lightboxModal.querySelector('.lightbox-dialog-container');
      if (dialog && !dialog.contains(e.target)) {
        closeProjectGallery();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeProjectGallery();
    } else if (e.key === 'ArrowRight') {
      nextGalleryImage();
    } else if (e.key === 'ArrowLeft') {
      prevGalleryImage();
    }
  });

  // Mobile Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const diffX = touchEndX - touchStartX;
    if (Math.abs(diffX) > 45) {
      if (diffX < 0) {
        nextGalleryImage(); // swipe left -> next
      } else {
        prevGalleryImage(); // swipe right -> prev
      }
    }
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
