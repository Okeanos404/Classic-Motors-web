document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     SCROLL REVEAL (SMOOTH & INTENTIONAL)
  ===================================================== */
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  reveals.forEach(el => revealObserver.observe(el));

  /* =====================================================
     HERO CAROUSEL (AUTO + PAUSE ON INTERACTION)
  ===================================================== */
  const slides = document.querySelectorAll(".carousel-item");
  let currentSlide = 0;
  let carouselTimer;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
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
      resultBox.style.animation = "fadeUp 0.6s ease";

      resultBox.scrollIntoView({ behavior: "smooth" });

      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "Analisis Kecocokan";
    }, 650); // intentional delay for UX
  });

});
