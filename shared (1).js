/* ═══════════════════════════════════════
   SHARED.JS — Unknown Modz
   Include at bottom of every page's body
═══════════════════════════════════════ */
const $$ = id => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;

/* ── Aurora background ── */
(function () {
  const cv = $$('auroraCanvas'); if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const blobs = [
    { x: .20, y: .30, r: .55, h: 260, s: .00008 },
    { x: .75, y: .50, r: .50, h: 200, s: .00006 },
    { x: .50, y: .80, r: .45, h: 290, s: .00010 },
    { x: .10, y: .70, r: .40, h: 180, s: .00007 },
    { x: .85, y: .20, r: .38, h: 320, s: .00009 },
  ];
  let t = 0;
  (function draw() {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = '#04040d'; cx.fillRect(0, 0, W, H);
    blobs.forEach((b, i) => {
      const bx = W * (b.x + Math.sin(t * b.s * 1000 + i * 1.3) * .12);
      const by = H * (b.y + Math.cos(t * b.s * 800  + i * 2.1) * .10);
      const br = Math.min(W, H) * b.r;
      const g = cx.createRadialGradient(bx, by, 0, bx, by, br);
      const hue = (b.h + t * .012) % 360;
      g.addColorStop(0,   `hsla(${hue},100%,60%,.10)`);
      g.addColorStop(.5,  `hsla(${hue + 40},90%,50%,.05)`);
      g.addColorStop(1,   'transparent');
      cx.beginPath(); cx.arc(bx, by, br, 0, Math.PI * 2);
      cx.fillStyle = g; cx.fill();
    });
    t++; requestAnimationFrame(draw);
  })();
})();

/* ── Intro particle explosion ── */
(function () {
  const cv = $$('introCanvas'); if (!cv) return;
  const cx = cv.getContext('2d');
  const intro = $$('intro'), page = $$('page'), skip = $$('skipBtn');
  let W, H, raf, done = false, tick = 0, ringR = 0, ringAlpha = 0;
  const COLORS = ['#7b2fff', '#00d4ff', '#ff2d78', '#ffffff', '#a78bff'];
  const particles = [];
  const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
  resize();

  function spawnBurst(ox, oy) {
    for (let i = 0; i < 180; i++) {
      const angle = rand(0, Math.PI * 2), speed = rand(1.5, 9), size = rand(1.5, 5);
      particles.push({ x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        alpha: 1, decay: rand(.012, .025), size, color: COLORS[Math.floor(rand(0, COLORS.length))], trail: [] });
    }
  }

  function loop() {
    if (done) return;
    raf = requestAnimationFrame(loop); tick++;
    cx.clearRect(0, 0, W, H);
    const vig = cx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * .7);
    vig.addColorStop(0, 'rgba(4,4,13,0)'); vig.addColorStop(1, 'rgba(4,4,13,.85)');
    cx.fillStyle = vig; cx.fillRect(0, 0, W, H);
    if (tick === 1)  spawnBurst(W/2, H/2);
    if (tick === 18) spawnBurst(W/2, H/2);
    if (tick === 35) spawnBurst(W/2, H/2);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 8) p.trail.shift();
      p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy *= .97; p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      for (let j = 1; j < p.trail.length; j++) {
        cx.globalAlpha = (j / p.trail.length) * p.alpha * .4;
        cx.lineWidth = p.size * .5; cx.strokeStyle = p.color;
        cx.beginPath(); cx.moveTo(p.trail[j-1].x, p.trail[j-1].y);
        cx.lineTo(p.trail[j].x, p.trail[j].y); cx.stroke();
      }
      cx.globalAlpha = p.alpha; cx.shadowBlur = 10; cx.shadowColor = p.color;
      cx.beginPath(); cx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      cx.fillStyle = p.color; cx.fill();
      cx.shadowBlur = 0; cx.globalAlpha = 1;
    }
    if (tick > 5) {
      ringR += 6 + ringR * .04;
      ringAlpha = Math.max(0, 1 - ringR / (Math.max(W, H) * .8));
      for (let k = 0; k < 3; k++) {
        const rr = ringR - k * 30; if (rr <= 0) continue;
        cx.beginPath(); cx.arc(W/2, H/2, rr, 0, Math.PI * 2);
        cx.strokeStyle = `rgba(123,47,255,${ringAlpha * (1 - k * .25)})`;
        cx.lineWidth = 1.5 - k * .4; cx.stroke();
      }
    }
    if (tick > 20 && tick < 120) {
      const n = 12, t2 = tick * .018; cx.lineWidth = .6;
      for (let i = 0; i < n; i++) {
        const a1 = (i / n) * Math.PI * 2 + t2, a2 = ((i + 3) / n) * Math.PI * 2 + t2;
        const r = 80 + Math.sin(t2 * 3 + i) * 20;
        const alp = Math.min(1, (tick - 20) / 30) * (1 - Math.max(0, (tick - 95) / 25));
        cx.beginPath();
        cx.moveTo(W/2 + Math.cos(a1) * r, H/2 + Math.sin(a1) * r);
        cx.lineTo(W/2 + Math.cos(a2) * r, H/2 + Math.sin(a2) * r);
        cx.strokeStyle = `rgba(0,212,255,${alp * .45})`; cx.stroke();
      }
    }
    if (tick === 210) endIntro();
  }

  function endIntro() {
    if (done) return; done = true; cancelAnimationFrame(raf);
    intro.classList.add('gone'); page.classList.add('visible');
    document.querySelectorAll('.link-tile').forEach((el, i) => {
      el.style.cssText += `opacity:0;transform:translateY(22px);
        transition:opacity .5s ease ${i * .09 + .1}s,transform .5s cubic-bezier(.22,1,.36,1) ${i * .09 + .1}s;`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1'; el.style.transform = 'translateY(0)';
      }));
    });
    document.querySelectorAll('.avatar-ring,.brand-title,.brand-sub,.v-pill,.coming-soon-wrap,.page-heading,.page-sub,.back-btn').forEach((el, i) => {
      el.style.cssText += `opacity:0;transform:translateY(16px);
        transition:opacity .55s ease ${i * .1}s,transform .55s cubic-bezier(.22,1,.36,1) ${i * .1}s;`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1'; el.style.transform = 'translateY(0)';
      }));
    });
  }

  if (skip) skip.addEventListener('click', endIntro);
  loop();
})();

/* ── Visitor counter ── */
(function () {
  const el = $$('vCount'); if (!el) return;
  const key = window.COUNTER_KEY || 'um_page_default';
  const cached = localStorage.getItem('um_count_' + key);
  el.textContent = cached || '0';
  fetch(`https://api.counterapi.dev/v1/${key}/hits/up`)
    .then(r => r.json())
    .then(d => {
      if (d && typeof d.count === 'number') {
        const n = d.count.toLocaleString();
        el.textContent = n;
        localStorage.setItem('um_count_' + key, n);
      }
    }).catch(() => {});
})();

/* ── Ripple click effect ── */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('click', e => {
  if (e.target.closest('.link-tile') || e.target.closest('#intro') || e.target.closest('.skip-btn')) return;
  const r = document.createElement('div');
  Object.assign(r.style, {
    position: 'fixed', left: e.clientX + 'px', top: e.clientY + 'px',
    width: '6px', height: '6px', marginLeft: '-3px', marginTop: '-3px',
    borderRadius: '50%', border: '1.5px solid rgba(123,47,255,.7)',
    pointerEvents: 'none', zIndex: '9000', animation: 'rippleOut .6s ease forwards'
  });
  document.body.appendChild(r); setTimeout(() => r.remove(), 700);
});
const _rs = document.createElement('style');
_rs.textContent = '@keyframes rippleOut{0%{transform:scale(1);opacity:1}100%{transform:scale(18);opacity:0}}';
document.head.appendChild(_rs);
