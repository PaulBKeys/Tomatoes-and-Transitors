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
      document.querySelectorAll('.dock-nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-target') === 'home');
      });
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

  document.querySelectorAll('.dock-nav-link').forEach(navEl => {
    navEl.addEventListener('click', () => {
      document.querySelectorAll('.dock-nav-link').forEach(l => l.classList.remove('active'));
      navEl.classList.add('active');
    });
  });

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
  // 2. FEATURED PROJECTS CAROUSEL & MODAL (CALM 18s INTERVAL + NO DUPLICATE HERO)
  // ==========================================
  const projectsData = [
    {
      title: "Technology & Innovation",
      desc: "Exploring cloud, AI, frontend architecture, and the systems shaping tomorrow.",
      img: "images/VS_thumb1.png"
    },
    {
      title: "Learning & Reinvention",
      desc: "A CIS student's journey of lifelong learning and starting a new chapter at 53.",
      img: "images/mock2.png"
    },
    {
      title: "Building & Experimentation",
      desc: "Hands-on projects, electronics, and experiments in my workshop and home lab.",
      img: "images/mock3.png"
    },
    {
      title: "Gardening & Growing Things",
      desc: "Cultivating plants, canopy management, and sustainable indoor horticulture.",
      img: "images/mock4.png"
    },
    {
      title: "Music & Coffee",
      desc: "Punk rock, 90s alt-rock, and the daily fuel behind every coding session.",
      img: "images/mock5.png"
    },
    {
      title: "Story & Journey",
      desc: "From 8-bit keyboards and diesel engines to modern code—documenting the build along the way.",
      img: "images/server.png"
    }
  ];

  const PROJ_CYCLE_MS = 18000;
  const projectsCard = document.getElementById('projects');
  const imagesTrack = document.getElementById('dynamic-project-images');
  const dotsContainer = document.getElementById('carousel-dots-container');
  const cardProjTitle = document.getElementById('card-proj-title');
  const cardProjDesc = document.getElementById('card-proj-desc');

  const projectModal = document.getElementById('featured-project-modal');
  const modalProjImg = document.getElementById('modal-project-img');
  const modalProjHeading = document.getElementById('modal-project-heading');
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

    if (imagesTrack) {
      imagesTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slideImages.forEach((img, i) => img.classList.toggle('active', i === currentSlide));
    navDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));

    const activeData = projectsData[currentSlide];
    if (cardProjTitle) cardProjTitle.textContent = activeData.title;
    if (cardProjDesc) cardProjDesc.textContent = activeData.desc;

    if (modalProjImg) modalProjImg.src = activeData.img;
    if (modalProjTitle) modalProjTitle.textContent = `// ${activeData.title.toUpperCase()}`;
    if (modalProjHeading) modalProjHeading.textContent = activeData.title;
    if (modalProjDesc) modalProjDesc.textContent = activeData.desc;
    if (modalProjCounter) modalProjCounter.textContent = `${currentSlide + 1} / ${projectsData.length}`;
  };

  let projectInterval = setInterval(() => updateProjectSlide(currentSlide + 1), PROJ_CYCLE_MS);
  const resetProjectInterval = () => {
    clearInterval(projectInterval);
    projectInterval = setInterval(() => updateProjectSlide(currentSlide + 1), PROJ_CYCLE_MS);
  };

  if (projectsCard) {
    projectsCard.addEventListener('mouseenter', () => clearInterval(projectInterval));
    projectsCard.addEventListener('mouseleave', () => {
      if (!activeModals.has(projectModal)) resetProjectInterval();
    });
  }

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

  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      updateProjectSlide(parseInt(e.target.getAttribute('data-index'), 10));
      resetProjectInterval();
    });
  });

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

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (
        e.target.closest('.carousel-footer-nav') ||
        e.target.classList.contains('page-dot') ||
        e.target.classList.contains('carousel-footer-btn')
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
  // 3. DIGITAL ARCHIVES / ART GALLERY (TOP-RIGHT SHOWCASE + 14s CYCLE)
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

  const ART_CYCLE_MS = 14000;

  const formatArtTitle = (filename) => {
    const customNames = {
      "turningtospring.jpg": "Turning to Spring",
      "eltigre.jpg": "El Tigre",
      "elkong.jpg": "El Kong",
      "thievesavitest1.jpg": "Thieves AVI Test 1",
      "tiger1eyes.gif": "Tiger Eyes",
      "cansig5.jpg": "Cansig 5",
      "close1.jpg": "Close 1",
      "cross3.gif": "Cross 3",
      "evel2.jpg": "Evel 2",
      "seal2.jpg": "Seal 2"
    };
    if (customNames[filename]) return customNames[filename];

    const raw = filename
      .replace(/_by_ashtreyhead/gi, '')
      .replace(/\.(jpg|jpeg|png|gif)$/i, '')
      .replace(/__/g, "'")
      .replace(/[_-]+/g, ' ')
      .trim();
    return raw.replace(/(^|\s)\w/g, c => c.toUpperCase());
  };

  let currentArtIndex = Math.floor(Math.random() * artFiles.length);

  const archivesCard = document.getElementById('archives');
  const artCardThumb = document.getElementById('art-card-thumb');
  const artCardBackdrop = document.getElementById('art-card-backdrop');
  const artCardTitle = document.getElementById('art-card-title');
  const cardArtCounter = document.getElementById('card-art-counter');

  const artModal = document.getElementById('digital-archives-modal');
  const modalArtImg = document.getElementById('modal-art-img');
  const modalArtBackdrop = document.getElementById('modal-art-backdrop');
  const modalArtHeading = document.getElementById('modal-art-heading');
  const modalArtDesc = document.getElementById('modal-art-desc');
  const modalArtCounter = document.getElementById('modal-art-counter');

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
    const countLabel = `${currentArtIndex + 1} / ${artFiles.length}`;

    if (artCardBackdrop) artCardBackdrop.src = fullPath;
    if (artCardThumb) artCardThumb.src = fullPath;
    if (artCardTitle) artCardTitle.textContent = cleanTitle;
    if (cardArtCounter) cardArtCounter.textContent = countLabel;

    if (modalArtBackdrop) modalArtBackdrop.src = fullPath;
    if (modalArtImg) modalArtImg.src = fullPath;
    if (modalArtHeading) modalArtHeading.textContent = cleanTitle;
    if (modalArtDesc) modalArtDesc.textContent = `Early 2000s 3D landscape & digital render from the archives (${file}).`;
    if (modalArtCounter) modalArtCounter.textContent = countLabel;
  };

  updateArtDisplay(currentArtIndex);

  let artInterval = setInterval(() => updateArtDisplay(currentArtIndex + 1), ART_CYCLE_MS);
  const resetArtInterval = () => {
    clearInterval(artInterval);
    artInterval = setInterval(() => updateArtDisplay(currentArtIndex + 1), ART_CYCLE_MS);
  };

  if (archivesCard) {
    archivesCard.addEventListener('mouseenter', () => clearInterval(artInterval));
    archivesCard.addEventListener('mouseleave', () => {
      if (!activeModals.has(artModal)) resetArtInterval();
    });
  }

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
  // 4. LIVE FEED VIDEO TELEMETRY (4 KLING CLIPS + 8s CRT CUT)
  // ==========================================
  const gardenFeeds = [
    {
      num: "01",
      title: "// LIVE FEED TELEMETRY — NODE 01",
      heading: "Canopy Feed 01 — Subterranean Cavern Sector",
      desc: "Deep-rock vault cultivation array with automated trellis tracking and pressurized atmospheric misting.",
      video: "images/growroom_2.mp4"
    },
    {
      num: "02",
      title: "// LIVE FEED TELEMETRY — NODE 02",
      heading: "Server Core 02 — Mainframe & Network Uplink",
      desc: "Subterranean server corridor running routing arrays, sensor logging, and automated telemetry.",
      video: "images/serverroom_1.mp4"
    },
    {
      num: "03",
      title: "// LIVE FEED TELEMETRY — NODE 03",
      heading: "Canopy Feed 03 — Lower Aisle Hydro Array",
      desc: "Secondary cavern growth chamber monitoring high-density canopy foliage and nutrient irrigation lines.",
      video: "images/growroom_3.mp4"
    },
    {
      num: "04",
      title: "// LIVE FEED TELEMETRY — NODE 04",
      heading: "Reactor Sub-Level 04 — Power & Cooling Sector",
      desc: "Heavy-duty mechanical turbines and high-pressure steam cooling infrastructure.",
      video: "images/steamroom.mp4"
    }
  ];

  const GARDEN_CYCLE_MS = 8000;
  let currentGardenIndex = 0;

  const growthCard = document.getElementById('growth');
  const cardGardenStage = document.getElementById('card-garden-stage');
  const cardFeedVideo = document.getElementById('card-feed-video');
  const gardenFeedNum = document.getElementById('garden-feed-num');
  const gardenClock = document.getElementById('garden-clock');

  const gardenModal = document.getElementById('living-garden-modal');
  const modalGardenStage = document.getElementById('modal-garden-stage');
  const modalFeedVideo = document.getElementById('modal-feed-video');
  const modalGardenTitle = document.getElementById('modal-garden-title');
  const modalGardenHeading = document.getElementById('modal-garden-heading');
  const modalGardenDesc = document.getElementById('modal-garden-desc');
  const modalGardenClock = document.getElementById('modal-garden-clock');

  const triggerCRTGlitch = (stageEl) => {
    if (!stageEl) return;
    stageEl.classList.remove('crt-glitch-active');
    void stageEl.offsetWidth;
    stageEl.classList.add('crt-glitch-active');
    setTimeout(() => {
      stageEl.classList.remove('crt-glitch-active');
    }, 300);
  };

  const loadAndPlayVideo = (videoEl, src, syncTime = 0) => {
    if (!videoEl) return;
    if (videoEl.getAttribute('src') !== src) {
      videoEl.setAttribute('src', src);
      videoEl.load();
    }
    try {
      videoEl.currentTime = syncTime;
    } catch (e) {}
    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
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
    loadAndPlayVideo(cardFeedVideo, feed.video, 0);

    if (modalGardenTitle) modalGardenTitle.textContent = feed.title;
    if (modalGardenHeading) modalGardenHeading.textContent = feed.heading;
    if (modalGardenDesc) modalGardenDesc.textContent = feed.desc;

    if (activeModals.has(gardenModal)) {
      loadAndPlayVideo(modalFeedVideo, feed.video, 0);
    } else if (modalFeedVideo) {
      modalFeedVideo.setAttribute('src', feed.video);
    }
  };

  updateGardenFeed(0, false);

  const updateTelemetryClocks = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    if (gardenClock) gardenClock.textContent = timeStr;
    if (modalGardenClock) modalGardenClock.textContent = timeStr;
  };
  updateTelemetryClocks();
  setInterval(updateTelemetryClocks, 1000);

  let gardenInterval = setInterval(() => updateGardenFeed(currentGardenIndex + 1, true), GARDEN_CYCLE_MS);
  const resetGardenInterval = () => {
    clearInterval(gardenInterval);
    gardenInterval = setInterval(() => updateGardenFeed(currentGardenIndex + 1, true), GARDEN_CYCLE_MS);
  };

  if (growthCard) {
    growthCard.addEventListener('mouseenter', () => clearInterval(gardenInterval));
    growthCard.addEventListener('mouseleave', () => {
      if (!activeModals.has(gardenModal)) resetGardenInterval();
    });
  }

  document.querySelectorAll('.open-garden-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(gardenInterval);
      const feed = gardenFeeds[currentGardenIndex];
      const syncTime = cardFeedVideo ? cardFeedVideo.currentTime || 0 : 0;

      if (modalGardenTitle) modalGardenTitle.textContent = feed.title;
      if (modalGardenHeading) modalGardenHeading.textContent = feed.heading;
      if (modalGardenDesc) modalGardenDesc.textContent = feed.desc;

      openModal(gardenModal);
      loadAndPlayVideo(modalFeedVideo, feed.video, syncTime);
      triggerCRTGlitch(modalGardenStage);
    });
  });

  bindModalCloseEvents(gardenModal, () => {
    if (modalFeedVideo) modalFeedVideo.pause();
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
      if (activeModals.has(gardenModal) && modalFeedVideo) {
        modalFeedVideo.pause();
      }
      Array.from(activeModals).forEach(modal => closeModal(modal));
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
  // 6. UNIFIED DAILY FEED (GROW & TECH WITH FILTER PILLS)
  // ==========================================
  const growFeedSources = [
    { name: "EPIC GARDENING", url: "https://www.epicgardening.com/feed/", category: "grow" },
    { name: "HOMESTEAD & CHILL", url: "https://homesteadandchill.com/feed/", category: "grow" },
    { name: "SAVVY GARDENING", url: "https://savvygardening.com/feed/", category: "grow" },
    { name: "JOE GARDENER", url: "https://joegardener.com/feed/", category: "grow" },
    { name: "PLANET NATURAL", url: "https://www.planetnatural.com/feed/", category: "grow" }
  ];

  const techFeedSources = [
    { name: "HACKADAY", url: "https://hackaday.com/blog/feed/", category: "tech" },
    { name: "ARS TECHNICA", url: "https://feeds.arstechnica.com/arstechnica/index", category: "tech" },
    { name: "TOM'S HARDWARE", url: "https://www.tomshardware.com/feeds/all", category: "tech" },
    { name: "SERVETHEHOME", url: "https://www.servethehome.com/feed/", category: "tech" },
    { name: "JEFF GEERLING", url: "https://www.jeffgeerling.com/blog.xml", category: "tech" }
  ];

  const growFallbackPool = [
    {
      category: "grow",
      source: "EPIC GARDENING",
      title: "Soil Perlite Ratios, Fabric Grow Bags & Root Zone Oxygenation Guide",
      desc: "How breathable fabric containers and proper aeration amendments prevent root-bound stress and boost nutrient uptake.",
      link: "https://www.epicgardening.com/",
      img: "images/livinggarden.png"
    },
    {
      category: "grow",
      source: "HOMESTEAD & CHILL",
      title: "Organic Canopy Management: Trellis Netting, Pruning & Lollipopping",
      desc: "Opening up lower canopy airflow and directing plant energy toward top colas and fruiting sites.",
      link: "https://homesteadandchill.com/",
      img: "images/livinggarden2.png"
    },
    {
      category: "grow",
      source: "PLANET NATURAL",
      title: "Biological Pest Control: Using Predatory Mites in Indoor Grow Tents",
      desc: "Integrated pest management strategies to keep spider mites and fungus gnats out of your indoor garden.",
      link: "https://www.planetnatural.com/",
      img: "images/mock4.png"
    }
  ];

  const techFallbackPool = [
    {
      category: "tech",
      source: "HACKADAY",
      title: "Building Custom Environmental Telemetry Nodes & Retro Hardware Mods",
      desc: "From 8-bit Sinclair ZX81 keyboard conversions to modern microcontroller sensor arrays and automated relays.",
      link: "https://hackaday.com/",
      img: "images/server.png"
    },
    {
      category: "tech",
      source: "SERVETHEHOME",
      title: "Quiet Home Lab Server Builds, Wake-on-LAN Automation & Power Efficiency",
      desc: "Configuring headless nodes, remote packet wake triggers, and low-wattage 24/7 home lab clusters.",
      link: "https://www.servethehome.com/",
      img: "images/server2.png"
    },
    {
      category: "tech",
      source: "ARS TECHNICA",
      title: "Cloud Infrastructure, AI Workloads & Next-Gen Networking Protocols",
      desc: "Inside the hardware architectures powering modern distributed computing and local edge servers.",
      link: "https://arstechnica.com/",
      img: "images/VS_thumb1.png"
    }
  ];

  const stripHtmlToText = (html) => {
    if (!html) return "";
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = (temp.textContent || temp.innerText || "").replace(/\s+/g, ' ').trim();
    return text.length > 130 ? `${text.substring(0, 130)}...` : text;
  };

  const extractImageFromHtml = (html) => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match && match[1] && !match[1].includes('1x1') && !match[1].includes('pixel')) {
      return match[1];
    }
    return null;
  };

  const fetchViaRss2Json = async (sourceObj, defaultFallbackImg) => {
    const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(sourceObj.url)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('rss2json HTTP error');
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('rss2json empty');
    }
    return data.items.slice(0, 2).map(item => {
      const img =
        item.thumbnail ||
        (item.enclosure && (item.enclosure.link || item.enclosure.thumbnail)) ||
        extractImageFromHtml(item.content || item.description) ||
        defaultFallbackImg;
      return {
        category: sourceObj.category,
        source: sourceObj.name,
        title: item.title,
        desc: stripHtmlToText(item.description || item.content) || `Latest update from ${sourceObj.name}.`,
        link: item.link,
        img
      };
    });
  };

  const fetchViaXmlProxy = async (sourceObj, defaultFallbackImg) => {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceObj.url)}`,
      `https://corsproxy.io/?${encodeURIComponent(sourceObj.url)}`
    ];

    for (const proxyUrl of proxies) {
      try {
        const res = await fetch(proxyUrl);
        if (!res.ok) continue;
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items = Array.from(xmlDoc.querySelectorAll("item, entry")).slice(0, 2);
        if (items.length === 0) continue;

        return items.map(node => {
          const title = (node.querySelector("title")?.textContent || "").trim();
          const linkNode = node.querySelector("link");
          const link = (linkNode?.getAttribute("href") || linkNode?.textContent || "").trim();
          const rawDesc =
            node.querySelector("description")?.textContent ||
            node.querySelector("summary")?.textContent ||
            node.querySelector("content")?.textContent ||
            "";
          const encoded = node.getElementsByTagNameNS("*", "encoded")[0]?.textContent || "";

          let img = null;
          const mediaContent = node.getElementsByTagNameNS("*", "content")[0];
          const mediaThumb = node.getElementsByTagNameNS("*", "thumbnail")[0];
          const enclosure = node.querySelector("enclosure");

          if (mediaContent && mediaContent.getAttribute("url")) {
            img = mediaContent.getAttribute("url");
          } else if (mediaThumb && mediaThumb.getAttribute("url")) {
            img = mediaThumb.getAttribute("url");
          } else if (enclosure && enclosure.getAttribute("url")) {
            img = enclosure.getAttribute("url");
          } else {
            img = extractImageFromHtml(encoded || rawDesc);
          }

          return {
            category: sourceObj.category,
            source: sourceObj.name,
            title: title || `Latest from ${sourceObj.name}`,
            desc: stripHtmlToText(rawDesc || encoded) || `Read the full article on ${sourceObj.name}.`,
            link: link || "https://github.com/PaulBKeys",
            img: img || defaultFallbackImg
          };
        });
      } catch (e) {}
    }
    throw new Error('All XML proxies failed');
  };

  const applyFeedThumbnail = (imgEl, newSrc, fallbackSrc) => {
    if (!imgEl) return;
    const safeFallback = fallbackSrc || 'images/livinggarden.png';
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = safeFallback;
    };
    imgEl.src = newSrc || safeFallback;
  };

  const initUnifiedDailyFeed = async () => {
    const DAILY_CYCLE_MS = 15000;
    const cardEl = document.getElementById('daily-feed-link');
    const headerLabelEl = document.getElementById('daily-feed-header-label');
    const badgeEl = document.getElementById('daily-source-badge');
    const titleEl = document.getElementById('daily-link-title');
    const descEl = document.getElementById('daily-link-desc');
    const imgEl = document.getElementById('daily-link-img');
    const textWrapEl = document.getElementById('daily-text-wrap');
    const filterBtns = document.querySelectorAll('.feed-filter-btn');

    if (!cardEl || !titleEl) return;

    let masterPool = [
      growFallbackPool[0],
      techFallbackPool[0],
      growFallbackPool[1],
      techFallbackPool[1],
      growFallbackPool[2],
      techFallbackPool[2]
    ];
    let activeMode = 'all';
    let currentIndex = 0;

    const getFilteredPool = () => {
      if (activeMode === 'all') return masterPool;
      const filtered = masterPool.filter(item => item.category === activeMode);
      return filtered.length > 0 ? filtered : masterPool;
    };

    const renderDailyItem = (item) => {
      if (!item) return;
      const isTech = item.category === 'tech';
      const defaultFallback = isTech ? 'images/server2.png' : 'images/livinggarden.png';

      cardEl.classList.toggle('theme-cyan', isTech);
      cardEl.classList.toggle('theme-green', !isTech);
      if (headerLabelEl) {
        headerLabelEl.textContent = isTech ? 'TECH DECK' : 'GROW FEED';
      }

      if (textWrapEl) textWrapEl.classList.add('feed-fade-transition');

      setTimeout(() => {
        if (badgeEl) badgeEl.textContent = item.source;
        titleEl.textContent = item.title;
        if (descEl) descEl.textContent = item.desc;
        cardEl.href = item.link;
        cardEl.title = `[${item.source}] ${item.title}`;
        applyFeedThumbnail(imgEl, item.img, defaultFallback);

        if (textWrapEl) textWrapEl.classList.remove('feed-fade-transition');
      }, 160);
    };

    const stepFeed = () => {
      const pool = getFilteredPool();
      currentIndex = (currentIndex + 1) % pool.length;
      renderDailyItem(pool[currentIndex]);
    };

    let dailyTimer = setInterval(stepFeed, DAILY_CYCLE_MS);
    const resetDailyTimer = () => {
      clearInterval(dailyTimer);
      dailyTimer = setInterval(stepFeed, DAILY_CYCLE_MS);
    };

    cardEl.addEventListener('mouseenter', () => clearInterval(dailyTimer));
    cardEl.addEventListener('mouseleave', resetDailyTimer);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMode = btn.getAttribute('data-feed-mode') || 'all';
        currentIndex = 0;
        const pool = getFilteredPool();
        renderDailyItem(pool[0]);
        resetDailyTimer();
      });
    });

    // Load cached pool if fresh
    try {
      const cachedRaw = localStorage.getItem('tt_unified_daily_pool_v1');
      if (cachedRaw) {
        const cachedObj = JSON.parse(cachedRaw);
        if (cachedObj && Array.isArray(cachedObj.items) && cachedObj.items.length > 0) {
          masterPool = cachedObj.items;
          renderDailyItem(getFilteredPool()[0]);
          if (Date.now() - cachedObj.timestamp < 30 * 60 * 1000) {
            return;
          }
        }
      }
    } catch (e) {}

    renderDailyItem(getFilteredPool()[0]);

    const allSources = [...growFeedSources, ...techFeedSources];
    const fetchedLists = await Promise.all(
      allSources.map(async (src) => {
        const fallbackImg = src.category === 'tech' ? 'images/server2.png' : 'images/livinggarden.png';
        try {
          return await fetchViaRss2Json(src, fallbackImg);
        } catch (e1) {
          try {
            return await fetchViaXmlProxy(src, fallbackImg);
          } catch (e2) {
            return [];
          }
        }
      })
    );

    const growLists = fetchedLists.slice(0, growFeedSources.length).flat();
    const techLists = fetchedLists.slice(growFeedSources.length).flat();

    const interleaved = [];
    const maxLen = Math.max(growLists.length, techLists.length);
    for (let i = 0; i < maxLen; i++) {
      if (growLists[i]) interleaved.push(growLists[i]);
      if (techLists[i]) interleaved.push(techLists[i]);
    }

    if (interleaved.length > 0) {
      masterPool = interleaved;
      currentIndex = 0;
      renderDailyItem(getFilteredPool()[0]);
      try {
        localStorage.setItem('tt_unified_daily_pool_v1', JSON.stringify({
          timestamp: Date.now(),
          items: interleaved
        }));
      } catch (e) {}
    }
  };

  initUnifiedDailyFeed();


  // ==========================================
  // 7. EXPANDED GITHUB TELEMETRY (RECENT COMMITS + LANGUAGE BAR)
  // ==========================================
  const defaultLangSplit = { html: 26, css: 43, js: 31 };

  const renderGitHubTelemetry = (container, commitsList, langSplit = defaultLangSplit) => {
    const commitsHtml = commitsList.slice(0, 2).map(c => `
      <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="github-commit-link" title="View commit on GitHub: ${c.msg}">
        <span style="color: #00D2FF;">${c.dateStr}</span> <span style="color: #FF2A2A;">#${c.hash}</span>
        <span class="github-commit-msg">${c.msg}</span>
      </a>
    `).join('');

    container.innerHTML = `
      <div class="gh-commits-list">
        ${commitsHtml}
      </div>
      <div class="gh-telemetry-wrap">
        <div class="gh-lang-bar" title="Repository Code Composition">
          <span class="gh-lang-seg gh-seg-html" style="width: ${langSplit.html}%"></span>
          <span class="gh-lang-seg gh-seg-css" style="width: ${langSplit.css}%"></span>
          <span class="gh-lang-seg gh-seg-js" style="width: ${langSplit.js}%"></span>
        </div>
        <div class="gh-lang-legend">
          <div class="gh-legend-items">
            <span class="gh-legend-item"><i class="gh-legend-dot gh-seg-html"></i>HTML ${langSplit.html}%</span>
            <span class="gh-legend-item"><i class="gh-legend-dot gh-seg-css"></i>CSS ${langSplit.css}%</span>
            <span class="gh-legend-item"><i class="gh-legend-dot gh-seg-js"></i>JS ${langSplit.js}%</span>
          </div>
          <span class="gh-branch-tag">MAIN &#10003;</span>
        </div>
      </div>
    `;
  };

  const fetchGitHub = async () => {
    const container = document.getElementById('github-feed-content');
    if (!container) return;

    let langSplit = { ...defaultLangSplit };
    try {
      const cachedLangs = localStorage.getItem('tt_repo_langs');
      if (cachedLangs) langSplit = JSON.parse(cachedLangs);
    } catch (e) {}

    const repoBases = [
      'https://api.github.com/repos/PaulBKeys/Tomatoes-and-Transitors',
      'https://api.github.com/repos/PaulBKeys/Tomatoes-and-Transistors'
    ];

    for (const base of repoBases) {
      try {
        const [commitsRes, langsRes] = await Promise.all([
          fetch(`${base}/commits`),
          fetch(`${base}/languages`)
        ]);

        if (langsRes.ok) {
          const langBytes = await langsRes.json();
          const hBytes = langBytes.HTML || 0;
          const cBytes = langBytes.CSS || 0;
          const jBytes = langBytes.JavaScript || 0;
          const total = hBytes + cBytes + jBytes;
          if (total > 0) {
            const htmlPct = Math.max(5, Math.round((hBytes / total) * 100));
            const cssPct = Math.max(5, Math.round((cBytes / total) * 100));
            const jsPct = Math.max(5, 100 - htmlPct - cssPct);
            langSplit = { html: htmlPct, css: cssPct, js: jsPct };
            localStorage.setItem('tt_repo_langs', JSON.stringify(langSplit));
          }
        }

        if (!commitsRes.ok) continue;
        const commits = await commitsRes.json();
        if (!Array.isArray(commits) || commits.length === 0) continue;

        const formattedCommits = commits.slice(0, 2).map(c => {
          const hash = c.sha.substring(0, 7);
          const d = new Date(c.commit.author.date);
          const dateStr = `[${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}]`;
          const msg = c.commit.message.split('\n')[0];
          const url = c.html_url || 'https://github.com/PaulBKeys/Tomatoes-and-Transitors';
          return { hash, dateStr, msg, url };
        });

        localStorage.setItem('tt_latest_commits_v2', JSON.stringify(formattedCommits));
        renderGitHubTelemetry(container, formattedCommits, langSplit);
        return;
      } catch (err) {}
    }

    const cached = localStorage.getItem('tt_latest_commits_v2');
    if (cached) {
      try {
        renderGitHubTelemetry(container, JSON.parse(cached), langSplit);
        return;
      } catch (e) {}
    }

    renderGitHubTelemetry(container, [
      {
        dateStr: '[2026-10-14]',
        hash: '5316397',
        msg: 'Change_V4: Bento architecture & telemetry updates',
        url: 'https://github.com/PaulBKeys/Tomatoes-and-Transitors'
      },
      {
        dateStr: '[2026-10-12]',
        hash: '8a4b210',
        msg: 'Responsive viewport & modal carousel refinements',
        url: 'https://github.com/PaulBKeys/Tomatoes-and-Transitors'
      }
    ], langSplit);
  };

  fetchGitHub();


  // ==========================================
  // 8. SPOTIFY PLAYBACK BORDER GLOW LISTENER
  // ==========================================
  const audioDeckCard = document.getElementById('audio-deck-card');

  window.addEventListener('message', (e) => {
    if (!e.origin || !e.origin.includes('spotify.com')) return;
    try {
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (data && data.type === 'playback_update' && data.payload && audioDeckCard) {
        audioDeckCard.classList.toggle('audio-playing', !data.payload.isPaused);
      }
    } catch (err) {}
  });

});