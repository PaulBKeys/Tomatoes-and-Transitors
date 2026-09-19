document.addEventListener('DOMContentLoaded', () => {
  // --- Live Timestamp Generator ---
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

  // --- Living Garden & Server Room Multi-Feed Camera Cycling Logic ---
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
    feedLayers.forEach((layer, idx) => {
      if (layer) {
        layer.classList.toggle('active', idx === activeFeedIndex);
      }
    });

    modalLayers.forEach((layer, idx) => {
      if (layer) {
        const isActive = idx === activeFeedIndex;
        layer.classList.toggle('active', isActive);
        layer.style.opacity = isActive ? '1' : '0';
        
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

    const currentFeed = feedData[activeFeedIndex];
    if (gardenTitleLabel) gardenTitleLabel.textContent = currentFeed.title;
    if (modalGardenTitleLabel) modalGardenTitleLabel.textContent = currentFeed.modalTitle;
  };

  const autoCycleFeeds = () => {
    const nextIndex = (activeFeedIndex + 1) % feedLayers.length;
    updateAllFeeds(nextIndex);
  };

  let feedInterval = setInterval(autoCycleFeeds, 8000);

  // --- About Me Modal Logic ---
  const aboutModal = document.getElementById('about-me-modal');
  const openAboutBtn = document.getElementById('open-about-modal');
  const closeAboutBtn = document.getElementById('close-about-modal');

  if (openAboutBtn && aboutModal) {
    openAboutBtn.addEventListener('click', () => {
      aboutModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeAboutBtn && aboutModal) {
    closeAboutBtn.addEventListener('click', () => {
      aboutModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // --- Living Garden Full View Modal Logic with Manual Arrows ---
  const gardenModal = document.getElementById('living-garden-modal');
  const openGardenBtn = document.getElementById('open-garden-modal');
  const closeGardenBtn = document.getElementById('close-garden-modal');
  const modalCamPrev = document.getElementById('modal-cam-prev');
  const modalCamNext = document.getElementById('modal-cam-next');

  if (openGardenBtn && gardenModal) {
    openGardenBtn.addEventListener('click', () => {
      gardenModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      updateAllFeeds(activeFeedIndex);
    });
  }

  if (closeGardenBtn && gardenModal) {
    closeGardenBtn.addEventListener('click', () => {
      gardenModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

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

  // --- Featured Projects Carousel Logic ---
  const slides = document.querySelectorAll('.project-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      
      const slideDots = slide.querySelectorAll('.carousel-dot');
      slideDots.forEach((dot) => {
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

    slides.forEach((slide) => {
      const slideDots = slide.querySelectorAll('.carousel-dot');
      slideDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          const slideIndex = parseInt(e.target.getAttribute('data-index'));
          showSlide(slideIndex);
        });
      });
    });
  }

  // --- Featured Project Popup Modal Logic ---
  const projectModal = document.getElementById('featured-project-modal');
  const closeProjectBtn = document.getElementById('close-project-modal');
  const modalImg = document.getElementById('modal-project-img');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');
  const modalDots = document.querySelectorAll('#modal-dots-container .carousel-dot');

  const updateModalContent = (index) => {
    if (slides[index]) {
      const titleText = slides[index].querySelector('.project-slide-title').textContent;
      const descText = slides[index].querySelector('.project-slide-desc').textContent;
      const imgSrc = slides[index].querySelector('.project-thumb-img').getAttribute('src');

      if (modalTitle) modalTitle.textContent = titleText;
      if (modalDesc) modalDesc.textContent = descText;
      if (modalImg) modalImg.setAttribute('src', imgSrc);

      modalDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  };

  document.addEventListener('click', (e) => {
    const thumbTrigger = e.target.closest('#open-project-modal-btn');
    if (thumbTrigger) {
      if (projectModal) {
        projectModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateModalContent(currentSlide);
      }
    }
  });

  if (modalPrevBtn && modalNextBtn) {
    modalPrevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateModalContent(currentSlide);
      showSlide(currentSlide);
    });

    modalNextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateModalContent(currentSlide);
      showSlide(currentSlide);
    });
  }

  modalDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-index'));
      currentSlide = slideIndex;
      updateModalContent(currentSlide);
      showSlide(currentSlide);
    });
  });

  if (closeProjectBtn && projectModal) {
    closeProjectBtn.addEventListener('click', () => {
      projectModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // --- Global Overlay Click-to-Close ---
  window.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
      aboutModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (event.target === gardenModal) {
      gardenModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (event.target === projectModal) {
      projectModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});