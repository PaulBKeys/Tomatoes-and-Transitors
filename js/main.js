document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. UNIVERSAL MODAL & TOUCH SWIPE SYSTEM
  // ==========================================
  const activeModals = new Set();

  const closeModal = (modal) => {
    if (!modal) return;
    modal.style.display = 'none';
    activeModals.delete(modal);
    if (activeModals.size === 0) {
      document.body.style.overflow = 'auto';
    }
  };

  const openModal = (modal) => {
    if (!modal) return;
    modal.style.display = 'flex';
    activeModals.add(modal);
    document.body.style.overflow = 'hidden';
  };

  const bindModalCloseEvents = (modal, customOnClose = null) => {
    if (!modal) return;
    const closeBtn = modal.querySelector('.close-btn');
    const handleClose = () => {
      if (customOnClose) customOnClose();
      else closeModal(modal);
    };

    if (closeBtn) closeBtn.addEventListener('click', handleClose);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) handleClose();
    });
  };

  // Helper to attach mobile touch-swipe left/right to any stage or modal
  const attachTouchSwipe = (element, onSwipeLeft, onSwipeRight) => {
    if (!element) return;
    let startX = 0;
    let startY = 0;

    element.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;

      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0 && onSwipeLeft) onSwipeLeft();
        if (diffX > 0 && onSwipeRight) onSwipeRight();
      }
    }, { passive: true });
  };

  // About Me Modal
  const aboutModal = document.getElementById('about-me-modal');
  document.querySelectorAll('.open-about-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(aboutModal);
    });
  });
  bindModalCloseEvents(aboutModal);


  // ==========================================
  // 2. FEATURED PROJECTS CAROUSEL & MODAL (HORIZONTAL SLIDE)
  // ==========================================
  const projectsData = [
    {
      title: "TECHNOLOGY & INNOVATION",
      desc: "Exploring cloud, AI, networking, and the technologies shaping tomorrow.",
      img: "images/mock1.png"
    },
    {
      title: "LEARNING & REINVENTION",
      desc: "A CIS student's journey of lifelong learning and starting over at 53.",
      img: "images/mock2.png"
    },
    {
      title: "BUILDING & EXPERIMENTATION",
      desc: "Hands-on projects, labs, and experiments in my workshop and home lab.",
      img: "images/mock3.png"
    },
    {
      title: "GARDENING & GROWING THINGS",
      desc: "Growing food, plants, and a more sustainable tomorrow.",
      img: "images/mock4.png"
    },
    {
      title: "MUSIC & COFFEE",
      desc: "The soundtrack to my days and the fuel for my ideas.",
      img: "images/mock5.png"
    },
    {
      title: "STORY & JOURNEY",
      desc: "Veteran. Reinventor. Documenting the journey and sharing along the way.",
      img: "images/banner.png"
    }
  ];

  const imagesTrack = document.getElementById('dynamic-project-images');
  const dotsContainer = document.getElementById('carousel-dots-container');
  const cardProjTitle = document.getElementById('card-proj-title');
  const cardProjDesc = document.getElementById('card-proj-desc');

  const projectModal = document.getElementById('featured-project-modal');
  const modalProjImg = document.getElementById('modal-project-img');
  const modalProjDesc = document.getElementById('modal-project-desc');
  const modalProjTitle = document.getElementById('modal-project-title');
  const modalProjCounter = document.getElementById('modal-project-counter');

  let currentSlide = 0;

  if (imagesTrack && dotsContainer) {
    projectsData.forEach((proj, idx) => {
      const activeClass = idx === 0 ? 'active' : '';

      const imgEl = document.createElement('img');
      imgEl.src = proj.img;
      imgEl.alt = proj.title;
      imgEl.className = `project-slide-img ${activeClass}`;
      imgEl.setAttribute('data-index', idx);
      imagesTrack.appendChild(imgEl);

      const dotEl = document.createElement('span');
      dotEl.className = `page-dot ${activeClass}`;
      dotEl.setAttribute('data-index', idx);
      dotsContainer.appendChild(dotEl);
    });
  }

  const slideImages = document.querySelectorAll('.project-slide-img');
  const navDots = document.querySelectorAll('.page-dot');

  const updateProjectSlide = (index) => {
    currentSlide = (index + projectsData.length) % projectsData.length;

    // Slide the horizontal track smoothly
    if (imagesTrack) {
      imagesTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slideImages.forEach((img, i) => img.classList.toggle('active', i === currentSlide));
    navDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));

    const activeData = projectsData[currentSlide];
    if (cardProjTitle) cardProjTitle.textContent = activeData.title;
    if (cardProjDesc) cardProjDesc.textContent = activeData.desc;

    if (modalProjImg) modalProjImg.src = activeData.img;
    if (modalProjTitle) modalProjTitle.textContent = `// ${activeData.title}`;
    if (modalProjDesc) modalProjDesc.textContent = activeData.desc;
    if (modalProjCounter) modalProjCounter.textContent = `${currentSlide + 1} / ${projectsData.length}`;
  };

  let projectInterval = setInterval(() => updateProjectSlide(currentSlide + 1), 7500);
  const resetProjectInterval = () => {
    clearInterval(projectInterval);
    projectInterval = setInterval(() => updateProjectSlide(currentSlide + 1), 7500);
  };

  // Bottom Pagination Bar Prev/Next Arrows
  const cardProjPrev = document.getElementById('card-proj-prev');
  const cardProjNext = document.getElementById('card-proj-next');
  if (cardProjPrev) {
    cardProjPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateProjectSlide(currentSlide - 1);
      resetProjectInterval();
    });
  }
  if (cardProjNext) {
    cardProjNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateProjectSlide(currentSlide + 1);
      resetProjectInterval();
    });
  }

  // Card Pagination Dots
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      updateProjectSlide(parseInt(e.target.getAttribute('data-index'), 10));
      resetProjectInterval();
    });
  });

  // Modal Prev/Next Arrows
  const modalProjPrev = document.getElementById('modal-proj-prev');
  const modalProjNext = document.getElementById('modal-proj-next');
  if (modalProjPrev) {
    modalProjPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateProjectSlide(currentSlide - 1);
    });
  }
  if (modalProjNext) {
    modalProjNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateProjectSlide(currentSlide + 1);
    });
  }

  // Touch Swipe for Projects
  attachTouchSwipe(
    document.getElementById('project-carousel-touch'),
    () => { updateProjectSlide(currentSlide + 1); resetProjectInterval(); },
    () => { updateProjectSlide(currentSlide - 1); resetProjectInterval(); }
  );
  attachTouchSwipe(
    document.getElementById('modal-project-touch'),
    () => updateProjectSlide(currentSlide + 1),
    () => updateProjectSlide(currentSlide - 1)
  );

  // Open/Close Project Modal
  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (
        e.target.closest('.bento-pagination-bar') ||
        e.target.classList.contains('page-dot') ||
        e.target.classList.contains('pagination-arrow')
      ) {
        return;
      }
      e.preventDefault();
      clearInterval(projectInterval);
      updateProjectSlide(currentSlide);
      openModal(projectModal);
    });
  });

  bindModalCloseEvents(projectModal, () => {
    closeModal(projectModal);
    resetProjectInterval();
  });


  // ==========================================
  // 3. DIGITAL ARCHIVES / ART GALLERY (28 RENDERS + SMART FIT)
  // ==========================================
  const artFiles = [
    "angry.jpg",
    "bell.jpg",
    "cansig5.jpg",
    "close1.jpg",
    "cross3.gif",
    "elkong.jpg",
    "eltigre.jpg",
    "evel2.jpg",
    "Grimstone_by_ashtreyhead.jpg",
    "Lanigan__s_Bluff_by_ashtreyhead.jpg",
    "limestone-peak1.jpg",
    "Lone_Pools_by_ashtreyhead.jpg",
    "lusty.gif",
    "Messiah_by_ashtreyhead.jpg",
    "Mustang_Gulch_by_ashtreyhead.jpg",
    "peewee_1.jpg",
    "pray.jpg",
    "Revereb_by_ashtreyhead.jpg",
    "rogues.jpg",
    "seal2.jpg",
    "thievesavitest1.jpg",
    "thunder.jpg",
    "tiger1eyes.gif",
    "trillian_by_ashtreyhead.jpg",
    "turningtospring.jpg",
    "Valerai_by_ashtreyhead.jpg",
    "wally.jpg",
    "Xaivier_by_ashtreyhead.jpg"
  ];

  const formatArtTitle = (filename) => {
    return filename
      .replace(/_by_ashtreyhead/gi, '')
      .replace(/\.(jpg|jpeg|png|gif)$/i, '')
      .replace(/__/g, "'")
      .replace(/[_-]+/g, ' ')
      .trim()
      .toUpperCase();
  };

  let currentArtIndex = Math.floor(Math.random() * artFiles.length);

  const artCardThumb = document.getElementById('art-card-thumb');
  const artCardBackdrop = document.getElementById('art-card-backdrop');
  const artCardTitle = document.getElementById('art-card-title');
  const artModal = document.getElementById('digital-archives-modal');
  const modalArtImg = document.getElementById('modal-art-img');
  const modalArtDesc = document.getElementById('modal-art-desc');
  const modalArtCounter = document.getElementById('modal-art-counter');

  // Smart aspect-ratio check: scales wide banners or tall portraits so they aren't heavily cropped
  if (artCardThumb) {
    artCardThumb.addEventListener('load', () => {
      const w = artCardThumb.naturalWidth || 1;
      const h = artCardThumb.naturalHeight || 1;
      const ratio = w / h;
      if (ratio > 1.72 || ratio < 1.12) {
        artCardThumb.classList.add('art-fit-contain');
      } else {
        artCardThumb.classList.remove('art-fit-contain');
      }
    });
  }

  const updateArtDisplay = (index) => {
    currentArtIndex = (index + artFiles.length) % artFiles.length;
    const file = artFiles[currentArtIndex];
    const cleanTitle = formatArtTitle(file);
    const fullPath = `images/art/${file}`;

    if (artCardBackdrop) artCardBackdrop.src = fullPath;
    if (artCardThumb) artCardThumb.src = fullPath;
    if (artCardTitle) artCardTitle.textContent = cleanTitle;
    if (modalArtImg) modalArtImg.src = fullPath;
    if (modalArtDesc) modalArtDesc.textContent = `${cleanTitle} — Early 2000s digital landscape/render.`;
    if (modalArtCounter) modalArtCounter.textContent = `${currentArtIndex + 1} / ${artFiles.length}`;
  };

  updateArtDisplay(currentArtIndex);

  let artInterval = setInterval(() => updateArtDisplay(currentArtIndex + 1), 6500);
  const resetArtInterval = () => {
    clearInterval(artInterval);
    artInterval = setInterval(() => updateArtDisplay(currentArtIndex + 1), 6500);
  };

  document.querySelectorAll('.open-archive-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(artInterval);
      updateArtDisplay(currentArtIndex);
      openModal(artModal);
    });
  });

  bindModalCloseEvents(artModal, () => {
    closeModal(artModal);
    resetArtInterval();
  });

  const modalArtPrev = document.getElementById('modal-art-prev');
  const modalArtNext = document.getElementById('modal-art-next');
  if (modalArtPrev) {
    modalArtPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateArtDisplay(currentArtIndex - 1);
    });
  }
  if (modalArtNext) {
    modalArtNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateArtDisplay(currentArtIndex + 1);
    });
  }

  attachTouchSwipe(
    document.getElementById('art-card-touch'),
    () => { updateArtDisplay(currentArtIndex + 1); resetArtInterval(); },
    () => { updateArtDisplay(currentArtIndex - 1); resetArtInterval(); }
  );
  attachTouchSwipe(
    document.getElementById('modal-art-touch'),
    () => updateArtDisplay(currentArtIndex + 1),
    () => updateArtDisplay(currentArtIndex - 1)
  );


  // ==========================================
  // 4. LIVE FEED TELEMETRY (CRT GLITCH, BREEZE & SERVER FLICKER)
  // ==========================================
  const gardenFeeds = [
    {
      num: "01",
      title: "// LIVE FEED TELEMETRY — CAM 01",
      desc: "CANOPY FEED 01 // SCROG TRELLIS & LED ARRAY ACTIVE",
      img: "images/livinggarden.png",
      mode: "garden"
    },
    {
      num: "02",
      title: "// LIVE FEED TELEMETRY — CAM 02",
      desc: "CANOPY FEED 02 // ENVIRONMENTAL TELEMETRY NOMINAL",
      img: "images/livinggarden2.png",
      mode: "garden"
    },
    {
      num: "03",
      title: "// LIVE FEED TELEMETRY — SERVER NODE 01",
      desc: "SERVER RACK 01 // NETWORK & TELEMETRY UPLINK ONLINE",
      img: "images/server.png",
      mode: "server"
    },
    {
      num: "04",
      title: "// LIVE FEED TELEMETRY — SERVER NODE 02",
      desc: "SERVER RACK 02 // STORAGE & AUTOMATION CLUSTER NOMINAL",
      img: "images/server2.png",
      mode: "server"
    }
  ];

  let currentGardenIndex = 1; // Starts on CAM 02 (livinggarden2.png)

  const cardGardenStage = document.getElementById('card-garden-stage');
  const gardenCardImg = document.getElementById('garden-card-img');
  const gardenFeedNum = document.getElementById('garden-feed-num');
  const gardenClock = document.getElementById('garden-clock');

  const gardenModal = document.getElementById('living-garden-modal');
  const modalGardenStage = document.getElementById('modal-garden-stage');
  const modalGardenImg = document.getElementById('modal-garden-img');
  const modalGardenTitle = document.getElementById('modal-garden-title');
  const modalGardenDesc = document.getElementById('modal-garden-desc');
  const modalGardenClock = document.getElementById('modal-garden-clock');

  const triggerCRTGlitch = (stageEl) => {
    if (!stageEl) return;
    stageEl.classList.remove('crt-glitch-active');
    void stageEl.offsetWidth; // Force reflow so animation restarts cleanly
    stageEl.classList.add('crt-glitch-active');
    setTimeout(() => {
      stageEl.classList.remove('crt-glitch-active');
    }, 300);
  };

  const applyFeedMode = (stageEl, imgEl, mode) => {
    if (!stageEl || !imgEl) return;
    stageEl.classList.toggle('mode-garden', mode === 'garden');
    stageEl.classList.toggle('mode-server', mode === 'server');

    imgEl.classList.toggle('garden-breeze', mode === 'garden');
    imgEl.classList.toggle('server-static', mode === 'server');
  };

  const updateGardenFeed = (index, withGlitch = true) => {
    currentGardenIndex = (index + gardenFeeds.length) % gardenFeeds.length;
    const feed = gardenFeeds[currentGardenIndex];

    if (withGlitch) {
      triggerCRTGlitch(cardGardenStage);
      if (activeModals.has(gardenModal)) {
        triggerCRTGlitch(modalGardenStage);
      }
    }

    if (gardenFeedNum) gardenFeedNum.textContent = feed.num;
    if (gardenCardImg) gardenCardImg.src = feed.img;
    applyFeedMode(cardGardenStage, gardenCardImg, feed.mode);

    if (modalGardenImg) modalGardenImg.src = feed.img;
    if (modalGardenTitle) modalGardenTitle.textContent = feed.title;
    if (modalGardenDesc) modalGardenDesc.textContent = feed.desc;
    applyFeedMode(modalGardenStage, modalGardenImg, feed.mode);
  };

  // Initialize without glitch on first load
  updateGardenFeed(currentGardenIndex, false);

  // Real-time 24h Telemetry Clock
  const updateTelemetryClocks = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    if (gardenClock) gardenClock.textContent = timeStr;
    if (modalGardenClock) modalGardenClock.textContent = timeStr;
  };
  updateTelemetryClocks();
  setInterval(updateTelemetryClocks, 1000);

  let gardenInterval = setInterval(() => updateGardenFeed(currentGardenIndex + 1, true), 9000);
  const resetGardenInterval = () => {
    clearInterval(gardenInterval);
    gardenInterval = setInterval(() => updateGardenFeed(currentGardenIndex + 1, true), 9000);
  };

  document.querySelectorAll('.open-garden-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(gardenInterval);
      updateGardenFeed(currentGardenIndex, false);
      openModal(gardenModal);
      triggerCRTGlitch(modalGardenStage);
    });
  });

  bindModalCloseEvents(gardenModal, () => {
    closeModal(gardenModal);
    resetGardenInterval();
  });

  const modalGardenPrev = document.getElementById('modal-garden-prev');
  const modalGardenNext = document.getElementById('modal-garden-next');
  if (modalGardenPrev) {
    modalGardenPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGardenFeed(currentGardenIndex - 1, true);
    });
  }
  if (modalGardenNext) {
    modalGardenNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGardenFeed(currentGardenIndex + 1, true);
    });
  }

  attachTouchSwipe(
    cardGardenStage,
    () => { updateGardenFeed(currentGardenIndex + 1, true); resetGardenInterval(); },
    () => { updateGardenFeed(currentGardenIndex - 1, true); resetGardenInterval(); }
  );
  attachTouchSwipe(
    modalGardenStage,
    () => updateGardenFeed(currentGardenIndex + 1, true),
    () => updateGardenFeed(currentGardenIndex - 1, true)
  );


  // ==========================================
  // 5. KEYBOARD NAVIGATION (ESC & LEFT/RIGHT ARROWS)
  // ==========================================
  window.addEventListener('keydown', (e) => {
    if (activeModals.size === 0) return;

    if (e.key === 'Escape') {
      activeModals.forEach(modal => closeModal(modal));
      resetProjectInterval();
      resetArtInterval();
      resetGardenInterval();
    } else if (e.key === 'ArrowLeft') {
      if (activeModals.has(projectModal)) updateProjectSlide(currentSlide - 1);
      if (activeModals.has(artModal)) updateArtDisplay(currentArtIndex - 1);
      if (activeModals.has(gardenModal)) updateGardenFeed(currentGardenIndex - 1, true);
    } else if (e.key === 'ArrowRight') {
      if (activeModals.has(projectModal)) updateProjectSlide(currentSlide + 1);
      if (activeModals.has(artModal)) updateArtDisplay(currentArtIndex + 1);
      if (activeModals.has(gardenModal)) updateGardenFeed(currentGardenIndex + 1, true);
    }
  });


  // ==========================================
  // 6. REAL-TIME FEEDS (RSS & GITHUB REST API)
  // ==========================================
  const fetchRSSFeed = async (rssUrl, linkId, titleId, descId, imgId, fallbackMsg) => {
    const linkEl = document.getElementById(linkId);
    const titleEl = document.getElementById(titleId);
    const descEl = document.getElementById(descId);
    const imgEl = document.getElementById(imgId);

    if (!titleEl) return;

    try {
      const res = await fetch(`[https://api.rss2json.com/v1/api.json?rss_url=$](https://api.rss2json.com/v1/api.json?rss_url=$){encodeURIComponent(rssUrl)}`);
      const data = await res.json();

      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const item = data.items[0];

        titleEl.textContent = item.title;
        if (linkEl && item.link) linkEl.href = item.link;

        if (descEl) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = item.description || item.content || '';
          const cleanText = tempDiv.textContent || tempDiv.innerText || '';
          descEl.textContent = cleanText.length > 120 ? cleanText.substring(0, 120) + '...' : cleanText;
        }

        if (imgEl) {
          let imgSrc = item.thumbnail || (item.enclosure && item.enclosure.link);
          if (!imgSrc) {
            const imgMatch = (item.content || item.description || '').match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) imgSrc = imgMatch[1];
          }
          if (imgSrc) imgEl.src = imgSrc;
        }
      } else {
        titleEl.textContent = fallbackMsg;
      }
    } catch (e) {
      titleEl.textContent = fallbackMsg;
    }
  };

  fetchRSSFeed(
    '[https://www.planetnatural.com/feed/](https://www.planetnatural.com/feed/)',
    'grow-feed-link',
    'grow-link-title',
    'grow-link-desc',
    'grow-link-img',
    'GROW FEED OFFLINE'
  );

  fetchRSSFeed(
    '[https://feeds.arstechnica.com/arstechnica/technology-lab](https://feeds.arstechnica.com/arstechnica/technology-lab)',
    'tech-feed-link',
    'rss-link-title',
    'rss-link-desc',
    'rss-link-img',
    'HARDWARE FEED OFFLINE'
  );

  // GitHub Commit Sync
  const fetchGitHub = async () => {
    const container = document.getElementById('github-feed-content');
    if (!container) return;

    try {
      const res = await fetch('[https://api.github.com/repos/PaulBKeys/Tomatoes-and-Transitors/commits](https://api.github.com/repos/PaulBKeys/Tomatoes-and-Transitors/commits)');
      if (!res.ok) throw new Error('Network error');
      const commits = await res.json();
      const latest = commits[0];
      const hash = latest.sha.substring(0, 7);

      const d = new Date(latest.commit.author.date);
      const dateStr = `[${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}]`;
      const msg = latest.commit.message.split('\n')[0];

      container.innerHTML = `
        <span style="color: #00D2FF;">${dateStr}</span> <span style="color: #FF2A2A;">#${hash}</span><br>
        <span style="color: #fff; word-break: break-word;">${msg}</span>
      `;
    } catch (e) {
      container.innerHTML = `<span style="color: var(--text-muted);">// CHANGELOG SYNCED LOCALLY</span>`;
    }
  };

  fetchGitHub();
});