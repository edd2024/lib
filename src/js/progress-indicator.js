document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // 🔧 CENTRAL CONFIG — defaults (used if no data-breakpoints attr)
  const sliderConfig = {
    loopSpeed: 600, // animation speed (ms)

    // Breakpoints for items per view + progress bar orientation
    breakpoints: [
      { max: 766,  items: 1, orientation: "vertical"   }, // mobile
      { max: 1022, items: 2, orientation: "horizontal" }, // tablet small
      { max: 1399, items: 3, orientation: "horizontal" }, // tablet large
      { max: Infinity, items: 3, orientation: "horizontal" } // desktop
    ]
  };
  // ============================================================

  const sliders = document.querySelectorAll(".progress-nav");
  const counts  = document.querySelectorAll(".progress-count");
  const masks   = document.querySelectorAll(".progress-container");

  sliders.forEach((nav, index) => {
    const wrapper     = nav.querySelector(".progress-bar-wrapper");
    const progressBar = wrapper.querySelector(".progress-bar");
    const bar         = progressBar.querySelector(".progress");
    const dotsWrap    = wrapper.querySelector(".progress-indicator");
    const prevBtn     = nav.querySelector(".prev");
    const nextBtn     = nav.querySelector(".next");

    const countWrap       = counts[index];
    const currentDisplay  = countWrap?.querySelector(".current");
    const totalDisplay    = countWrap?.querySelector(".total");

    const mask  = masks[index];
    let track   = null;

    // ----- State -----
    let loopSpeed   = sliderConfig.loopSpeed;
    let orientation = "horizontal";
    let itemsPerView = 3;
    let centers     = [];
    let circles     = [];
    let isAnimating = false;

    let sections        = [];
    let totalSections   = 0;
    let currentSection  = 1;
    let visualIndex     = 1;
    let firstClone      = null;
    let lastClone       = null;

    let sourceSections = [];
    let useItems = false;

    // ----- Config helpers -----
    function initLoopSpeed() {
      const v = parseInt(nav?.dataset?.speed ?? "", 10);
      if (!Number.isNaN(v)) loopSpeed = v;
    }

    function resolveBreakpoint() {
      // Optional custom breakpoints per slider
      const bpAttr = nav.getAttribute("data-breakpoints");
      let breakpoints = sliderConfig.breakpoints;
      if (bpAttr) {
        try { breakpoints = JSON.parse(bpAttr); }
        catch (e) { console.warn("Invalid data-breakpoints JSON", e); }
      }

      const w = window.innerWidth;
      const bp = breakpoints.find(b => w <= b.max) || breakpoints[breakpoints.length - 1];
      orientation = bp.orientation;
      itemsPerView = bp.items;
    }

    // ----- Track + Sections -----
    function ensureTrack() {
      track = mask.querySelector(".progress-track");
      if (!track) {
        track = document.createElement("div");
        track.className = "progress-track";
        const existing = Array.from(mask.querySelectorAll(".progress-section"));
        existing.forEach(n => track.appendChild(n));
        mask.appendChild(track);
      }
      track.style.display = "flex";
      track.style.flexWrap = "nowrap";
      track.style.willChange = "transform";
      track.style.width = "100%"; // important for flex
    }

    function readSources() {
      sourceSections = Array.from(track.querySelectorAll(".progress-section"))
        .filter(sec => !sec.classList.contains("clone") && !sec.classList.contains("generated"));
      useItems = sourceSections.some(sec => sec.querySelector(".item"));
    }

    function clearGenerated() {
      track.querySelectorAll(".progress-section.generated, .progress-section.clone")
        .forEach(c => c.remove());
    }

    function buildSections() {
      sections = [];
      if (useItems) {
        const allItems = [];
        sourceSections.forEach(sec => {
          sec.querySelectorAll(".item").forEach(item => {
            allItems.push(item.cloneNode(true));
          });
          sec.style.display = "none"; // hide originals
        });

        for (let i = 0; i < allItems.length; i += itemsPerView) {
          const page = document.createElement("div");
          page.className = "progress-section generated";
          const group = allItems.slice(i, i + itemsPerView);
          group.forEach(node => page.appendChild(node));
          track.appendChild(page);
          sections.push(page);
        }
      } else {
        sourceSections.forEach(sec => sec.style.display = "");
        sections = [...sourceSections];
      }

      totalSections = sections.length;
      if (totalDisplay) totalDisplay.textContent = totalSections;
    }

    function buildClones() {
      if (!sections.length) return;
      firstClone = sections[0].cloneNode(true);
      firstClone.classList.add("clone");
      lastClone = sections[sections.length - 1].cloneNode(true);
      lastClone.classList.add("clone");
      track.insertBefore(lastClone, track.firstChild);
      track.appendChild(firstClone);
    }

    // ----- Dots + Progress Bar -----
    function buildDots() {
      dotsWrap.innerHTML = "";
      circles = [];
      sections.forEach((sec, i) => {
        const step = document.createElement("button");
        step.className = "step";

        const circle = document.createElement("div");
        circle.className = "circle";
        circle.textContent = i + 1;

        const label = document.createElement("span");
        label.className = "label";
        label.textContent = sec.dataset.label || `Step ${i + 1}`;

        step.appendChild(circle);
        step.appendChild(label);
        dotsWrap.appendChild(step);
        circles.push(circle);

        step.addEventListener("click", () => goToSection(i + 1));
      });
    }

    function measureCenters() {
      const wrapRect = wrapper.getBoundingClientRect();
      centers = circles.map(c => {
        const r = c.getBoundingClientRect();
        return { x: (r.left + r.width / 2) - wrapRect.left,
                 y: (r.top  + r.height/ 2) - wrapRect.top  };
      });

      if (!circles.length) return;
      const first = centers[0];
      const last  = centers[centers.length - 1];
      if (orientation === "horizontal") {
        const trackH = progressBar.offsetHeight || 8;
        const y = first.y - trackH / 2;
        progressBar.style.top = `${y}px`;
        progressBar.style.left = `${first.x}px`;
        progressBar.style.width = `${Math.max(0, last.x - first.x)}px`;
        progressBar.style.height = `${trackH}px`;
      } else {
        const trackW = progressBar.offsetWidth || 8;
        const x = first.x - trackW / 2;
        progressBar.style.left = `${x}px`;
        progressBar.style.top = `${first.y}px`;
        progressBar.style.height = `${Math.max(0, last.y - first.y)}px`;
        progressBar.style.width = `${trackW}px`;
      }
    }

    function fillToCurrent() {
      if (!centers.length) measureCenters();
      const first = centers[0] || { x: 0, y: 0 };
      const target = centers[currentSection - 1] || first;
      if (orientation === "horizontal") {
        bar.style.transition = `width ${loopSpeed}ms ease-in-out`;
        bar.style.width = (currentSection === 1) ? "0px" : `${Math.max(0, target.x - first.x)}px`;
        bar.style.height = "100%";
      } else {
        bar.style.transition = `height ${loopSpeed}ms ease-in-out`;
        bar.style.height = (currentSection === 1) ? "0px" : `${Math.max(0, target.y - first.y)}px`;
        bar.style.width = "100%";
      }
      if (currentDisplay) currentDisplay.textContent = currentSection;
    }

    function updateDotsState() {
      dotsWrap.querySelectorAll(".step").forEach((s, i) => {
        s.classList.remove("active", "completed");
        if (i + 1 < currentSection) s.classList.add("completed");
        if (i + 1 === currentSection) s.classList.add("active");
      });
    }

    // ----- Navigation -----
    function applyTranslate(noAnim = false) {
      const offsetPercent = -100 * visualIndex;
      track.style.transition = noAnim ? "none" : `transform ${loopSpeed}ms ease-in-out`;
      track.style.transform  = `translateX(${offsetPercent}%)`;
    }

    function goToSection(n) {
      if (isAnimating) return;
      isAnimating = true;
      currentSection = Math.min(Math.max(n, 1), totalSections);
      visualIndex = currentSection;
      updateDotsState();
      fillToCurrent();
      applyTranslate(false);
      setTimeout(() => { isAnimating = false; }, loopSpeed);
    }

    function next() {
      if (isAnimating) return;
      isAnimating = true;
      visualIndex += 1;
      track.style.transition = `transform ${loopSpeed}ms ease-in-out`;
      track.style.transform  = `translateX(${-100 * visualIndex}%)`;
      currentSection = (currentSection === totalSections) ? 1 : (currentSection + 1);
      updateDotsState();
      fillToCurrent();
      setTimeout(() => {
        if (visualIndex === totalSections + 1) {
          visualIndex = 1;
          applyTranslate(true);
        }
        isAnimating = false;
      }, loopSpeed + 20);
    }

    function prev() {
      if (isAnimating) return;
      isAnimating = true;
      visualIndex -= 1;
      track.style.transition = `transform ${loopSpeed}ms ease-in-out`;
      track.style.transform  = `translateX(${-100 * visualIndex}%)`;
      currentSection = (currentSection === 1) ? totalSections : (currentSection - 1);
      updateDotsState();
      fillToCurrent();
      setTimeout(() => {
        if (visualIndex === 0) {
          visualIndex = totalSections;
          applyTranslate(true);
        }
        isAnimating = false;
      }, loopSpeed + 20);
    }

    // ----- Rebuild -----
    function rebuild() {
      resolveBreakpoint();
      ensureTrack();
      clearGenerated();
      readSources();
      buildSections();
      buildClones();
      buildDots();
      currentSection = 1;
      visualIndex = 1;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          measureCenters();
          updateDotsState();
          fillToCurrent();
          applyTranslate(true);
        });
      });
    }

    // Init
    initLoopSpeed();
    rebuild();

    window.addEventListener("resize", rebuild);
    window.addEventListener("orientationchange", rebuild);
    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);

    // Swipe
    let sx = 0, sy = 0, ex = 0, ey = 0;
    document.addEventListener("touchstart", e => {
      sx = e.changedTouches[0].screenX; sy = e.changedTouches[0].screenY;
    }, { passive: true });
    document.addEventListener("touchend", e => {
      ex = e.changedTouches[0].screenX; ey = e.changedTouches[0].screenY;
      const dx = ex - sx, dy = ey - sy;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < -2) next();
        if (dx >  2) prev();
      } else {
        if (dy < -2) next();
        if (dy >  2) prev();
      }
    }, { passive: true });

    // Helpers
    window.setLoopSpeed = (ms) => { loopSpeed = +ms || loopSpeed; rebuild(); };
    window.setProgress  = goToSection;
  });
});
