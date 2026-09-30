(() => {
  const FLOWERS = [
    { key:'rosa', name:'Rosa', image:'foto/rosa.jpg',
      blurb:'The queen of flowers — layer upon layer of velvet petals, loved for thousands of years.',
      facts:[['Family:','Rosaceae, with over 300 species and thousands of cultivars.'],
             ['Blooms:','Late spring through autumn.'],
             ['Meaning:','Love, passion and devotion.'],
             ['Curiosity:','Rose oil takes about 4 tonnes of petals to make a single litre.']] },
    { key:'tulip', name:'Tulip', image:'foto/tulip.jpg',
      blurb:'A cup of pure color that once cost more than a house during Dutch "tulip mania".',
      facts:[['Family:','Liliaceae, native to Central Asia and Turkey.'],
             ['Blooms:','Early to mid spring.'],
             ['Meaning:','Perfect love and rebirth.'],
             ['Curiosity:','Tulips keep growing in the vase, even after being cut.']] },
    { key:'sakura', name:'Sakura', image:'foto/sakura.jpg',
      blurb:'Japan\'s cherry blossom, a cloud of pale pink petals that lasts only about a week.',
      facts:[['Family:','Rosaceae, genus Prunus.'],
             ['Blooms:','Late March to April in Japan.'],
             ['Meaning:','The fleeting, fragile beauty of life.'],
             ['Curiosity:','Hanami, the tradition of picnicking under the trees, is centuries old.']] },
    { key:'sunflower', name:'Sunflower', image:'foto/sunflower.jpg',
      blurb:'A whole crowd of tiny flowers packed into one golden face that follows the sun.',
      facts:[['Family:','Asteraceae, native to North America.'],
             ['Blooms:','Summer to early autumn.'],
             ['Meaning:','Loyalty, adoration and longevity.'],
             ['Curiosity:','Young buds turn to follow the sun across the sky each day.']] },
    { key:'lily', name:'Lily', image:'foto/lily.jpg',
      blurb:'An elegant trumpet of six petals, long a symbol of purity across cultures.',
      facts:[['Family:','Liliaceae, with around 100 true species.'],
             ['Blooms:','Late spring to midsummer.'],
             ['Meaning:','Purity, renewal and refined beauty.'],
             ['Curiosity:','Lilies are toxic to cats, even the pollen and vase water.']] },
    { key:'orchid', name:'Orchid', image:'foto/orchid.jpg',
      blurb:'One of the largest plant families on Earth, prized for long-lasting, sculpted blooms.',
      facts:[['Family:','Orchidaceae, with more than 25,000 species.'],
             ['Blooms:','A single flower can last for several months.'],
             ['Meaning:','Luxury, beauty and strength.'],
             ['Curiosity:','Vanilla comes from the seed pod of an orchid.']] },
    { key:'daisy', name:'Daisy', image:'foto/daisy.jpg',
      blurb:'A humble white crown around a yellow sun, opening wherever there is light.',
      facts:[['Family:','Asteraceae, one of the most common wildflowers.'],
             ['Blooms:','Spring through autumn.'],
             ['Meaning:','Innocence, purity and new beginnings.'],
             ['Curiosity:','Its name comes from "day\'s eye" — it closes at night and opens at dawn.']] },
    { key:'lotus', name:'Lotus', image:'foto/lotus.jpg',
      blurb:'A flower that rises spotless from muddy water, a symbol of rebirth in many traditions.',
      facts:[['Family:','Nelumbonaceae, genus Nelumbo.'],
             ['Blooms:','Summer, opening at dawn.'],
             ['Meaning:','Rebirth, enlightenment and purity.'],
             ['Curiosity:','Its seeds can sprout after more than a thousand years.']] }
  ];
  const states = {};
  FLOWERS.forEach((f, i) => {
    const j = (i + 1) % FLOWERS.length;
    states[f.key] = { ...f, nextKey: FLOWERS[j].key, next: FLOWERS[j].name, number: `[${String(j + 1).padStart(2, '0')}]` };
  });

  const $ = id => document.getElementById(id);
  const experience = document.querySelector('.experience');
  const flowerList = document.querySelector('.flower-list');
  const portal = $('portal');
  const canvas = $('portal-canvas'), ctx = canvas.getContext('2d');

  let current = 'rosa', busy = false, rendered = false;
  let rotX = 0, rotY = 0, targetX = 0, targetY = 0;
  let expansion = 0, maskScale = 1;
  let transitionActive = false, transitionSource = null, backdrop = null;
  let lastT = performance.now();

  const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function animateValue(setter, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        setter(ease(t));
        t < 1 ? requestAnimationFrame(step) : resolve();
      };
      requestAnimationFrame(step);
    });
  }

  function imageReady(img, timeout = 5000) {
    return new Promise(resolve => {
      if (img.complete && img.naturalWidth) return resolve();
      const done = () => { clearTimeout(timer); img.removeEventListener('load', done); img.removeEventListener('error', done); resolve(); };
      const timer = setTimeout(done, timeout);
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    });
  }

  const IMAGES = {};
  FLOWERS.forEach(f => { const img = new Image(); img.src = f.image; IMAGES[f.key] = img; });
  const portalSource = () => IMAGES[states[current].nextKey];

  function paintThumb(c, key) {
    const img = IMAGES[key];
    const go = () => {
      const w = img.naturalWidth, h = img.naturalHeight, side = Math.min(w, h);
      c.getContext('2d').drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, c.width, c.height);
    };
    img.complete && img.naturalWidth ? go() : img.addEventListener('load', go, { once: true });
  }

  function fitTitle() {
    const h1 = $('flower-title'), box = h1.parentElement, dl = $('facts');
    const shown = h1.textContent;
    h1.style.fontSize = '';
    let widest = 0;
    FLOWERS.forEach(f => { h1.textContent = f.name.toUpperCase(); widest = Math.max(widest, h1.scrollWidth); });
    h1.textContent = shown;
    const stacked = getComputedStyle(box).display === 'block';
    const avail = box.clientWidth - (stacked ? 0 : dl.offsetWidth + 40) - 32;
    if (widest > avail && avail > 0) h1.style.fontSize = (parseFloat(getComputedStyle(h1).fontSize) * avail / widest) + 'px';
  }

  function render() {
    const s = states[current];
    $('flower-title').textContent = s.name.toUpperCase();
    $('next-name').textContent = s.next;
    $('next-number').textContent = s.number;
    portal.setAttribute('aria-label', `Travel to ${s.next}`);
    $('facts').innerHTML = s.facts.map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    flowerList.innerHTML = FLOWERS.map(f => `<span class="flower-item${f.key === current ? ' active' : ''}" role="button" tabindex="0" data-flower="${f.key}">${f.name}</span>`).join('');
    if (rendered) {
      flowerList.classList.remove('is-switching');
      void flowerList.offsetWidth;
      flowerList.classList.add('is-switching');
    }
    rendered = true;
    $('explore-title').textContent = s.name;
    $('explore-blurb').textContent = s.blurb;
    $('explore-next').textContent = `Travel to ${s.next}`;
    $('explore-facts').innerHTML = s.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    paintThumb($('explore-art'), current);
    fitTitle();
  }

  function resizeCanvas() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w * d; canvas.height = h * d;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function drawCover(img) {
    const mw = img.naturalWidth, mh = img.naturalHeight;
    if (!mw || !mh) return;
    const W = window.innerWidth, H = window.innerHeight;
    const scale = Math.max(W / mw, H / mh), w = mw * scale, h = mh * scale;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }

  const VEIL = .38;
  function drawShade() {
    const H = window.innerHeight, W = window.innerWidth;
    ctx.fillStyle = `rgba(0,0,0,${VEIL})`;
    ctx.fillRect(0, 0, W, H);
    const top = ctx.createLinearGradient(0, 0, 0, H * .24);
    top.addColorStop(0, 'rgba(0,0,0,.25)');
    top.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, H * .24);
    const bottom = ctx.createLinearGradient(0, H * .5, 0, H);
    bottom.addColorStop(0, 'rgba(0,0,0,0)');
    bottom.addColorStop(1, 'rgba(0,0,0,.6)');
    ctx.fillStyle = bottom;
    ctx.fillRect(0, H * .5, W, H * .5);
  }

  function roundedRectPoints(w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    const arcs = [
      [ w/2 - r, -h/2 + r, -Math.PI/2, 0 ],
      [ w/2 - r,  h/2 - r, 0, Math.PI/2 ],
      [-w/2 + r,  h/2 - r, Math.PI/2, Math.PI ],
      [-w/2 + r, -h/2 + r, Math.PI, Math.PI * 1.5 ]
    ];
    const pts = [];
    for (const [cx, cy, a0, a1] of arcs) {
      for (let i = 0; i <= 10; i++) {
        const a = a0 + (a1 - a0) * i / 10;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
    }
    return pts;
  }

  function project(x, y, rx, ry, cx, cy) {
    const ax = rx * Math.PI / 180, ay = ry * Math.PI / 180;
    const xx = x * Math.cos(ay), yy = y * Math.cos(ax);
    const z = x * Math.sin(ay) - y * Math.sin(ax);
    const p = 850 / (850 + z);
    return [cx + xx * p, cy + yy * p];
  }

  function draw(now) {
    const dt = Math.min(now - lastT, 40);
    lastT = now;
    const k = Math.min(1, dt * .009);
    rotX += (targetX - rotX) * k;
    rotY += (targetY - rotY) * k;

    const W = window.innerWidth, H = window.innerHeight;
    ctx.clearRect(0, 0, W, H);
    if (backdrop) { drawCover(backdrop); drawShade(); }

    const rect = portal.getBoundingClientRect();
    const e = expansion;
    const rcx = rect.left + rect.width / 2, rcy = rect.top + rect.height / 2;
    const cx = rcx + (W / 2 - rcx) * e, cy = rcy + (H / 2 - rcy) * e;
    const baseW = rect.width + (W - rect.width) * e, baseH = rect.height + (H - rect.height) * e;
    const scale = maskScale + (1 - maskScale) * e;
    const w = baseW * scale, h = baseH * scale;
    const r = 90 * (1 - e) * scale;
    if (w > 1 && h > 1) {
      const pts = roundedRectPoints(w, h, r).map(([x, y]) => project(x, y, rotX * (1 - e), rotY * (1 - e), cx, cy));
      ctx.save();
      ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, W, H);
      drawCover(transitionActive ? transitionSource : portalSource());
      if (transitionActive) drawShade();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  function retrigger(cls) {
    experience.classList.remove(cls);
    void experience.offsetWidth;
    experience.classList.add(cls);
  }
  function revealMask() {
    retrigger('mask-revealing');
    maskScale = 0;
    return animateValue(v => { maskScale = v; }, 850);
  }
  const revealContent = () => retrigger('content-revealing');

  async function startExperience() {
    await imageReady(portalSource());
    await revealMask();
    document.body.classList.add('intro-ready');
    await wait(700);
    revealContent();
  }

  async function travel(target) {
    if (busy || !document.body.classList.contains('intro-ready')) return;
    const dest = typeof target === 'string' ? target : states[current].nextKey;
    if (dest === current || !states[dest]) return;
    busy = true;
    targetX = targetY = 0;
    closePanel();
    try {
      transitionSource = IMAGES[dest];
      await imageReady(transitionSource);
      experience.classList.remove('content-revealing', 'mask-revealing');
      experience.classList.add('is-transitioning');
      transitionActive = true;
      await animateValue(v => { expansion = v; }, 1100);

      backdrop = transitionSource;
      $('preloader').style.visibility = 'hidden';
      current = dest;
      render();
      transitionActive = false;
      expansion = 0; maskScale = 0;
      experience.classList.remove('is-transitioning');

      const maskReveal = revealMask();
      await wait(100);
      revealContent();
      await maskReveal;
    } catch (err) {
      transitionActive = false;
      expansion = 0; maskScale = 1;
      experience.classList.remove('is-transitioning');
    }
    busy = false;
  }

  const panel = $('panel');
  const navLinks = [...document.querySelectorAll('.nav a')];
  let openView = null;

  const setNav = view => navLinks.forEach(a => a.classList.toggle('active', a.dataset.view === (view || 'about')));

  function openPanel(view) {
    if (!document.body.classList.contains('intro-ready') || busy) return;
    openView = view;
    panel.querySelectorAll('.panel-view').forEach(v => { v.hidden = v.dataset.view !== view; });
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    setNav(view === 'menu' ? null : view);
    if (view === 'flowers') buildGrid();
  }

  function closePanel() {
    if (!openView) return;
    openView = null;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    setNav(null);
  }

  const togglePanel = view => openView === view ? closePanel() : openPanel(view);

  function buildGrid() {
    const grid = $('flower-grid');
    grid.innerHTML = FLOWERS.map((f, i) => `<button type="button" class="flower-card${f.key === current ? ' is-current' : ''}" data-flower="${f.key}">
        <canvas width="200" height="200" data-key="${f.key}" aria-hidden="true"></canvas>
        <span class="card-index">0${i + 1}</span><strong>${f.name}</strong><span class="card-note">${f.facts[1][1]}</span></button>`).join('');
    grid.querySelectorAll('canvas').forEach(c => paintThumb(c, c.dataset.key));
  }

  navLinks.forEach(a => a.addEventListener('click', e => { e.preventDefault(); togglePanel(a.dataset.view); }));
  document.querySelector('.menu').addEventListener('click', () => togglePanel('menu'));
  panel.addEventListener('click', e => {
    if (e.target.closest('.panel-close') || e.target.classList.contains('panel-backdrop')) return closePanel();
    const open = e.target.closest('[data-open]');
    if (open) return openPanel(open.dataset.open);
    const card = e.target.closest('.flower-card');
    if (card) return card.dataset.flower === current ? closePanel() : travel(card.dataset.flower);
    if (e.target.closest('#explore-next')) return travel();
    if (e.target.closest('#explore-random')) {
      const others = Object.keys(states).filter(k => k !== current);
      travel(others[Math.floor(Math.random() * others.length)]);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  flowerList.addEventListener('click', e => {
    const item = e.target.closest('.flower-item');
    if (item) travel(item.dataset.flower);
  });
  flowerList.addEventListener('keydown', e => {
    const item = e.target.closest('.flower-item');
    if (item && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); travel(item.dataset.flower); }
  });
  portal.addEventListener('click', () => travel());

  function runPreloader() {
    const value = $('preloader-value'), count = $('preloader-count'), logo = $('floating-logo'), pre = $('preloader');
    const loaded = imageReady($('preloader-image'), 8000);
    const DURATION = 4000, t0 = performance.now();

    function finish() {
      value.textContent = '100';
      count.classList.add('is-leaving');
      logo.classList.add('is-docked');
      pre.classList.add('is-background');
      document.body.classList.add('preload-complete');
      startExperience();
      setTimeout(() => count.remove(), 750);
      setTimeout(() => logo.classList.add('is-settled'), 2000);
    }

    pre.classList.add('is-running');
    const tick = now => {
      const t = Math.min(1, (now - t0) / DURATION);
      value.textContent = Math.round(t * 100);
      t < 1 ? requestAnimationFrame(tick) : loaded.then(finish);
    };
    requestAnimationFrame(tick);
  }

  const cursor = document.querySelector('.custom-cursor');
  const orbit = cursor.querySelector('.cursor-orbit'), label = cursor.querySelector('.cursor-label');
  let px = -100, py = -100, ox = -100, oy = -100;

  function cursorLoop() {
    ox += (px - ox) * .2;
    oy += (py - oy) * .2;
    cursor.style.transform = `translate3d(${px}px,${py}px,0)`;
    const off = `${ox - px}px ${oy - py}px`;
    orbit.style.translate = off;
    label.style.translate = off;
    requestAnimationFrame(cursorLoop);
  }

  window.addEventListener('resize', () => { resizeCanvas(); fitTitle(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    if (!cursor.classList.contains('is-visible')) { ox = e.clientX; oy = e.clientY; }
    px = e.clientX; py = e.clientY;
    cursor.classList.add('is-visible');
    if (busy) return;
    targetY = (e.clientX / window.innerWidth - .5) * 37.4;
    targetX = (e.clientY / window.innerHeight - .5) * -33;
  });
  document.addEventListener('mouseleave', () => { targetX = targetY = 0; cursor.classList.remove('is-visible'); });
  portal.addEventListener('pointerenter', () => cursor.classList.add('is-enter'));
  portal.addEventListener('pointerleave', () => cursor.classList.remove('is-enter'));

  resizeCanvas();
  render();
  requestAnimationFrame(draw);
  requestAnimationFrame(cursorLoop);
  runPreloader();
})();
