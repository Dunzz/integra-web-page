// =========================================================
// Integra – lógica de la página
// Todo el contenido se toma de js/data.js (INTEGRA_DATA).
// Normalmente NO necesitas editar este archivo.
// =========================================================
(function () {
  "use strict";
  const D = window.INTEGRA_DATA || (typeof INTEGRA_DATA !== "undefined" ? INTEGRA_DATA : {});
  const $ = (sel) => document.querySelector(sel);
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- WhatsApp ----------
  const waNumber = (D.contacto && D.contacto.whatsapp) || "527776103610";
  const waLink = (msg) => `https://wa.me/${waNumber}` + (msg ? `?text=${encodeURIComponent(msg)}` : "");
  document.querySelectorAll(".js-wa").forEach((a) => (a.href = waLink(D.contacto && D.contacto.mensajeWhatsApp)));

  // Imagen con respaldo: si no carga, queda el fondo de color del contenedor.
  const img = (src, alt, cls = "") =>
    src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">` : "";

  // ---------- Cifras ----------
  const cifrasEl = $("#cifras-grid");
  if (cifrasEl && D.cifras) {
    cifrasEl.innerHTML = D.cifras
      .map((c) => `<div class="cifra reveal"><span class="cifra-num" data-target="${Number(c.numero) || 0}" data-suffix="${esc(c.sufijo)}">0${esc(c.sufijo)}</span><span class="cifra-label">${esc(c.etiqueta)}</span></div>`)
      .join("");
  }
  const animateCount = (el) => {
    const target = Number(el.dataset.target), suffix = el.dataset.suffix || "";
    const dur = 1400, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ---------- Galería de trabajos ----------
  const trabajos = D.trabajos || [];
  const gallery = $("#gallery");
  if (gallery) {
    gallery.innerHTML = trabajos
      .map((t, i) => `
        <button class="gallery-item reveal" data-index="${i}" aria-label="Ver foto: ${esc(t.titulo)}">
          <div class="ph">${img(t.imagen, `${t.titulo} en ${t.lugar}`)}</div>
          <div class="gallery-info">
            <h3>${esc(t.titulo)}</h3>
            <span class="place">${esc(t.lugar)}</span>
            <p>${esc(t.descripcion)}</p>
          </div>
        </button>`)
      .join("");
  }

  // ---------- Lightbox ----------
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-caption");
  let current = 0, lastFocus = null;
  const showItem = (i) => {
    current = (i + trabajos.length) % trabajos.length;
    const t = trabajos[current];
    lbImg.src = t.imagen || "";
    lbImg.alt = `${t.titulo} en ${t.lugar}`;
    lbCap.innerHTML = `<strong>${esc(t.titulo)}</strong> · ${esc(t.lugar)}<br>${esc(t.descripcion)}`;
  };
  const openLb = (i) => { lastFocus = document.activeElement; showItem(i); lb.hidden = false; document.body.classList.add("no-scroll"); lb.querySelector(".lb-close").focus(); };
  const closeLb = () => { lb.hidden = true; document.body.classList.remove("no-scroll"); lastFocus && lastFocus.focus(); };
  if (gallery && lb) {
    gallery.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (item) openLb(Number(item.dataset.index));
    });
    lb.querySelector(".lb-close").addEventListener("click", closeLb);
    lb.querySelector(".lb-prev").addEventListener("click", () => showItem(current - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => showItem(current + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showItem(current - 1);
      if (e.key === "ArrowRight") showItem(current + 1);
    });
  }

  // ---------- Melaminas ----------
  const melaminas = D.melaminas || [];
  const swatchesEl = $("#swatches"), filtersEl = $("#melamina-filters");
  const swatchStyle = (m) => {
    if (m.imagen) return `background-image:url('${esc(m.imagen)}')`;
    let bg = m.veta
      ? `repeating-linear-gradient(100deg, rgba(0,0,0,.10) 0 2px, transparent 2px 9px, rgba(255,255,255,.07) 9px 11px, transparent 11px 19px), ${m.color}`
      : m.color;
    if (m.acabado === "Brillo") bg = `linear-gradient(135deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 45%), ${bg}`;
    if (m.acabado === "Texturizado" && !m.veta) bg = `radial-gradient(rgba(0,0,0,.12) 1px, transparent 1.5px) 0 0/6px 6px, ${bg}`;
    return `background:${bg}`;
  };
  const renderSwatches = (tipo) => {
    swatchesEl.innerHTML = melaminas
      .filter((m) => tipo === "Todas" || m.tipo === tipo)
      .map((m) => `<figure class="swatch"><div class="swatch-color" style="${swatchStyle(m)}" role="img" aria-label="Muestra ${esc(m.nombre)}"></div><figcaption><strong>${esc(m.nombre)}</strong><span>${esc(m.tipo)} · ${esc(m.acabado)}</span></figcaption></figure>`)
      .join("");
  };
  if (swatchesEl && filtersEl) {
    const tipos = ["Todas", ...new Set(melaminas.map((m) => m.tipo))];
    filtersEl.innerHTML = tipos.map((t, i) => `<button class="filter${i === 0 ? " active" : ""}" aria-pressed="${i === 0}" data-tipo="${esc(t)}">${esc(t)}</button>`).join("");
    filtersEl.addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      filtersEl.querySelectorAll(".filter").forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b); });
      renderSwatches(b.dataset.tipo);
    });
    renderSwatches("Todas");
  }

  // ---------- Muebles ----------
  const mueblesEl = $("#muebles-grid");
  if (mueblesEl && D.muebles) {
    mueblesEl.innerHTML = D.muebles
      .map((m) => `<article class="card reveal"><div class="ph">${img(m.imagen, m.titulo)}</div><div class="card-body"><h3>${esc(m.titulo)}</h3><p>${esc(m.descripcion)}</p></div></article>`)
      .join("");
  }

  // ---------- Zonas ----------
  const zonasEl = $("#zonas-list");
  if (zonasEl && D.zonas) zonasEl.innerHTML = D.zonas.map((z) => `<li class="chip reveal">${esc(z)}</li>`).join("");

  // ---------- Testimonios ----------
  const testEl = $("#testimonios-grid");
  if (testEl) {
    if (D.testimonios && D.testimonios.length) {
      testEl.innerHTML = D.testimonios
        .map((t) => `<blockquote class="testimonial reveal"><p>“${esc(t.texto)}”</p><footer>${esc(t.autor)} · ${esc(t.lugar)}</footer></blockquote>`)
        .join("");
    } else {
      $("#testimonios").remove();
    }
  }

  // ---------- Contacto ----------
  const infoEl = $("#contact-info");
  if (infoEl && D.contacto) {
    const c = D.contacto, rows = [];
    if (c.telefonoVisible) rows.push(`<li><span>WhatsApp / Tel.</span><a href="tel:+${esc(c.whatsapp)}">${esc(c.telefonoVisible)}</a></li>`);
    if (c.correo) rows.push(`<li><span>Correo</span><a href="mailto:${esc(c.correo)}">${esc(c.correo)}</a></li>`);
    if (c.horario) rows.push(`<li><span>Horario</span>${esc(c.horario)}</li>`);
    infoEl.innerHTML = rows.join("");
  }
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const lines = [
        "Hola Integra, quiero una cotización.",
        `Nombre: ${f.get("nombre")}`,
        f.get("ciudad") && `Ciudad: ${f.get("ciudad")}`,
        `Me interesa: ${f.get("interes")}`,
        f.get("mensaje") && `Mensaje: ${f.get("mensaje")}`,
      ].filter(Boolean);
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  // ---------- Redes sociales ----------
  const icons = {
    Facebook: '<path d="M14 9h3V5h-3c-2.8 0-4 1.7-4 4.3V11H7v4h3v9h4v-9h3l1-4h-4V9.5c0-.3.2-.5.5-.5Z"/>',
    Instagram: '<path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3c-2.4 0-2.7 0-3.7.1-3.2.1-5 1.9-5.2 5.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.2 1.9 5 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.2-.1 5-1.9 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.2-1.9-5-5.2-5.2C14.7 3 14.4 3 12 3Zm0 1.6c2.4 0 2.6 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.3-3.6 3.7-3.7.9-.1 1.2-.1 3.6-.1Z"/>',
    TikTok: '<path d="M16.6 3h-3.3v12.3a2.8 2.8 0 1 1-2-2.7V9.2a6.1 6.1 0 1 0 5.3 6V9a7.6 7.6 0 0 0 4.4 1.4V7.1A4.4 4.4 0 0 1 16.6 3Z"/>',
  };
  const socialEl = $("#social");
  if (socialEl && D.redes) {
    socialEl.innerHTML = D.redes
      .filter((r) => r.url)
      .map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="${esc(r.nombre)}"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">${icons[r.nombre] || ""}</svg></a></li>`)
      .join("");
  }

  // ---------- Año ----------
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Menú móvil ----------
  const toggle = $(".menu-toggle"), header = $("#header");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    document.querySelectorAll(".main-nav a").forEach((a) =>
      a.addEventListener("click", () => { header.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", false); })
    );
  }
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  // ---------- Aparición suave al hacer scroll ----------
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        if (en.target.classList.contains("cifra")) en.target.querySelectorAll(".cifra-num").forEach(animateCount);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".cifra-num").forEach((el) => (el.textContent = el.dataset.target + (el.dataset.suffix || "")));
  }
})();
