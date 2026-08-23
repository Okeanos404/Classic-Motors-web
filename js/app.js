document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     SCROLL REVEAL (ANIME.JS 3D ANIMATIONS)
  ===================================================== */
  const reveals = document.querySelectorAll(".reveal");

  // Initial header animation
  if (document.querySelector('.header')) {
    anime({
      targets: '.header',
      opacity: [0, 1],
      duration: 800,
      easing: 'linear'
    });

    anime({
      targets: '.header img, .header h1, .header p',
      translateY: [30, 0],
      translateZ: [20, 0],
      opacity: [0, 1],
      rotateX: [10, 0],
      duration: 1400,
      delay: anime.stagger(150),
      easing: 'easeOutQuart'
    });
  }

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!entry.target.classList.contains('header')) {
            // Main container reveal
            anime({
              targets: entry.target,
              translateY: [40, 0],
              translateZ: [30, 0],
              opacity: [0, 1],
              rotateX: [8, 0], // 3D effect subtle
              duration: 1400,
              easing: 'easeOutQuart'
            });

            // Stagger inner elements (lists, cards, badges)
            const staggerChildren = entry.target.querySelectorAll('.fact-card, .list li, .badge');
            if(staggerChildren.length > 0) {
              anime({
                targets: staggerChildren,
                translateY: [20, 0],
                opacity: [0, 1],
                scale: [0.95, 1],
                rotateY: [8, 0], // 3D stagger subtle
                duration: 1200,
                delay: anime.stagger(100, {start: 200}),
                easing: 'easeOutQuart'
              });
            }
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach(el => revealObserver.observe(el));

  /* =====================================================
     HERO CAROUSEL (ANIME.JS 3D ANIMATION)
  ===================================================== */
  const slides = document.querySelectorAll(".carousel-item");
  let currentSlide = 0;
  let carouselTimer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if(i !== index) {
        slide.classList.remove("active"); // Remove immediately to prevent layout shift
        anime({
          targets: slide,
          opacity: 0,
          scale: 0.95,
          rotateY: -8, // 3D out subtle
          translateZ: -20,
          duration: 1200,
          easing: 'easeOutQuart'
        });
      }
    });

    slides[index].classList.add("active");
    anime({
      targets: slides[index],
      opacity: [0, 1],
      scale: [1.02, 1],
      rotateY: [8, 0], // 3D in subtle
      translateZ: [20, 0],
      duration: 1400,
      easing: 'easeOutQuart'
    });
  }

  function startCarousel() {
    carouselTimer = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 3600);
  }

  function stopCarousel() {
    clearInterval(carouselTimer);
  }

  startCarousel();

  slides.forEach(slide => {
    slide.addEventListener("mouseenter", stopCarousel);
    slide.addEventListener("mouseleave", startCarousel);
    slide.addEventListener("touchstart", stopCarousel, { passive: true });
    slide.addEventListener("touchend", startCarousel);
  });

  /* =====================================================
     BACK TO TOP
  ===================================================== */
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 600);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =====================================================
     SCROLL TO SYSTEM SECTION
  ===================================================== */
  const scrollBtn = document.getElementById("scrollToInsight");
  const insightSection = document.getElementById("insightSection");

  scrollBtn.addEventListener("click", () => {
    insightSection.scrollIntoView({ behavior: "smooth" });
  });

  /* =====================================================
     SYSTEM CORE — ANALYSIS WITH FEEDBACK
  ===================================================== */
  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("resultText");

  analyzeBtn.addEventListener("click", () => {
    // --- loading micro feedback
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Menganalisis...";
    resultBox.style.display = "none";

    setTimeout(() => {
      const userInput = {
        dailyUse: document.getElementById("dailyUse").checked,
        hobbyUse: document.getElementById("hobbyUse").checked,
        budget: Number(document.getElementById("budget").value)
      };

      const analysis = analyzeSuitability(userInput);

      let statusLabel = "";
      let statusColor = "";

      if (analysis.score >= 3) {
        statusLabel = "Cocok";
        statusColor = "#c6a15b";
      } else if (analysis.score === 2) {
        statusLabel = "Perlu Pertimbangan";
        statusColor = "#888";
      } else {
        statusLabel = "Kurang Disarankan";
        statusColor = "#111";
      }

      resultText.innerHTML = `
        <div style="margin-bottom:1rem;">
          <span style="
            display:inline-block;
            padding:0.4rem 1.1rem;
            border-radius:30px;
            background:${statusColor};
            color:${statusColor === "#c6a15b" ? "#111" : "#fff"};
            font-size:0.8rem;
            font-weight:600;
          ">
            ${statusLabel}
          </span>
        </div>

        <strong>Kesimpulan Sistem</strong><br><br>
        ${analysis.notes.map(n => `• ${n}`).join("<br>")}
      `;

      resultBox.style.display = "block";
      
      // 3D Result Box Animation subtle
      anime({
        targets: resultBox,
        translateY: [30, 0],
        translateZ: [20, 0],
        opacity: [0, 1],
        rotateX: [-10, 0],
        duration: 1200,
        easing: 'easeOutQuart'
      });

      resultBox.scrollIntoView({ behavior: "smooth" });

      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "Analisis Kecocokan";
    }, 650); // intentional delay for UX
  });

});
