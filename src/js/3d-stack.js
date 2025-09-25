class Card3D {
  constructor(container, options = {}) {
    this.container = container;
    this.stage = container.querySelector('.stage');
    this.cards = Array.from(container.querySelectorAll('.card'));
    this.prevBtn = container.querySelector('.prev-btn');
    this.nextBtn = container.querySelector('.next-btn');
    this.indicatorsWrap = container.querySelector('.indicator');
    this.counterEl = container.querySelector('.card-counter');
    this.index = 0;
    this.isAnimating = false;
    this.config = {
      maxVisibleStack: parseInt(container.dataset.maxVisibleStack) || 3,
      swipeThreshold: 50,
      xOffset: -2,    // rem per stack level (left shift)
      zOffset: -6,    // rem per stack level (depth)
      opacityStep: 0.15,
      minOpacity: 0.45,
      ...options
    };
    if (this.indicatorsWrap) this.setupIndicators();
    this.update();
    this.bind();
  }

  setupIndicators() {
    this.indicatorsWrap.innerHTML = '';
    this.indicators = this.cards.map((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => this.goTo(i));
      this.indicatorsWrap.appendChild(dot);
      return dot;
    });
  }

  bind() {
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());

    // Touch swipe
    let sx = 0, sy = 0;
    this.container.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, { passive: true });

    this.container.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      this.handleSwipe(dx, dy);
    }, { passive: false });

    // Keyboard
    this.container.setAttribute('tabindex', '0');
    this.container.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') this.next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') this.prev();
    });
  }

  handleSwipe(dx, dy) {
    const horizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.config.swipeThreshold;
    const vertical = Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > this.config.swipeThreshold;
    if (horizontal) {
      dx < 0 ? this.next() : this.prev();
    } else if (vertical) {
      dy < 0 ? this.next() : this.prev();
    }
  }

  rel(i) {
    return (i + this.cards.length) % this.cards.length;
  }

  // Compute and apply transform/opacity/z-index for visible stack
  update() {
    // Clear leftover styles that could linger
    this.cards.forEach(c => {
      c.classList.remove('leaving-up');
      // Do not clear transform/opacity here; we always re-apply below.
    });

    for (let s = 0; s <= this.config.maxVisibleStack; s++) {
      const idx = this.rel(this.index + s);
      const card = this.cards[idx];
      if (!card) continue;

      const xOffset = s * this.config.xOffset;   // -2rem, -4rem, ...
      const zOffset = s * this.config.zOffset;   // -6rem, -12rem, ...
      const opacity = s === 0 ? 1 : Math.max(this.config.minOpacity, 1 - (s * this.config.opacityStep));

      if (s === 0) {
        card.classList.add('active');
        card.style.transform = `translateZ(0) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.zIndex = String(this.config.maxVisibleStack + 2);
        card.style.pointerEvents = 'auto';
      } else {
        card.classList.remove('active');
        card.style.transform = `translateX(${xOffset}rem) translateZ(${zOffset}rem) rotateY(12deg)`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(this.config.maxVisibleStack + 2 - s);
        card.style.pointerEvents = 'auto';
      }
    }

    // Hide the rest beyond the stack
    this.cards.forEach((card, i) => {
      const offset = (i - this.index + this.cards.length) % this.cards.length;
      if (offset > this.config.maxVisibleStack) {
        card.style.transform = `translateZ(0) rotateY(12deg)`;
        card.style.opacity = '0';
        card.style.zIndex = '0';
        card.style.pointerEvents = 'none';
      }
    });

    // Counter and indicators
    if (this.counterEl) {
      this.counterEl.textContent = `${this.index + 1}/${this.cards.length}`;
    }
    if (this.indicators) {
      this.indicators.forEach((d, i) => d.classList.toggle('active', i === this.index));
    }
  }

  // Animate the active card up-and-out using inline styles (so it works with inline transforms)
  animateLeaveUp(card, done) {
    // Ensure it renders at its current state before changing transform
    void card.offsetWidth; // reflow

    // Put it on top during the animation
    card.style.zIndex = String(this.config.maxVisibleStack + 3);
    card.style.pointerEvents = 'none';

    // Animate to leaving position (CSS must have transition on .card for transform/opacity)
    card.style.transform = `translateY(-5rem) rotateY(12deg)`;
    card.style.opacity = '0';

    const onEnd = (e) => {
      // Listen once; transform or opacity will both end
      card.removeEventListener('transitionend', onEnd);
      done();
    };
    card.addEventListener('transitionend', onEnd, { once: true });
  }

  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const current = this.cards[this.index];
    this.animateLeaveUp(current, () => {
      this.index = this.rel(this.index + 1);

      // Reposition instantly without animating the stack
      this.stage.classList.add('no-anim');
      this.update();
      void this.stage.offsetWidth;
      this.stage.classList.remove('no-anim');

      this.isAnimating = false;
    });
  }

  prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const current = this.cards[this.index];
    this.animateLeaveUp(current, () => {
      this.index = this.rel(this.index - 1);

      this.stage.classList.add('no-anim');
      this.update();
      void this.stage.offsetWidth;
      this.stage.classList.remove('no-anim');

      this.isAnimating = false;
    });
  }

  goTo(i) {
    if (i === this.index || this.isAnimating) return;
    this.isAnimating = true;

    const current = this.cards[this.index];
    this.animateLeaveUp(current, () => {
      this.index = this.rel(i);

      this.stage.classList.add('no-anim');
      this.update();
      void this.stage.offsetWidth;
      this.stage.classList.remove('no-anim');

      this.isAnimating = false;
    });
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card-stack-3d').forEach(el => new Card3D(el));
});