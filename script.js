/**
 * BIRTHDAY LOVE WEBSITE - ENGINE
 * Vanilla JavaScript Engine supporting canvas systems, sound triggers & UX
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize canvas particle engine & cursor
  initAmbientCanvas();
  initFireworksCanvas();
  initCursorTrail();

  // Core UI Interaction Handlers
  initLoaderAndAudio();
  initTypewriter();
  initGalleryLightbox();
  initReasonsEngine();
  initCakeCandles();
  initGiftBox();
  initSmoothScroll();
});

/* ==========================================================================
   AUDIO & ENTRY LOADER CONTROLLER
   ========================================================================== */
function initLoaderAndAudio() {
  const enterBtn = document.getElementById('enter-btn');
  const loaderScreen = document.getElementById('loader-screen');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const volumeSlider = document.getElementById('volume-slider');

  function startExperience() {
    loaderScreen.classList.add('fade-out');
    setTimeout(() => {
      loaderScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, 1000);

    // Audio Playback Engine
    bgMusic.play().then(() => {
      musicIcon.textContent = '🎶';
    }).catch(err => {
      console.log('Autoplay restriction handled:', err);
      musicIcon.textContent = '🔇';
    });
  }

  enterBtn.addEventListener('click', startExperience);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && loaderScreen.classList.contains('active')) {
      loaderScreen.classList.remove('active');
      startExperience();
    }
  });

  // Music Controls
  musicToggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicIcon.textContent = '🎶';
    } else {
      bgMusic.pause();
      musicIcon.textContent = '🔇';
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
  });
}

/* ==========================================================================
   AMBIENT PARTICLE SYSTEM (Hearts, Petals, Stars)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height;
      this.size = Math.random() * 14 + 8;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.type = Math.random() > 0.4 ? 'heart' : 'petal';
      this.opacity = Math.random() * 0.6 + 0.3;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
        this.y = height + 20;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = '#ff65a3';
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      } else {
        ctx.fillStyle = '#ff758c';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size / 2, this.size / 3, 0, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   FIREWORKS CANVAS ENGINE
   ========================================================================== */
let triggerFireworks;

function initFireworksCanvas() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let fireworks = [];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = Math.random() * 3 + 1;
      this.velocity = {
        x: (Math.random() - 0.5) * (Math.random() * 8),
        y: (Math.random() - 0.5) * (Math.random() * 8)
      };
      this.alpha = 1;
      this.friction = 0.96;
      this.gravity = 0.08;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
      this.velocity.y += this.gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.012;
    }
  }

  triggerFireworks = function () {
    const colors = ['#ff65a3', '#ffd700', '#ffffff', '#ff758c', '#a855f7'];
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const x = Math.random() * (width - 200) + 100;
        const y = Math.random() * (height / 2);
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 50; i++) {
          fireworks.push(new Particle(x, y, color));
        }
      }, f * 250);
    }
  };

  function loop() {
    ctx.clearRect(0, 0, width, height);
    fireworks.forEach((p, index) => {
      if (p.alpha > 0) {
        p.update();
        p.draw();
      } else {
        fireworks.splice(index, 1);
      }
    });
    requestAnimationFrame(loop);
  }

  loop();
}

/* ==========================================================================
   CURSOR TRAIL
   ========================================================================== */
function initCursorTrail() {
  const cursor = document.getElementById('cursor-heart');
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

/* ==========================================================================
   TYPEWRITER LOVE LETTER ENGINE
   ========================================================================== */
function initTypewriter() {
  const textContainer = document.getElementById('typewriter-text');
  const letter = `Dearest Love,\n\nFrom the moment you entered my world, everything became brighter, softer, and infinitely more beautiful. Your smile is my sanctuary, and your presence is my greatest blessing.\n\nToday, as we celebrate your birth on 1 August 2002, I want to promise you that I will cherish, support, and stand by you in every chapter of our lives.\n\nHappy Birthday, my sweet queen. Here is to a lifetime of togetherness.`;

  let i = 0;
  let hasStarted = false;

  function type() {
    if (i < letter.length) {
      if (letter.charAt(i) === '\n') {
        textContainer.innerHTML += '<br>';
      } else {
        textContainer.innerHTML += letter.charAt(i);
      }
      i++;
      setTimeout(type, 35);
    }
  }

  // Trigger typewriter when letter section is scrolled into view
  window.addEventListener('scroll', () => {
    const section = document.getElementById('love-letter');
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.75 && !hasStarted) {
      hasStarted = true;
      type();
    }
  });
}

/* ==========================================================================
   GALLERY LIGHTBOX ENGINE
   ========================================================================== */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.getElementById('lb-prev');
  const nextBtn = document.getElementById('lb-next');

  let currentIndex = 0;
  const galleryData = [];

  items.forEach((item, idx) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span').textContent;
    galleryData.push({ src: img.src, caption });

    item.addEventListener('click', () => {
      currentIndex = idx;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = galleryData[currentIndex].src;
    lightboxCaption.textContent = galleryData[currentIndex].caption;
    lightbox.classList.add('active');
  }

  closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    openLightbox();
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryData.length;
    openLightbox();
  });
}

/* ==========================================================================
   100 REASONS ENGINE
   ========================================================================== */
function initReasonsEngine() {
  const reasons = [
    "Your laugh is my absolute favorite sound in the whole universe.",
    "The way your eyes sparkle when you smile.",
    "Your immense kindness to everyone around you.",
    "How deeply you love animals and care for them.",
    "Your beautiful, graceful, traditional look in sarees.",
    "The cute way you take mirror selfies.",
    "You make every ordinary moment feel extraordinary.",
    "Your intelligence and wisdom in every decision.",
    "How safe and at peace I feel around you.",
    "Your adorable expressions when you are happy.",
    "The sweet tone of your voice when you say my name.",
    "How genuine and authentic your soul is.",
    "Your endless patience and understanding.",
    "The way you bring out the best version of me.",
    "Your comforting warmth whenever I need a hug.",
    "Your incredible strength and elegance.",
    "How you make our house feel like a home.",
    "Your playful and witty humor.",
    "The way you look when you wake up in the morning.",
    "Your unconditional loyalty and love.",
    "How you listen to me with complete attention.",
    "Your soft, gentle hands held in mine.",
    "The dreams and future we are building together.",
    "How gorgeous you look even with no makeup.",
    "Your love for peace and quiet moments.",
    "The way you celebrate small happinesses in life.",
    "Your unique style and aesthetic taste.",
    "How you remember small details about us.",
    "Your dedication to everything you pursue.",
    "The comfort in simply sitting in silence with you.",
    "Your warm heart that holds so much love.",
    "How you make bad days instantly better.",
    "Your infectious energy when you are excited.",
    "The cute ways you show your care.",
    "Because you are my absolute best friend.",
    "Because you complete me in every single way.",
    "The way you look at me with soft eyes.",
    "Your beautiful long hair.",
    "Your gentle spirit.",
    "Your strong moral principles.",
    "Because you chose me to walk this life with you.",
    "Your endless support for my aspirations.",
    "The sweet notes and memories we create.",
    "Because my heart skips a beat every time I see you.",
    "How you handle challenges with poise.",
    "Your adorable habits.",
    "The warmth of your embrace.",
    "Your unconditional belief in us.",
    "The way you light up any room you walk into.",
    "Because 1 August 2002 brought my world to life."
  ];

  // Fill array up to 100 items dynamically for completeness
  for (let k = 51; k <= 100; k++) {
    reasons.push(`Reason #${k}: Because every single day with you is a gift I will treasure for the rest of my life ❤️`);
  }

  let currentIndex = 0;
  const reasonNumber = document.getElementById('reason-number');
  const reasonText = document.getElementById('reason-text');
  const nextBtn = document.getElementById('next-reason-btn');
  const progressBar = document.getElementById('reason-progress-bar');

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % reasons.length;
    reasonNumber.textContent = currentIndex + 1;
    reasonText.textContent = `"${reasons[currentIndex]}"`;
    progressBar.style.width = `${((currentIndex + 1) / 100) * 100}%`;
  });
}

/* ==========================================================================
   BIRTHDAY CAKE & CANDLE INTERACTION
   ========================================================================== */
function initCakeCandles() {
  const blowBtn = document.getElementById('blow-candles-btn');
  const flames = document.querySelectorAll('.flame');
  const wishStatus = document.getElementById('wish-status');

  function blow() {
    flames.forEach(flame => flame.classList.add('blown-out'));
    wishStatus.textContent = "✨ All your wishes are coming true! Happy Birthday My Love! ✨";
    if (typeof triggerFireworks === 'function') {
      triggerFireworks();
    }
  }

  blowBtn.addEventListener('click', blow);
  flames.forEach(flame => flame.addEventListener('click', blow));
}

/* ==========================================================================
   SURPRISE GIFT BOX ENGINE
   ========================================================================== */
function initGiftBox() {
  const giftBox = document.getElementById('gift-box');
  let opened = false;

  giftBox.addEventListener('click', () => {
    if (!opened) {
      opened = true;
      giftBox.classList.add('opened');
      if (typeof triggerFireworks === 'function') {
        triggerFireworks();
      }
      setTimeout(() => {
        alert("🎁 Surprise! You are the greatest gift Akash could ever ask for! ❤️");
      }, 500);
    }
  });
}

/* ==========================================================================
   SMOOTH SCROLL CONTROLLER
   ========================================================================== */
function initSmoothScroll() {
  const scrollBtns = document.querySelectorAll('.scroll-to-btn');
  scrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
