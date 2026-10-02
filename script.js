// ---------- signal reel player ----------
(function () {
  const video = document.getElementById('video');
  const monitor = document.getElementById('monitor');
  const acquire = document.getElementById('acquire');
  const acqPct = document.getElementById('acqPct');
  const acqBars = document.getElementById('acqBars');
  const tc = document.getElementById('tc');
  const chapterEl = document.getElementById('chapter');
  const bar = document.getElementById('bar');
  const scrub = document.getElementById('scrub');
  const ticks = document.getElementById('ticks');
  const playBtn = document.getElementById('playBtn');
  const soundBtn = document.getElementById('soundBtn');
  const replayBtn = document.getElementById('replayBtn');
  const bigplay = document.getElementById('bigplay');

  // chapter start times (seconds) — matches the reel
  const CHAPTERS = [
    [0, 'ACQUIRING SIGNAL'], [4, 'THIS IS ME'], [9.5, 'THE STATEMENT'], [15, 'THE PROBLEM'],
    [20.5, 'TRIGGER'], [24, 'AI STEP'], [29.5, 'ROUTE + RETRY'], [35, 'OUTPUT'],
    [39.5, 'THE TOOLBOX'], [44.5, 'RECEIPTS'], [51, 'THREE HATS'], [57.5, 'SAY HELLO']
  ];
  const DUR = 66;

  CHAPTERS.slice(1).forEach(([t]) => {
    const s = document.createElement('span');
    s.style.left = (t / DUR * 100) + '%';
    ticks.appendChild(s);
  });

  const pad = n => String(n).padStart(2, '0');

  function update() {
    const t = video.currentTime || 0;
    const d = video.duration || DUR;
    const f = Math.floor((t % 1) * 24);
    tc.textContent = `${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(f)}`;
    let i = 0;
    CHAPTERS.forEach(([s], k) => { if (t >= s) i = k; });
    chapterEl.innerHTML = `<b>${pad(i + 1)}/${pad(CHAPTERS.length)}</b> ${CHAPTERS[i][1]}`;
    bar.style.width = (t / d * 100) + '%';
    scrub.setAttribute('aria-valuenow', Math.round(t));
  }

  function setState() {
    const paused = video.paused;
    monitor.classList.toggle('paused', paused && !video.ended ? true : video.ended);
    monitor.classList.toggle('playing', !paused);
    playBtn.textContent = paused ? '▶ PLAY' : '❚❚ PAUSE';
    bigplay.innerHTML = video.ended ? '<span>↺</span> REPLAY' : '<span>▶</span> PLAY';
  }

  // "acquiring signal" loader while the video buffers
  let pct = 0;
  const loader = setInterval(() => {
    pct = Math.min(99, pct + Math.ceil(Math.random() * 9));
    acqPct.textContent = String(pct).padStart(3, '0') + '%';
    const n = Math.max(1, Math.ceil(pct / 20));
    acqBars.textContent = '▮'.repeat(n) + '▯'.repeat(5 - n);
  }, 90);

  function ready() {
    clearInterval(loader);
    acqPct.textContent = '100%';
    acqBars.textContent = '▮▮▮▮▮';
    setTimeout(() => acquire.classList.add('gone'), 250);
    const p = video.play();
    if (p && p.catch) p.catch(() => setState()); // autoplay blocked → show PLAY
  }
  if (video.readyState >= 3) ready(); else video.addEventListener('canplay', ready, { once: true });
  setTimeout(() => { if (!acquire.classList.contains('gone')) ready(); }, 6000);

  video.addEventListener('timeupdate', update);
  ['play', 'pause', 'ended'].forEach(e => video.addEventListener(e, setState));

  function toggle() { video.paused || video.ended ? video.play() : video.pause(); }
  playBtn.addEventListener('click', toggle);
  bigplay.addEventListener('click', () => { if (video.ended) video.currentTime = 0; video.play(); });
  video.addEventListener('click', toggle);
  replayBtn.addEventListener('click', () => { video.currentTime = 0; video.play(); });
  soundBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? '♪ SOUND OFF' : '♪ SOUND ON';
    soundBtn.classList.toggle('on', !video.muted);
    if (!video.muted && video.paused) video.play();
  });

  function seek(clientX) {
    const r = scrub.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    video.currentTime = x * (video.duration || DUR);
    update();
  }
  let dragging = false;
  scrub.addEventListener('pointerdown', e => { dragging = true; scrub.setPointerCapture(e.pointerId); seek(e.clientX); });
  scrub.addEventListener('pointermove', e => { if (dragging) seek(e.clientX); });
  scrub.addEventListener('pointerup', () => { dragging = false; });
  scrub.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration || DUR, video.currentTime + 5);
    if (e.key === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - 5);
  });

  // pause the reel when it scrolls out of view, resume when back
  if ('IntersectionObserver' in window) {
    let autoPaused = false;
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !video.paused) { video.pause(); autoPaused = true; }
      else if (e.isIntersecting && autoPaused) { video.play(); autoPaused = false; }
    }, { threshold: 0.25 }).observe(monitor);
  }
  setState();
  update();
})();

// ---------- reveal on scroll ----------
(function () {
  const els = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(e => io.observe(e));
})();

document.getElementById('yr').textContent = new Date().getFullYear();
