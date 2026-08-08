// ---------- year + live clock ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
const clockEl = document.getElementById("clock");
function tickClock() {
  if (!clockEl) return;
  const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  clockEl.textContent = t + " local";
}
setInterval(tickClock, 1000); tickClock();

// ---------- custom cursor ----------
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
if (dot && ring && matchMedia("(pointer: fine)").matches) {
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; });
  (function follow() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(follow); })();
  document.querySelectorAll("[data-cursor], a, button").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("hover"));
    el.addEventListener("pointerleave", () => ring.classList.remove("hover"));
  });
}

// ---------- scroll reveal ----------
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); revObs.unobserve(e.target); if (e.target.querySelector("[data-count]") || e.target.matches("[data-count]")) countUp(e.target); } });
}, { threshold: 0.18 });
document.querySelectorAll(".reveal").forEach((el) => revObs.observe(el));

// ---------- count-up stats ----------
function countUp(scope) {
  const el = scope.matches?.("[data-count]") ? scope : scope.querySelector?.("[data-count]");
  if (!el || el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseInt(el.dataset.count, 10) || 0;
  const start = performance.now(), dur = 1100;
  (function step(now) {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}
document.querySelectorAll(".card-stat").forEach((c) => revObs.observe(c));

// ---------- magnetic buttons ----------
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

// ---------- subtle tilt on bento cards ----------
if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg) translateY(-2px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

// ---------- nav active underline by section ----------
const navLinks = [...document.querySelectorAll(".nav-links a")];
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((a) => a.style.color = a.getAttribute("href") === "#" + e.target.id ? "var(--text)" : "");
    }
  });
}, { threshold: 0.5 });
["work", "about", "watch", "contact"].forEach((id) => { const s = document.getElementById(id); if (s) navObs.observe(s); });

/* =========================================================================
 * Saxophone synth (Web Audio) + equalizer animation
 * =======================================================================*/
let audioCtx = null, analyser = null, freqData = null, isPlaying = false;
let heroAudio = 0; // shared 0..1 level that drives the hero particles
const phrase = [[392, 0.32], [440, 0.22], [523.25, 0.5], [466.16, 0.3], [440, 0.3], [392, 0.55], [349.23, 0.3], [392, 0.62]];
const playButtons = [document.getElementById("play-btn"), document.getElementById("play-btn-2")].filter(Boolean);
const eqBig = document.getElementById("eq-big");
const eqBars = eqBig ? [...eqBig.children] : [];

function saxVoice(ctx, dest, freq, start, dur) {
  const osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.setValueAtTime(freq, start);
  const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.setValueAtTime(1100, start); filter.frequency.linearRampToValueAtTime(2400, start + 0.08); filter.Q.value = 6;
  const gain = ctx.createGain(); gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(0.34, start + 0.06); gain.gain.setValueAtTime(0.34, start + Math.max(0.13, dur - 0.12)); gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 5.5; const lg = ctx.createGain(); lg.gain.value = freq * 0.012; lfo.connect(lg).connect(osc.frequency);
  osc.connect(filter).connect(gain).connect(dest); osc.start(start); lfo.start(start); osc.stop(start + dur); lfo.stop(start + dur);
}
function playSax() {
  if (isPlaying) return;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  analyser = audioCtx.createAnalyser(); analyser.fftSize = 64; freqData = new Uint8Array(analyser.frequencyBinCount);
  const master = audioCtx.createGain(); master.gain.value = 0.9; master.connect(analyser); analyser.connect(audioCtx.destination);
  let t = audioCtx.currentTime + 0.05, total = 0;
  phrase.forEach(([f, d]) => { saxVoice(audioCtx, master, f, t, d); t += d; total += d; });
  isPlaying = true;
  playButtons.forEach((b) => { b.classList.add("playing"); b.setAttribute("aria-pressed", "true"); });
  setTimeout(() => { isPlaying = false; playButtons.forEach((b) => { b.classList.remove("playing"); b.setAttribute("aria-pressed", "false"); }); }, (total + 0.2) * 1000);
}
window.playSax = playSax;
playButtons.forEach((b) => b.addEventListener("click", playSax));

// Equalizer animation loop
(function eqLoop() {
  requestAnimationFrame(eqLoop);
  if (isPlaying && analyser) {
    analyser.getByteFrequencyData(freqData);
    let sum = 0; for (let i = 0; i < freqData.length; i++) sum += freqData[i];
    heroAudio = Math.min(1, (sum / freqData.length / 255) * 1.6);
    eqBars.forEach((bar, i) => { const v = (freqData[i % freqData.length] / 255) * 100; bar.style.height = Math.max(8, v) + "%"; });
  } else {
    heroAudio *= 0.92;
    const t = Date.now() * 0.004;
    eqBars.forEach((bar, i) => { bar.style.height = (12 + (Math.sin(t + i * 0.6) * 0.5 + 0.5) * 22) + "%"; });
  }
})();

/* =========================================================================
 * "How'd he make that" effects
 * =======================================================================*/
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1) Spotlight glow that follows the cursor across bento cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

// 2) Text scramble / decode on headings
function scramble(el) {
  if (el.dataset.scrambled) return;
  el.dataset.scrambled = "1";
  const final = (el.dataset.final = el.dataset.final || el.textContent);
  const glyphs = "!<>-_\\/[]{}—=+*^?#01";
  const reveal = final.split("").map(() => Math.floor(Math.random() * 16));
  let frame = 0;
  (function step() {
    let out = "", done = 0;
    for (let i = 0; i < final.length; i++) {
      if (final[i] === " ") { out += " "; done++; continue; }
      if (frame >= reveal[i] + 9) { out += final[i]; done++; }
      else if (frame >= reveal[i]) out += glyphs[(Math.random() * glyphs.length) | 0];
      else out += "";
    }
    el.textContent = out;
    frame++;
    if (done < final.length) requestAnimationFrame(step); else el.textContent = final;
  })();
}
const scrambleObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { scramble(e.target); scrambleObs.unobserve(e.target); } });
}, { threshold: 0.4 });
document.querySelectorAll("[data-scramble]").forEach((el) => scrambleObs.observe(el));

// 3) Marquee skews with scroll velocity
(function marqueeSkew() {
  const marquee = document.querySelector(".marquee");
  if (!marquee) return;
  let lastY = window.scrollY, skew = 0;
  (function loop() {
    requestAnimationFrame(loop);
    const y = window.scrollY, v = y - lastY; lastY = y;
    const target = Math.max(-14, Math.min(14, v * -0.5));
    skew += (target - skew) * 0.12;
    marquee.style.transform = `skewX(${skew.toFixed(2)}deg)`;
  })();
})();

// 4) Interactive particle constellation in the hero
(function constellation() {
  const canvas = document.querySelector(".hero-fx");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, pts = [], maxD = 120 * dpr;
  const mouse = { x: -9999, y: -9999 };
  function resize() {
    const r = canvas.getBoundingClientRect();
    w = canvas.width = Math.max(1, r.width * dpr); h = canvas.height = Math.max(1, r.height * dpr);
    canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
    const count = Math.min(85, Math.floor(r.width / 15));
    pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr }));
  }
  resize(); addEventListener("resize", resize);
  const host = canvas.parentElement;
  host.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * dpr; mouse.y = (e.clientY - r.top) * dpr; });
  host.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
  const R = 170 * dpr;
  (function draw() {
    requestAnimationFrame(draw);
    if (!visible) return;
    const A = heroAudio; // sound reactivity (0..1)
    const connectD = maxD * (1 + A * 0.45);
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < R) { const f = (1 - d / R) * 0.5; p.vx += (dx / (d || 1)) * f; p.vy += (dy / (d || 1)) * f; }
      if (A > 0.02) { p.vx += (Math.random() - 0.5) * A * 0.5 * dpr; p.vy += (Math.random() - 0.5) * A * 0.5 * dpr; }
      p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy *= 0.985;
      if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < connectD) { ctx.strokeStyle = `rgba(205,252,79,${(1 - d / connectD) * (0.26 + A * 0.6)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
    }
    const sizeBoost = 1 + A * 0.9;
    for (const p of pts) {
      const near = Math.hypot(p.x - mouse.x, p.y - mouse.y) < R;
      ctx.fillStyle = (near || A > 0.25) ? `rgba(205,252,79,${0.8 + A * 0.2})` : "rgba(196,214,255,0.72)";
      ctx.beginPath(); ctx.arc(p.x, p.y, (near ? 2.1 : 1.6) * dpr * sizeBoost, 0, 7); ctx.fill();
    }
  })();
})();

// 5) Scroll-progress bar
(function scrollProgress() {
  const fill = document.querySelector(".scroll-progress span");
  if (!fill) return;
  function update() {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    fill.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  addEventListener("scroll", update, { passive: true }); update();
})();

// 6) Subtle mouse parallax on the hero name
(function heroParallax() {
  const title = document.querySelector(".hero-title");
  const hero = document.querySelector(".hero");
  if (!title || !hero) return;
  hero.addEventListener("pointermove", (e) => {
    const cx = innerWidth / 2, cy = innerHeight / 2;
    title.style.transform = `translate(${(e.clientX - cx) * 0.012}px, ${(e.clientY - cy) * 0.012}px)`;
  });
  hero.addEventListener("pointerleave", () => { title.style.transform = ""; });
})();

// 7) Page-load intro screen
(function intro() {
  const el = document.getElementById("intro");
  if (!el) return;
  const hide = () => { el.classList.add("done"); setTimeout(() => el.remove(), 900); };
  const delay = REDUCED ? 200 : 1100;
  if (document.readyState === "complete") setTimeout(hide, delay);
  else addEventListener("load", () => setTimeout(hide, delay));
  setTimeout(hide, 3500); // safety
})();

// 8) Back-to-top button
(function toTop() {
  const btn = document.querySelector(".to-top");
  if (!btn) return;
  btn.addEventListener("click", () => scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));
  addEventListener("scroll", () => { btn.classList.toggle("show", window.scrollY > 700); }, { passive: true });
})();
