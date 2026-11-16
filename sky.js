(() => {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, stars = [], meteors = [], last = 0, nextMeteor = 1500;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.round((innerWidth * innerHeight) / 5000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.2 + 0.3) * dpr,
      speed: (Math.random() * 0.06 + 0.01) * dpr,
      phase: Math.random() * Math.PI * 2,
      green: Math.random() < 0.12,
    }));
  }

  function spawnMeteor() {
    const angle = Math.PI / 5 + Math.random() * 0.3;
    const speed = (0.9 + Math.random() * 0.6) * dpr;
    meteors.push({
      x: Math.random() * w * 0.8 + w * 0.2,
      y: Math.random() * h * 0.3,
      vx: -Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      ttl: 900 + Math.random() * 500,
    });
  }

  function frame(t) {
    const dt = Math.min(t - last, 50);
    last = t;
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      if (!reduceMotion) {
        s.y += s.speed * dt * 0.06;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      }
      const twinkle = 0.55 + 0.45 * Math.sin(t / 900 + s.phase);
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = s.green ? "#9be15d" : "#dfe6ee";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) {
      nextMeteor -= dt;
      if (nextMeteor <= 0) { spawnMeteor(); nextMeteor = 2500 + Math.random() * 4000; }
      meteors = meteors.filter((m) => m.life < m.ttl);
      for (const m of meteors) {
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const fade = 1 - m.life / m.ttl;
        const tail = 90 * dpr;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        grad.addColorStop(1, "rgba(118,185,0,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6 * dpr;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
})();
