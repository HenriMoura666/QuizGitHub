// Vagalume — jogo de navegador sem dependências.
(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const el = {
    score: document.getElementById("score"),
    best: document.getElementById("best"),
    lives: document.getElementById("lives"),
    overlay: document.getElementById("overlay"),
    title: document.getElementById("overlay-title"),
    text: document.getElementById("overlay-text"),
    start: document.getElementById("start"),
  };

  const COLORS = { ambar: "#ffb347", bruma: "#bfd8d2", ameixa: "#5b2a4e", papel: "#f2ede4" };
  const MAX_LIVES = 3;
  const BEST_KEY = "vagalume:recorde";

  const rand = (a, b) => a + Math.random() * (b - a);
  const hit = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;

  const stars = Array.from({ length: 50 }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(0.5, 1.6) }));

  let state = "ready"; // ready | playing | paused | over
  let player, orbs, bats, score, lives, best, spawnOrb, spawnBat, invulnerable, time, last;
  const keys = { left: false, right: false };
  let targetX = W / 2;

  try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch { best = 0; }

  function reset() {
    player = { x: W / 2, y: H - 90, r: 11 };
    orbs = [];
    bats = [];
    score = 0;
    lives = MAX_LIVES;
    spawnOrb = 0;
    spawnBat = 1.5;
    invulnerable = 0;
    time = 0;
    targetX = W / 2;
    updateHud();
  }

  function updateHud() {
    el.score.textContent = score;
    el.best.textContent = best;
    el.lives.textContent = "●".repeat(lives) + "○".repeat(MAX_LIVES - lives);
  }

  function showOverlay(title, text, button) {
    el.title.textContent = title;
    el.text.textContent = text;
    el.start.textContent = button;
    el.overlay.hidden = false;
    el.start.focus();
  }

  function startGame() {
    reset();
    state = "playing";
    el.overlay.hidden = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function togglePause() {
    if (state === "playing") {
      state = "paused";
      showOverlay("Pausado", "Respire. A noite espera.", "Continuar");
    } else if (state === "paused") {
      state = "playing";
      el.overlay.hidden = true;
      last = performance.now();
      requestAnimationFrame(loop);
    }
  }

  function gameOver() {
    state = "over";
    if (score > best) {
      best = score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch { /* armazenamento indisponível */ }
    }
    updateHud();
    showOverlay("Fim da noite", `Você juntou ${score} luzes. Recorde: ${best}.`, "Jogar de novo");
  }

  function update(dt) {
    time += dt;
    const nivel = 1 + time / 25;

    // teclado move o alvo; mouse/toque também define o alvo
    if (keys.left) targetX -= 420 * dt;
    if (keys.right) targetX += 420 * dt;
    targetX = Math.max(player.r, Math.min(W - player.r, targetX));
    player.x += (targetX - player.x) * Math.min(1, dt * 12);

    spawnOrb -= dt;
    if (spawnOrb <= 0) {
      orbs.push({ x: rand(20, W - 20), y: -10, r: 8, vy: rand(70, 110) * nivel });
      spawnOrb = rand(0.5, 1.1);
    }

    spawnBat -= dt;
    if (spawnBat <= 0) {
      bats.push({ x: rand(30, W - 30), y: -20, r: 15, vy: rand(110, 160) * nivel, fase: rand(0, 6.28), amp: rand(30, 90) });
      spawnBat = Math.max(0.5, rand(1.2, 2.2) / nivel);
    }

    for (const o of orbs) o.y += o.vy * dt;
    for (const b of bats) { b.y += b.vy * dt; b.x += Math.sin(time * 3 + b.fase) * b.amp * dt; }

    orbs = orbs.filter((o) => {
      if (hit(player, o)) { score += 1; updateHud(); return false; }
      return o.y < H + 20;
    });

    invulnerable = Math.max(0, invulnerable - dt);
    bats = bats.filter((b) => {
      if (invulnerable === 0 && hit(player, b)) {
        lives -= 1;
        invulnerable = 1.2;
        updateHud();
        if (lives === 0) gameOver();
        return false;
      }
      return b.y < H + 30;
    });
  }

  function drawBat(b) {
    const flap = Math.sin(time * 14 + b.fase) * 8;
    ctx.fillStyle = COLORS.ameixa;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 7, 9, 0, 0, Math.PI * 2);
    ctx.moveTo(b.x - 5, b.y);
    ctx.quadraticCurveTo(b.x - 22, b.y - 12 + flap, b.x - 26, b.y + 4);
    ctx.quadraticCurveTo(b.x - 14, b.y + 2, b.x - 5, b.y + 8);
    ctx.moveTo(b.x + 5, b.y);
    ctx.quadraticCurveTo(b.x + 22, b.y - 12 + flap, b.x + 26, b.y + 4);
    ctx.quadraticCurveTo(b.x + 14, b.y + 2, b.x + 5, b.y + 8);
    ctx.fill();
    ctx.fillStyle = COLORS.papel;
    ctx.fillRect(b.x - 4, b.y - 3, 2, 2);
    ctx.fillRect(b.x + 2, b.y - 3, 2, 2);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = COLORS.bruma;
    ctx.globalAlpha = 0.35;
    for (const s of stars) ctx.fillRect(s.x, s.y, s.r, s.r);
    ctx.globalAlpha = 1;

    ctx.shadowColor = COLORS.ambar;
    ctx.shadowBlur = 14;
    ctx.fillStyle = COLORS.ambar;
    for (const o of orbs) { ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.shadowBlur = 0;

    for (const b of bats) drawBat(b);

    if (player && (invulnerable === 0 || Math.floor(time * 12) % 2 === 0)) {
      ctx.shadowColor = COLORS.ambar;
      ctx.shadowBlur = 28;
      ctx.fillStyle = COLORS.papel;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.ambar;
      ctx.beginPath();
      ctx.arc(player.x, player.y + 5, player.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(now) {
    if (state !== "playing") { draw(); return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    if (state === "playing") requestAnimationFrame(loop);
    else draw();
  }

  function pointerToX(e) {
    const rect = canvas.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * W;
  }

  canvas.addEventListener("pointermove", pointerToX);
  canvas.addEventListener("pointerdown", pointerToX);

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (e.key === "ArrowLeft" || k === "a") keys.left = true;
    if (e.key === "ArrowRight" || k === "d") keys.right = true;
    if (k === "p") togglePause();
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (e.key === "ArrowLeft" || k === "a") keys.left = false;
    if (e.key === "ArrowRight" || k === "d") keys.right = false;
  });

  el.start.addEventListener("click", () => (state === "paused" ? togglePause() : startGame()));

  reset();
  draw();
})();
