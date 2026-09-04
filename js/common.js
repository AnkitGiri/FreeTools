/* ════════════ FREE TOOLS HUB — common.js (shared shell) ════════════ */
'use strict';

/* ── Security ── */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.key === 's')) e.preventDefault();
});

/* ── Footer year ── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* Keep the header and footer identical across the hub and every category page. */
(function normalizeSharedShell() {
  const nav = document.getElementById('nav');
  const footer = document.querySelector('.site-footer');
  if (!nav) return;
  const pageName = document.querySelector('.nav-title')?.textContent.trim() || 'Free Tools Hub';
  const count = document.getElementById('toolCount')?.textContent.trim() || (pageName === 'Free Tools Hub' ? '100+' : '0');
  nav.innerHTML = `
    <a href="index.html" class="nav-brand" aria-label="Free Tools Hub home">
      <img class="brand-mark" src="favicon.ico" alt="Giritech Enterprises LLP"/>
      <span class="nav-brand-text"><span class="nav-title">${pageName}</span><span class="nav-sub">Giritech Enterprises LLP</span></span>
    </a>
    <div class="nav-pills">
      <a href="https://www.giritech.co.in" class="pill pill-green"><i class="bi bi-house-door-fill" aria-hidden="true"></i><span>Home</span></a>
      <a href="index.html" class="nav-hub-link"><i class="bi bi-grid-3x3-gap-fill" aria-hidden="true"></i><span>All Categories</span></a>
      <span class="pill pill-purple"><i class="bi bi-tools" aria-hidden="true"></i><span>${count} Tools</span></span>
      <span class="pill pill-green"><i class="bi bi-shield-lock-fill" aria-hidden="true"></i><span>Private</span></span>
      <span class="pill pill-orange"><i class="bi bi-check-circle-fill" aria-hidden="true"></i><span>Free</span></span>
    </div>
  `;
  if (footer) {
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-grid">
          <div>
            <div class="footer-logo-wrap"><img class="brand-mark footer-mark" src="favicon.ico" alt="Giritech Enterprises LLP"/><div><div class="footer-brand-name">Free Tools Hub</div><div class="footer-brand-sub">Giritech Enterprises LLP</div></div></div>
            <p class="footer-desc">Fast, private browser tools for PDF, image, SEO, developer, finance, and business workflows.</p>
            <div class="footer-tags"><span class="ftag"><i class="bi bi-shield-check" aria-hidden="true"></i> Secure</span><span class="ftag"><i class="bi bi-lightning-charge-fill" aria-hidden="true"></i> Fast</span><span class="ftag"><i class="bi bi-check-circle-fill" aria-hidden="true"></i> Free</span></div>
          </div>
          <div><h3 class="footer-col-title">Categories</h3><ul class="footer-list">
            <li onclick="location.href='pdf-tools.html'"><span class="ficon"><i class="bi bi-file-earmark-pdf-fill" aria-hidden="true"></i></span>PDF Tools</li>
            <li onclick="location.href='image-tools.html'"><span class="ficon"><i class="bi bi-images" aria-hidden="true"></i></span>Image Tools</li>
            <li onclick="location.href='seo-tools.html'"><span class="ficon"><i class="bi bi-graph-up-arrow" aria-hidden="true"></i></span>SEO Tools</li>
          </ul></div>
          <div><h3 class="footer-col-title">More Tools</h3><ul class="footer-list">
            <li onclick="location.href='dev-tools.html'"><span class="ficon"><i class="bi bi-code-slash" aria-hidden="true"></i></span>Developer Tools</li>
            <li onclick="location.href='finance-tools.html'"><span class="ficon"><i class="bi bi-calculator-fill" aria-hidden="true"></i></span>Finance Calculators</li>
            <li onclick="location.href='business-tools.html'"><span class="ficon"><i class="bi bi-briefcase-fill" aria-hidden="true"></i></span>Business Tools</li>
          </ul></div>
          <div><h3 class="footer-col-title">Privacy</h3><ul class="footer-list">
            <li><span class="ficon"><i class="bi bi-shield-check" aria-hidden="true"></i></span>No file uploads</li>
            <li><span class="ficon"><i class="bi bi-eye-slash-fill" aria-hidden="true"></i></span>No tracking</li>
            <li><span class="ficon"><i class="bi bi-trash3-fill" aria-hidden="true"></i></span>Nothing stored</li>
          </ul></div>
        </div>
        <div class="footer-bottom"><p class="footer-copy">© <span id="yr"></span> <span class="footer-brand-grad">Giritech Enterprises LLP</span>. All rights reserved.</p><nav class="footer-links"><a href="https://www.giritech.co.in/privacy">Privacy Policy</a><a href="https://www.giritech.co.in/t&c">Terms of Use</a><a href="https://www.giritech.co.in/contact">Contact</a></nav></div>
      </div>
    `;
    const footerYear = document.getElementById('yr');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  }
})();

/* ── Color palette cycle for tool cards ── */
const PALETTE = ['#6C63FF','#EC4899','#F7971E','#06B6D4','#10B981','#F43F5E','#8B5CF6','#3B82F6','#FBBF24','#A855F7','#FB7185','#22D3EE'];

/* ── Download helper ── */
function dl(content, name, mime = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2500);
}
function dlCanvas(canvas, name) {
  canvas.toBlob(blob => dl(blob, name), name.endsWith('.png') ? 'image/png' : 'image/jpeg', 0.92);
}
function readFile(f) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = e => res(e.target.result); r.onerror = rej; r.readAsArrayBuffer(f); });
}
function readFileAsDataURL(f) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = e => res(e.target.result); r.onerror = rej; r.readAsDataURL(f); });
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1E293B;color:#F1F5F9;padding:12px 22px;border-radius:99px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.1)';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}
function copyText(t) { navigator.clipboard.writeText(t).then(() => toast('✅ Copied to clipboard!')); }

/* ── Generic text-in / text-out tool builder (covers many converter-style tools) ── */
function textTool(container, opts) {
  const { label = 'Input', placeholder = '', buttonLabel = 'Run', outputLabel = 'Output',
          process, live = false, rows = 8, mono = true, extraHTML = '', skipOutput = false } = opts;
  container.innerHTML = `
    ${extraHTML}
    <div class="setting-block">
      <label class="setting-label">${label}</label>
      <textarea class="ta ${mono ? 'mono' : ''}" id="ttIn" placeholder="${placeholder}" rows="${rows}"></textarea>
    </div>
    ${live ? '' : `<button class="run-btn" id="ttRun" style="background:linear-gradient(135deg,var(--p),var(--s))"><i class="bi bi-play-fill" aria-hidden="true"></i> ${buttonLabel}</button>`}
    ${skipOutput ? '' : `
    <div class="out-block">
      <div class="out-head"><span class="out-label">${outputLabel}</span><button class="out-copy" id="ttCopy"><i class="bi bi-clipboard" aria-hidden="true"></i> Copy</button></div>
      <textarea class="ta mono" id="ttOut" readonly rows="${rows}"></textarea>
    </div>`}
    <div id="ttStatus"></div>
  `;
  const inp = container.querySelector('#ttIn');
  const out = container.querySelector('#ttOut');
  const statusEl = container.querySelector('#ttStatus');
  const run = () => {
    try {
      const result = process(inp.value);
      if (out) out.value = result;
      statusEl.innerHTML = '';
    } catch (e) {
      statusEl.innerHTML = `<div class="msg msg-err">⚠️ ${escapeHtml(e.message)}</div>`;
    }
  };
  if (live) inp.addEventListener('input', run);
  else { const btn = container.querySelector('#ttRun'); if (btn) btn.addEventListener('click', run); }
  if (out) container.querySelector('#ttCopy').addEventListener('click', () => copyText(out.value));
  return { run, inputEl: inp, outputEl: out };
}

/* ── Particles ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 24; i++) {
    const d = document.createElement('div');
    const sz = Math.random() > 0.7 ? 3 : 2;
    Object.assign(d.style, {
      position: 'absolute', width: sz + 'px', height: sz + 'px', borderRadius: '50%',
      background: `hsl(${240 + Math.random() * 60},80%,75%)`,
      top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
      opacity: 0.3 + Math.random() * 0.5,
      animation: `twinkle ${2.5 + Math.random() * 4}s ${Math.random() * 5}s ease-in-out infinite`,
      pointerEvents: 'none',
    });
    container.appendChild(d);
  }
})();

/* ── Init once TOOLS array (defined by category-specific JS) is loaded ── */
function initToolsHub(TOOLS) {
  TOOLS.forEach((t, i) => { if (!t.color) t.color = PALETTE[i % PALETTE.length]; });
  const CATS = [...new Set(TOOLS.map(t => t.cat))];
  const CAT_BOOTSTRAP_ICON = {
    PDF: 'bi-file-earmark-pdf-fill',
    Image: 'bi-images',
    SEO: 'bi-graph-up-arrow',
    Developer: 'bi-code-slash',
    Finance: 'bi-calculator-fill',
    Business: 'bi-briefcase-fill',
  };
  const pageCategory = document.querySelector('.nav-title')?.textContent || '';
  function categoryIcon(category, fallbackCategory = pageCategory) {
    const name = String(category || '').toLowerCase();
    const fallbackName = String(fallbackCategory).toLowerCase();
    const match = Object.keys(CAT_BOOTSTRAP_ICON).find(key => name.includes(key.toLowerCase()) || fallbackName.includes(key.toLowerCase()));
    return CAT_BOOTSTRAP_ICON[match] || 'bi-grid-3x3-gap-fill';
  }
  const CAT_ICON = {};
  TOOLS.forEach(t => { if (!CAT_ICON[t.cat]) CAT_ICON[t.cat] = categoryIcon(t.cat); });

  const heroSection  = document.getElementById('hero');
  const toolsSection = document.getElementById('tools');
  const trustStrip   = document.querySelector('.trust-strip');
  const panelSection = document.getElementById('panelSection');
  const panelInner   = document.getElementById('panelInner');
  const grid         = document.getElementById('toolsGrid');
  const noRes        = document.getElementById('noResults');
  const searchInput  = document.getElementById('searchInput');

  function makeCard(tool) {
    const btn = document.createElement('button');
    btn.className = 'tool-card';
    btn.setAttribute('aria-label', `${tool.label}: ${tool.desc}`);
    btn.style.setProperty('--tc', tool.color);
    const iconClass = categoryIcon(tool.cat);
    btn.innerHTML = `
      <div class="tc-blob1" style="background:radial-gradient(circle,${tool.color}22,transparent 70%)"></div>
      <div class="tc-icon" style="background:linear-gradient(135deg,${tool.color}28,${tool.color}10);border:1px solid ${tool.color}35;box-shadow:0 4px 16px ${tool.color}22"><i class="bi ${iconClass}" aria-hidden="true"></i></div>
      <div class="tc-cat" style="color:${tool.color}">${tool.cat}</div>
      <div class="tc-title">${tool.label}</div>
      <div class="tc-desc">${tool.desc}</div>
      <div class="tc-cta" style="color:${tool.color}">Open tool <span class="tc-arrow" style="background:${tool.color}22;border:1px solid ${tool.color}44">→</span></div>
    `;
    btn.addEventListener('click', () => openTool(tool));
    return btn;
  }

  function renderGrid(list) {
    grid.innerHTML = '';
    if (!list.length) { noRes.hidden = false; return; }
    noRes.hidden = true;
    const isSearch = searchInput.value.trim() !== '';
    if (isSearch) {
      grid.style.display = 'grid';
      list.forEach(t => grid.appendChild(makeCard(t)));
    } else {
      grid.style.display = 'block';
      CATS.forEach(cat => {
        const catTools = list.filter(t => t.cat === cat);
        if (!catTools.length) return;
        const sec = document.createElement('div');
        sec.className = 'cat-section';
        sec.innerHTML = `<div class="cat-header"><i class="cat-icon bi ${CAT_ICON[cat]}" aria-hidden="true"></i><span class="cat-label">${cat}</span><div class="cat-line"></div></div><div class="tools-grid" id="catg-${cat.replace(/\s+/g,'')}"></div>`;
        grid.appendChild(sec);
        const cg = sec.querySelector(`#catg-${cat.replace(/\s+/g,'')}`);
        catTools.forEach(t => cg.appendChild(makeCard(t)));
      });
    }
  }

  searchInput.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    renderGrid(q ? TOOLS.filter(t => t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) : TOOLS);
  });

  function showHome() {
    panelSection.hidden = true;
    heroSection.hidden = false;
    toolsSection.hidden = false;
    trustStrip.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openTool(tool) {
    heroSection.hidden = true;
    toolsSection.hidden = true;
    trustStrip.hidden = true;
    panelSection.hidden = false;
    panelInner.innerHTML = `
      <button class="back-btn" id="backBtn">← Back to all tools</button>
      <div class="tool-header" style="background:linear-gradient(135deg,${tool.color}18,rgba(255,255,255,0.02));border:1px solid ${tool.color}30">
        <div class="tool-header-glow" style="background:radial-gradient(circle,${tool.color}22,transparent 70%)"></div>
        <div class="tool-header-body">
          <div class="tool-header-icon" style="background:${tool.color}22;box-shadow:0 8px 28px ${tool.color}30"><i class="bi ${categoryIcon(tool.cat)}" aria-hidden="true"></i></div>
          <div>
            <span class="tool-header-cat" style="color:${tool.color}">${tool.cat}</span>
            <div class="tool-header-title">${tool.label}</div>
            <div class="tool-header-desc">${tool.desc}</div>
          </div>
        </div>
      </div>
      <div id="toolBody"></div>
    `;
    document.getElementById('backBtn').addEventListener('click', showHome);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const body = document.getElementById('toolBody');
    const ctx = {
      color: tool.color,
      setStatus(msg, type = 'info') {
        let el = body.querySelector('.tool-status');
        if (!el) { el = document.createElement('div'); el.className = 'tool-status'; body.appendChild(el); }
        el.innerHTML = msg ? `<div class="msg msg-${type}">${msg}</div>` : '';
      },
      output(html) {
        let el = body.querySelector('.tool-output');
        if (!el) { el = document.createElement('div'); el.className = 'tool-output'; body.appendChild(el); }
        el.innerHTML = html;
      },
      dl, dlCanvas, copyText, readFile, readFileAsDataURL, escapeHtml, toast,
    };
    try { tool.render(body, ctx); }
    catch (e) { body.innerHTML += `<div class="msg msg-err">⚠️ Failed to load tool: ${escapeHtml(e.message)}</div>`; console.error(e); }
  }

  document.querySelectorAll('.nav-brand').forEach(el => el.addEventListener('click', e => { e.preventDefault(); showHome(); }));

  renderGrid(TOOLS);

  /* Stat: total tool count */
  const countEl = document.getElementById('toolCount');
  if (countEl) countEl.textContent = TOOLS.length + '+';
  const navCountEl = document.querySelector('.nav-pills .pill-purple span');
  if (navCountEl) navCountEl.textContent = TOOLS.length + '+';
}
