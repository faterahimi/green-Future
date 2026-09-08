"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const navbar = document.getElementById("navbar");

  const hero = document.getElementById("home");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroNext = document.getElementById("heroNext");
  const heroPrev = document.getElementById("heroPrev");
  const slideCounter = document.getElementById("slideCounter");

  const revealElements = document.querySelectorAll(".reveal");

  const galleryItems = document.querySelectorAll(".gallery-card");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxCounter = document.getElementById("lightboxCounter");

  const closeLightbox = document.getElementById("closeLightbox");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxPrev = document.getElementById("lightboxPrev");


  /* =====================================================
     MOBILE NAVIGATION
  ===================================================== */

  if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

      const isOpen = mobileMenu.classList.toggle("open");

      menuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );

    });


    mobileLinks.forEach((link) => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

        menuBtn.setAttribute(
          "aria-label",
          "Open menu"
        );

      });

    });

  }


  /* =====================================================
     NAVBAR SCROLL
  ===================================================== */

  function updateNavbar() {

    if (!navbar) {
      return;
    }

    if (window.scrollY > 60) {

      navbar.classList.remove("bg-black/10");

      navbar.classList.add(
        "bg-black/70",
        "shadow-lg"
      );

    } else {

      navbar.classList.remove(
        "bg-black/70",
        "shadow-lg"
      );

      navbar.classList.add(
        "bg-black/10"
      );

    }

  }

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();


  /* =====================================================
     HERO SLIDER
  ===================================================== */

  let heroIndex = 0;
  let heroTimer = null;

  const HERO_INTERVAL = 7000;


  function showHeroSlide(index) {

    if (!heroSlides.length) {
      return;
    }

    heroSlides.forEach((slide) => {
      slide.classList.remove("active");
    });

    heroSlides[index].classList.add("active");

    if (slideCounter) {

      slideCounter.textContent =
        `${String(index + 1).padStart(2, "0")} / ${String(heroSlides.length).padStart(2, "0")}`;

    }

  }


  function nextHero() {

    if (!heroSlides.length) {
      return;
    }

    heroIndex =
      (heroIndex + 1) %
      heroSlides.length;

    showHeroSlide(heroIndex);

  }


  function previousHero() {

    if (!heroSlides.length) {
      return;
    }

    heroIndex =
      (heroIndex - 1 + heroSlides.length) %
      heroSlides.length;

    showHeroSlide(heroIndex);

  }


  function restartHeroTimer() {

    clearInterval(heroTimer);

    heroTimer = setInterval(
      nextHero,
      HERO_INTERVAL
    );

  }


  if (heroNext) {

    heroNext.addEventListener(
      "click",
      () => {

        nextHero();
        restartHeroTimer();

      }
    );

  }


  if (heroPrev) {

    heroPrev.addEventListener(
      "click",
      () => {

        previousHero();
        restartHeroTimer();

      }
    );

  }


  showHeroSlide(0);
  restartHeroTimer();


  /* =====================================================
     HERO TOUCH SWIPE
  ===================================================== */

  let touchStartX = 0;

  if (hero) {

    hero.addEventListener(
      "touchstart",
      (event) => {

        touchStartX =
          event.changedTouches[0].screenX;

      },
      { passive: true }
    );


    hero.addEventListener(
      "touchend",
      (event) => {

        const touchEndX =
          event.changedTouches[0].screenX;

        const distance =
          touchEndX - touchStartX;

        if (Math.abs(distance) < 50) {
          return;
        }

        if (distance < 0) {
          nextHero();
        } else {
          previousHero();
        }

        restartHeroTimer();

      },
      { passive: true }
    );

  }


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("show");

              revealObserver.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    /* Fallback for old browsers */

    revealElements.forEach((element) => {
      element.classList.add("show");
    });

  }


  /* =====================================================
     GALLERY FILTER
  ===================================================== */

  let currentFilter = "all";


  function updateFilterButtons(activeButton) {

    filterButtons.forEach((button) => {

      button.classList.remove(
        "bg-zinc-800",
        "text-white"
      );

      button.classList.add(
        "border",
        "border-zinc-200",
        "text-zinc-500"
      );

    });


    activeButton.classList.remove(
      "border",
      "border-zinc-200",
      "text-zinc-500"
    );

    activeButton.classList.add(
      "bg-zinc-800",
      "text-white"
    );

  }


  function filterGallery() {

    galleryItems.forEach((item) => {

      const category =
        item.dataset.category;

      const shouldShow =
        currentFilter === "all" ||
        category === currentFilter;


      if (shouldShow) {

        item.style.display = "";

        requestAnimationFrame(() => {

          item.style.opacity = "1";
          item.style.transform =
            "translateY(0) scale(1)";

        });

      } else {

        item.style.opacity = "0";

        item.style.transform =
          "translateY(20px) scale(.96)";

        setTimeout(() => {

          if (
            currentFilter !== "all" &&
            item.dataset.category !== currentFilter
          ) {

            item.style.display = "none";

          }

        }, 350);

      }

    });

  }


  filterButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        currentFilter =
          button.dataset.filter;

        updateFilterButtons(button);

        filterGallery();

      }
    );

  });


  /* =====================================================
     LIGHTBOX
  ===================================================== */

  let visibleImages = [];
  let currentImageIndex = 0;


  function getVisibleImages() {

    return [...galleryItems].filter(
      (item) =>
        window.getComputedStyle(item).display !== "none"
    );

  }


  function updateLightbox() {

    if (!visibleImages.length) {
      return;
    }

    const item =
      visibleImages[currentImageIndex];

    const image =
      item.querySelector(".gallery-image");

    if (!image) {
      return;
    }


    lightboxImage.style.opacity = "0";


    setTimeout(() => {

      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;

      lightboxTitle.textContent =
        image.dataset.title || image.alt;

      lightboxCategory.textContent =
        item.dataset.category;

      lightboxCounter.textContent =
        `${currentImageIndex + 1} / ${visibleImages.length}`;

      lightboxImage.style.opacity = "1";

    }, 120);

  }


  function openLightbox(index) {

    visibleImages =
      getVisibleImages();

    if (!visibleImages.length) {
      return;
    }

    currentImageIndex = index;

    updateLightbox();

    lightbox.classList.add("open");

    document.body.classList.add(
      "overflow-hidden"
    );

  }


  function closeLightboxView() {

    lightbox.classList.remove("open");

    document.body.classList.remove(
      "overflow-hidden"
    );

  }


  function nextImage() {

    if (!visibleImages.length) {
      return;
    }

    currentImageIndex =
      (currentImageIndex + 1) %
      visibleImages.length;

    updateLightbox();

  }


  function previousImage() {

    if (!visibleImages.length) {
      return;
    }

    currentImageIndex =
      (currentImageIndex - 1 + visibleImages.length) %
      visibleImages.length;

    updateLightbox();

  }


  galleryItems.forEach((item) => {

    item.addEventListener(
      "click",
      () => {

        const visible =
          getVisibleImages();

        const index =
          visible.indexOf(item);

        if (index !== -1) {
          openLightbox(index);
        }

      }
    );

  });


  /* =====================================================
     LIGHTBOX BUTTONS
  ===================================================== */

  if (closeLightbox) {

    closeLightbox.addEventListener(
      "click",
      closeLightboxView
    );

  }


  if (lightboxNext) {

    lightboxNext.addEventListener(
      "click",
      nextImage
    );

  }


  if (lightboxPrev) {

    lightboxPrev.addEventListener(
      "click",
      previousImage
    );

  }


  /* =====================================================
     LIGHTBOX BACKGROUND
  ===================================================== */

  lightbox.addEventListener(
    "click",
    (event) => {

      if (event.target === lightbox) {
        closeLightboxView();
      }

    }
  );


  /* =====================================================
     KEYBOARD
  ===================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      if (!lightbox.classList.contains("open")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightboxView();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

    }
  );


  /* =====================================================
     LIGHTBOX TOUCH SWIPE
  ===================================================== */

  let lightboxTouchStartX = 0;


  lightbox.addEventListener(
    "touchstart",
    (event) => {

      lightboxTouchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  lightbox.addEventListener(
    "touchend",
    (event) => {

      const lightboxTouchEndX =
        event.changedTouches[0].screenX;

      const distance =
        lightboxTouchEndX -
        lightboxTouchStartX;

      if (Math.abs(distance) < 50) {
        return;
      }

      if (distance < 0) {
        nextImage();
      } else {
        previousImage();
      }

    },
    { passive: true }
  );


  /* =====================================================
     PAUSE HERO WHEN TAB IS HIDDEN
  ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        clearInterval(heroTimer);

      } else {

        restartHeroTimer();

      }

    }
  );

});