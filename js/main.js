document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     LIVE CLOCK SYNC
     ========================================================================== */
  const updateTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    const timestampElem = document.getElementById('live-timestamp');
    const modalTimestampElem = document.getElementById('modal-live-timestamp');

    if (timestampElem) timestampElem.textContent = timeString;
    if (modalTimestampElem) modalTimestampElem.textContent = timeString;
  };

  setInterval(updateTimestamp, 1000);
  updateTimestamp();


  /* ==========================================================================
     LIVING GARDEN MULTI-FEED CYCLE LOGIC
     ========================================================================== */
  let activeFeedIndex = 0;
  
  const feedLayers = [
    document.getElementById('feed-layer-1'),
    document.getElementById('feed-layer-2'),
    document.getElementById('feed-layer-3'),
    document.getElementById('feed-layer-4')
  ];
  
  const modalLayers = [
    document.getElementById('modal-modal-layer-1'),
    document.getElementById('modal-modal-layer-2'),
    document.getElementById('modal-modal-layer-3'),
    document.getElementById('modal-modal-layer-4')
  ];

  const gardenTitleLabel = document.getElementById('garden-title-label');
  const modalGardenTitleLabel = document.getElementById('modal-garden-title-label');

  const feedData = [
    { title: "LIVING GARDEN", modalTitle: "LIVING GARDEN // FULL MONITOR FEED" },
    { title: "LIVING GARDEN 2", modalTitle: "LIVING GARDEN 2 // FULL MONITOR FEED" },
    { title: "SERVER ROOM // BAY 01", modalTitle: "SERVER ROOM BAY 01 // FULL MONITOR FEED" },
    { title: "SERVER ROOM // BAY 02", modalTitle: "SERVER ROOM BAY 02 // FULL MONITOR FEED" }
  ];

  const updateAllFeeds = (index) => {
    activeFeedIndex = index;
    
    // Update dashboard mini-card
    feedLayers.forEach((layer, idx) => {
      if (layer) layer.classList.toggle('active', idx === activeFeedIndex);
    });

    // Update modal full-view card
    modalLayers.forEach((layer, idx) => {
      if (layer) {
        const isActive = idx === activeFeedIndex;
        layer.classList.toggle('active', isActive);
        
        // Handle custom animations per feed type
        layer.classList.remove('garden-rock-anim', 'server-flicker-anim');
        if (isActive) {
          if (idx === 0 || idx === 1) {
            layer.classList.add('garden-rock-anim');
          } else if (idx === 2 || idx === 3) {
            layer.classList.add('server-flicker-anim');
          }
        }
      }
    });

    // Sync titles
    const currentFeed = feedData[activeFeedIndex];
    if (gardenTitleLabel) gardenTitleLabel.textContent = currentFeed.title;
    if (modalGardenTitleLabel) modalGardenTitleLabel.textContent = currentFeed.modalTitle;
  };

  const autoCycleFeeds = () => {
    const nextIndex = (activeFeedIndex + 1) % feedLayers.length;
    updateAllFeeds(nextIndex);
  };

  setInterval(autoCycleFeeds, 8000);

  // Voltage Fluctuation Visual Effect
  const voltageOverlays = document.querySelectorAll('.voltage-room-shadow-overlay');
  const triggerVoltageDrop = () => {
    voltageOverlays.forEach(overlay => {
      overlay.style.animationDuration = (Math.random() * 3 + 4) + 's';
    });
    setTimeout(triggerVoltageDrop, Math.random() * 6000 + 4000);
  };
  triggerVoltageDrop();


  /* ==========================================================================
     RSS FEED INTEGRATIONS (TECH DECK & GROW FEED)
     ========================================================================== */
     
  // Generic fetch and render logic to dry up code
  const fetchAndRenderRSS = async (rssUrl, config) => {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data && data.status === 'ok' && data.items.length > 0) {
        const posts = data.items.slice(0, 6);
        let currentIndex = 0;

        const renderPost = (post) => {
          if (config.titleElem) {
            config.titleElem.textContent = post.title.toUpperCase();
            config.titleElem.setAttribute('href', post.link);
          }
          if (config.descElem) {
            const cleanDesc = post.description.replace(/<[^>]*>?/gm, '');
            config.descElem.textContent = cleanDesc;
            config.descElem.setAttribute('href', post.link);
          }
          if (config.thumbElem && config.linkImgElem) {
            let imageUrl = post.thumbnail || (post.enclosure && post.enclosure.link);
            if (imageUrl) config.thumbElem.setAttribute('src', imageUrl);
            config.linkImgElem.setAttribute('href', post.link);
          }
        };

        renderPost(posts[currentIndex]);

        // Start the flip cycle (with optional stagger delay)
        setTimeout(() => {
          setInterval(() => {
            if (config.cardElem) {
              config.cardElem.classList.add('feed-flipping-out');
              setTimeout(() => {
                currentIndex = (currentIndex + 1) % posts.length;
                renderPost(posts[currentIndex]);
                config.cardElem.classList.remove('feed-flipping-out');
                config.cardElem.classList.add('feed-flipping-in');
                setTimeout(() => config.cardElem.classList.remove('feed-flipping-in'), 350);
              }, 350);
            }
          }, 12000);
        }, config.staggerDelay || 0);
      }
    } catch (error) {
      console.error(`Failed to load RSS feed (${rssUrl}):`, error);
      if (config.titleElem) config.titleElem.textContent = config.errorText;
    }
  };

  // Init Tech Deck Feed (Blue)
  fetchAndRenderRSS('https://feeds.arstechnica.com/arstechnica/technology-lab', {
    cardElem: document.getElementById('music-card'),
    titleElem: document.getElementById('rss-link-title'),
    descElem: document.getElementById('rss-link-desc'),
    thumbElem: document.getElementById('rss-thumb'),
    linkImgElem: document.getElementById('rss-link-img'),
    errorText: "SUB-ROUTINE // FEED OFFLINE",
    staggerDelay: 0
  });

  // Init Grow System Feed (Green)
  fetchAndRenderRSS('https://www.planetnatural.com/feed/', {
    cardElem: document.getElementById('green-sub-card'),
    titleElem: document.getElementById('grow-link-title'),
    descElem: document.getElementById('grow-link-desc'),
    thumbElem: document.getElementById('grow-thumb'),
    linkImgElem: document.getElementById('grow-link-img'),
    errorText: "GROW FEED // OFFLINE",
    staggerDelay: 6000 // Alternates with the tech feed
  });


  /* ==========================================================================
     MODALS & CAROUSEL NAVIGATION LOGIC
     ========================================================================== */
     
  // Generic Modal Opener
  const setupModal = (openBtns, modal, closeBtn, onOpen = null) => {
    if (!modal) return;
    
    // Handle single element or NodeList
    const triggers = (openBtns instanceof NodeList || Array.isArray(openBtns)) ? openBtns : [openBtns];
    
    triggers.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          if (onOpen) onOpen();
        });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }

    // Global background click logic
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  };

  // Init About Me Modal
  setupModal(
    document.getElementById('open-about-modal'), 
    document.getElementById('about-me-modal'), 
    document.getElementById('close-about-modal')
  );

  // Init Living Garden Full View Modal
  setupModal(
    document.getElementById('open-garden-modal'), 
    document.getElementById('living-garden-modal'), 
    document.getElementById('close-garden-modal'),
    () => updateAllFeeds(activeFeedIndex)
  );

  // Init Digital Archives Modal
  setupModal(
    [document.getElementById('open-archive-modal'), document.getElementById('open-archive-modal-img')],
    document.getElementById('digital-archives-modal'),
    document.getElementById('close-archive-modal')
  );

  const modalCamPrev = document.getElementById('modal-cam-prev');
  const modalCamNext = document.getElementById('modal-cam-next');

  if (modalCamPrev && modalCamNext) {
    modalCamPrev.addEventListener('click', () => {
      let target = activeFeedIndex - 1;
      if (target < 0) target = feedLayers.length - 1;
      updateAllFeeds(target);
    });

    modalCamNext.addEventListener('click', () => {
      let target = activeFeedIndex + 1;
      if (target >= feedLayers.length) target = 0;
      updateAllFeeds(target);
    });
  }

  // --- Featured Projects Carousel Sync Logic ---
  const slides = document.querySelectorAll('.project-slide');
  const projectThumbs = document.querySelectorAll('.open-project-modal-btn');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      const slideDots = slide.querySelectorAll('.carousel-dot');
      slideDots.forEach(dot => {
        const dotIndex = parseInt(dot.getAttribute('data-index'));
        dot.classList.toggle('active', dotIndex === index);
      });
    });
    currentSlide = index;
  };

  if (prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener('click', () => {
      let target = currentSlide - 1;
      if (target < 0) target = slides.length - 1;
      showSlide(target);
    });

    nextBtn.addEventListener('click', () => {
      let target = currentSlide + 1;
      if (target >= slides.length) target = 0;
      showSlide(target);
    });

    // Bind dots for mini-carousel
    slides.forEach((slide) => {
      const slideDots = slide.querySelectorAll('.carousel-dot');
      slideDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          showSlide(parseInt(e.target.getAttribute('data-index')));
        });
      });
    });
  }

  // Init Featured Project Popup Modal
  const projectModal = document.getElementById('featured-project-modal');
  const modalImg = document.getElementById('modal-project-img');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalDots = document.querySelectorAll('#modal-dots-container .carousel-dot');

  const updateProjectModalContent = (index) => {
    if (slides[index]) {
      if (modalTitle) modalTitle.textContent = slides[index].querySelector('.project-slide-title').textContent;
      if (modalDesc) modalDesc.textContent = slides[index].querySelector('.project-slide-desc').textContent;
      if (modalImg) modalImg.setAttribute('src', slides[index].querySelector('.project-thumb-img').getAttribute('src'));

      modalDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  };

  setupModal(
    projectThumbs, 
    projectModal, 
    document.getElementById('close-project-modal'),
    () => updateProjectModalContent(currentSlide)
  );

  // Sync Project Modal inner-navigation with Dashboard Carousel
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');

  if (modalPrevBtn && modalNextBtn) {
    modalPrevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateProjectModalContent(currentSlide);
      showSlide(currentSlide);
    });

    modalNextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateProjectModalContent(currentSlide);
      showSlide(currentSlide);
    });
  }

  modalDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentSlide = parseInt(e.target.getAttribute('data-index'));
      updateProjectModalContent(currentSlide);
      showSlide(currentSlide);
    });
  });

});