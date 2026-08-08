// ==========================================
// PORTFOLIO - Main JavaScript
// ==========================================

// ===== Typed Text Effect =====
const words = ["Frontend Developer", "Web Designer", "Creative Coder", "Student Developer"];
let wIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById("typed");

function type() {
  if (!typedEl) return;
  const word = words[wIdx];
  typedEl.textContent = deleting
    ? word.substring(0, --cIdx)
    : word.substring(0, ++cIdx);

  if (!deleting && cIdx === word.length) {
    deleting = true;
    setTimeout(type, 1900);
    return;
  }
  if (deleting && cIdx === 0) {
    deleting = false;
    wIdx = (wIdx + 1) % words.length;
  }
  setTimeout(type, deleting ? 55 : 95);
}
type();

// ===== Navbar Scroll =====
const navbar = document.getElementById("navbar");
const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  navbar && navbar.classList.toggle("scrolled", y > 50);
  scrollBtn && scrollBtn.classList.toggle("show", y > 400);

  // Active nav highlight
  let cur = "";
  document.querySelectorAll("section[id]").forEach(s => {
    if (y >= s.offsetTop - 200) cur = s.id;
  });
  document.querySelectorAll(".nav-links a[href^='#']").forEach(a => {
    a.style.color = a.getAttribute("href") === "#" + cur ? "var(--accent)" : "";
  });
});

// ===== Hamburger =====
const ham = document.getElementById("hamburger");
const nav = document.getElementById("navLinks");
ham && ham.addEventListener("click", () => {
  ham.classList.toggle("active");
  nav.classList.toggle("open");
});
nav && nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  ham.classList.remove("active");
  nav.classList.remove("open");
}));

// ===== Scroll To Top =====
scrollBtn && scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Scroll Reveal =====
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 80);
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

// ===== Skill Bar Animation =====
const bo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.pct + "%";
      bo.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll(".sb-fill").forEach(b => bo.observe(b));

// ===== Counter Animation =====
function countUp(el, target) {
  let n = 0, step = target / 55;
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n) + (el.dataset.suf || "+");
    if (n >= target) clearInterval(t);
  }, 18);
}
const co = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, +e.target.dataset.to);
      co.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".counter").forEach(el => co.observe(el));

// ===== Project Filter =====
const fBtns = document.querySelectorAll(".f-btn");
const pCards = document.querySelectorAll(".p-card");

fBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    fBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;

    pCards.forEach(c => {
      const match = cat === "all" || c.dataset.cat === cat;
      c.style.transition = "opacity 0.3s, transform 0.3s";
      c.style.opacity = "0";
      c.style.transform = "scale(0.92)";
      setTimeout(() => {
        c.style.display = match ? "" : "none";
        if (match) requestAnimationFrame(() => {
          c.style.opacity = "1";
          c.style.transform = "scale(1)";
        });
      }, 250);
    });
  });
});

// ===== Particle Canvas =====
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let pts = [], mx = null, my = null;

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener("resize", () => { resize(); init(); });
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.a = Math.random() * 0.45 + 0.1;
      this.c = Math.random() > 0.5 ? "124,58,237" : "6,182,212";
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mx !== null) {
        const dx = mx - this.x, dy = my - this.y;
        const d = Math.hypot(dx, dy);
        if (d < 110) { this.x -= dx * 0.018; this.y -= dy * 0.018; }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    const n = Math.min(Math.floor(canvas.width * canvas.height / 14000), 130);
    pts = Array.from({ length: n }, () => new Dot());
  }

  function connect() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${0.07 * (1 - d / 95)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => { p.move(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }

  init(); loop();
}

// ===== Contact Form =====
const form = document.getElementById("contactForm");
form && form.addEventListener("submit", e => {
  e.preventDefault();
  const btn = form.querySelector(".f-submit");
  const orig = btn.textContent;
  btn.textContent = "✅ Message Sent!";
  btn.style.background = "linear-gradient(135deg,#10b981,#06b6d4)";
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = "";
    form.reset();
  }, 3000);
});
