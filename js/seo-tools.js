/* ════════════ SEO TOOLS (16) ════════════ */
function runBtnEl(container, label, color, onClick) {
  const btn = document.createElement('button'); btn.className='run-btn';
  btn.style.background = `linear-gradient(135deg,${color},#3B82F6)`; btn.textContent = label;
  btn.addEventListener('click', async () => { btn.disabled=true; const orig=btn.textContent; btn.innerHTML='<span class="spinner"></span>Working…'; try{ await onClick(); } finally { btn.disabled=false; btn.textContent=orig; } });
  container.appendChild(btn); return btn;
}
function outBox(c, html) { let el = c.querySelector('.seo-out'); if (!el) { el = document.createElement('div'); el.className='seo-out out-block'; c.appendChild(el); } el.innerHTML = html; }
function codeOutput(c, code, filename) {
  outBox(c, `<div class="out-head"><span class="out-label">Generated Code</span><div style="display:flex;gap:8px"><button class="out-copy" id="cpCode">📋 Copy</button>${filename?`<button class="out-copy" id="dlCode" style="background:linear-gradient(135deg,#10B981,#3B82F6)">⬇ Download</button>`:''}</div></div><textarea class="ta mono" readonly rows="8">${code.replace(/</g,'&lt;')}</textarea>`);
  document.getElementById('cpCode').addEventListener('click', () => copyText(code));
  if (filename) document.getElementById('dlCode').addEventListener('click', () => dl(code, filename));
}

const TOOLS = [
{ id:'meta-tags', icon:'🏷️', label:'Meta Tag Generator', desc:'Generate title, description & keyword tags', cat:'On-Page', catIcon:'📝',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Page Title</label><input class="inp" id="mt" placeholder="My Awesome Page" maxlength="70"></div>
      <div class="setting-block"><label class="setting-label">Meta Description</label><textarea class="ta" id="md" rows="3" maxlength="160" placeholder="A short, compelling description…"></textarea></div>
      <div class="setting-block"><label class="setting-label">Keywords (comma separated)</label><input class="inp" id="mk" placeholder="seo, tools, free"></div>`;
    const btn = runBtnEl(c, '🏷️ Generate Meta Tags', ctx.color, () => {
      const title = document.getElementById('mt').value, desc = document.getElementById('md').value, kw = document.getElementById('mk').value;
      const code = `<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="keywords" content="${kw}">\n<meta name="robots" content="index, follow">`;
      codeOutput(c, code); ctx.setStatus(`Title: ${title.length}/70 chars · Description: ${desc.length}/160 chars`, title.length>60||desc.length>160?'err':'ok');
    });
  }},

{ id:'og-tags', icon:'📱', label:'Open Graph Generator', desc:'Generate OG tags for social sharing', cat:'On-Page', catIcon:'📝',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">og:title</label><input class="inp" id="ot"></div><div><label class="setting-label">og:type</label><select class="inp" id="oy"><option>website</option><option>article</option><option>product</option></select></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">og:description</label><textarea class="ta" id="od" rows="2"></textarea></div>
      <div class="row2"><div><label class="setting-label">og:url</label><input class="inp" id="ou" placeholder="https://example.com"></div><div><label class="setting-label">og:image</label><input class="inp" id="oi" placeholder="https://example.com/img.png"></div></div>`;
    runBtnEl(c, '📱 Generate OG Tags', ctx.color, () => {
      const code = `<meta property="og:title" content="${document.getElementById('ot').value}">\n<meta property="og:type" content="${document.getElementById('oy').value}">\n<meta property="og:description" content="${document.getElementById('od').value}">\n<meta property="og:url" content="${document.getElementById('ou').value}">\n<meta property="og:image" content="${document.getElementById('oi').value}">`;
      codeOutput(c, code); ctx.setStatus('✅ Open Graph tags generated!', 'ok');
    });
  }},

{ id:'twitter-card', icon:'🐦', label:'Twitter Card Generator', desc:'Generate Twitter Card meta tags', cat:'On-Page', catIcon:'📝',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Card Type</label><select class="inp" id="tct"><option value="summary">summary</option><option value="summary_large_image">summary_large_image</option></select></div>
      <div class="row2"><div><label class="setting-label">Title</label><input class="inp" id="tt"></div><div><label class="setting-label">Site (@handle)</label><input class="inp" id="ts" placeholder="@yoursite"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Description</label><textarea class="ta" id="td" rows="2"></textarea></div>
      <div class="setting-block"><label class="setting-label">Image URL</label><input class="inp" id="ti"></div>`;
    runBtnEl(c, '🐦 Generate Twitter Card', ctx.color, () => {
      const code = `<meta name="twitter:card" content="${document.getElementById('tct').value}">\n<meta name="twitter:site" content="${document.getElementById('ts').value}">\n<meta name="twitter:title" content="${document.getElementById('tt').value}">\n<meta name="twitter:description" content="${document.getElementById('td').value}">\n<meta name="twitter:image" content="${document.getElementById('ti').value}">`;
      codeOutput(c, code); ctx.setStatus('✅ Twitter Card tags generated!', 'ok');
    });
  }},

{ id:'robots-txt', icon:'🤖', label:'Robots.txt Generator', desc:'Create a robots.txt for your site', cat:'Technical', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Sitemap URL</label><input class="inp" id="rsm" placeholder="https://example.com/sitemap.xml"></div>
      <div class="setting-block"><label class="setting-label">Disallowed paths (one per line)</label><textarea class="ta mono" id="rdis" rows="4" placeholder="/admin/\n/private/"></textarea></div>
      <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text2)"><input type="checkbox" id="rall" checked> Allow all crawlers (User-agent: *)</label>`;
    runBtnEl(c, '🤖 Generate robots.txt', ctx.color, () => {
      const paths = document.getElementById('rdis').value.split('\n').filter(Boolean);
      let code = `User-agent: *\n`;
      paths.forEach(p => code += `Disallow: ${p.trim()}\n`);
      if (!paths.length) code += `Disallow:\n`;
      const sm = document.getElementById('rsm').value; if (sm) code += `\nSitemap: ${sm}\n`;
      codeOutput(c, code, 'robots.txt'); ctx.setStatus('✅ robots.txt generated!', 'ok');
    });
  }},

{ id:'sitemap-gen', icon:'🗺️', label:'Sitemap Generator', desc:'Build an XML sitemap from a URL list', cat:'Technical', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">URLs (one per line)</label><textarea class="ta mono" id="smu" rows="8" placeholder="https://example.com/\nhttps://example.com/about\nhttps://example.com/contact"></textarea></div>
      <div class="setting-block"><label class="setting-label">Change Frequency</label><select class="inp" id="smf"><option>daily</option><option selected>weekly</option><option>monthly</option></select></div>`;
    runBtnEl(c, '🗺️ Generate Sitemap', ctx.color, () => {
      const urls = document.getElementById('smu').value.split('\n').map(u=>u.trim()).filter(Boolean);
      const freq = document.getElementById('smf').value; const today = new Date().toISOString().split('T')[0];
      let code = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      urls.forEach(u => code += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n  </url>\n`);
      code += `</urlset>`;
      codeOutput(c, code, 'sitemap.xml'); ctx.setStatus(`✅ Sitemap generated with ${urls.length} URL(s)!`, 'ok');
    });
  }},

{ id:'keyword-density', icon:'🔑', label:'Keyword Density', desc:'Find your most used keywords', cat:'Analyze', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Paste your content</label><textarea class="ta" id="kdt" rows="9" placeholder="Paste your article or page content here…"></textarea></div>`;
    runBtnEl(c, '🔑 Analyze Density', ctx.color, () => {
      const text = document.getElementById('kdt').value.toLowerCase();
      const words = text.match(/[a-z']+/g) || [];
      const stop = new Set(['the','is','at','of','on','and','a','to','in','it','for','with','as','this','that','are','be','or','an','was','were']);
      const freq = {}; words.forEach(w => { if (!stop.has(w) && w.length>2) freq[w]=(freq[w]||0)+1; });
      const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,15);
      const total = words.length;
      outBox(c, `<div class="out-label" style="margin-bottom:10px">Top Keywords (${total} total words)</div><table class="res-table"><tr><th>Keyword</th><th>Count</th><th>Density</th></tr>${sorted.map(([w,n])=>`<tr><td>${w}</td><td>${n}</td><td>${(n/total*100).toFixed(2)}%</td></tr>`).join('')}</table>`);
      ctx.setStatus('✅ Analysis complete!', 'ok');
    });
  }},

{ id:'word-counter', icon:'📝', label:'Word & Char Counter', desc:'Count words, characters & reading time', cat:'Analyze', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Your text</label><textarea class="ta" id="wct" rows="9" placeholder="Start typing or paste text…"></textarea></div>`;
    const update = () => { const t = document.getElementById('wct').value; const words = t.trim()?t.trim().split(/\s+/).length:0; const chars=t.length; const charsNoSpace=t.replace(/\s/g,'').length; const sentences=(t.match(/[.!?]+/g)||[]).length; const readMin = Math.max(1,Math.round(words/200));
      outBox(c, `<div class="kv-grid"><div class="kv-row"><span>Words</span><b>${words}</b></div><div class="kv-row"><span>Characters</span><b>${chars}</b></div><div class="kv-row"><span>Characters (no spaces)</span><b>${charsNoSpace}</b></div><div class="kv-row"><span>Sentences</span><b>${sentences}</b></div><div class="kv-row"><span>Reading time</span><b>~${readMin} min</b></div></div>`); };
    document.getElementById('wct').addEventListener('input', update); update();
  }},

{ id:'serp-preview', icon:'🔎', label:'SERP Snippet Preview', desc:'Preview how your page looks in Google', cat:'On-Page', catIcon:'📝',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Page Title</label><input class="inp" id="spt" maxlength="70" value="Your Page Title Here"></div>
      <div class="setting-block"><label class="setting-label">URL</label><input class="inp" id="spu" value="https://example.com/page"></div>
      <div class="setting-block"><label class="setting-label">Meta Description</label><textarea class="ta" id="spd" rows="2" maxlength="160">Your meta description goes here, summarizing the page content for search engines.</textarea></div>
      <div id="serpPrev" style="margin-top:18px;padding:20px;border-radius:14px;background:#fff;color:#202124;font-family:Arial,sans-serif"></div>`;
    const update = () => { const t=document.getElementById('spt').value, u=document.getElementById('spu').value, d=document.getElementById('spd').value;
      document.getElementById('serpPrev').innerHTML = `<div style="font-size:13px;color:#202124;margin-bottom:2px">${u}</div><div style="font-size:19px;color:#1a0dab;line-height:1.3;margin-bottom:3px">${t}</div><div style="font-size:13.5px;color:#4d5156;line-height:1.5">${d}</div>`; };
    ['spt','spu','spd'].forEach(id => document.getElementById(id).addEventListener('input', update)); update();
  }},

{ id:'slug-generator', icon:'🔗', label:'URL Slug Generator', desc:'Turn any title into a clean URL slug', cat:'On-Page', catIcon:'📝',
  render(c, ctx) { textTool(c, { label:'Page Title', placeholder:'My Awesome Blog Post!', buttonLabel:'Generate Slug', outputLabel:'URL Slug', rows:2,
    process: t => t.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/-+/g,'-'), live:true }); }},

{ id:'schema-generator', icon:'🧩', label:'Schema Markup Generator', desc:'Generate JSON-LD structured data', cat:'Technical', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Schema Type</label><select class="inp" id="sct"><option value="Article">Article</option><option value="Product">Product</option><option value="FAQPage">FAQ Page</option><option value="LocalBusiness">Local Business</option></select></div>
      <div id="schemaFields"></div>`;
    const fieldsEl = document.getElementById('schemaFields');
    function renderFields() { const type = document.getElementById('sct').value;
      if (type==='Article') fieldsEl.innerHTML = `<div class="setting-block"><label class="setting-label">Headline</label><input class="inp" id="f1"></div><div class="setting-block"><label class="setting-label">Author Name</label><input class="inp" id="f2"></div><div class="setting-block"><label class="setting-label">Date Published (YYYY-MM-DD)</label><input class="inp" id="f3"></div>`;
      else if (type==='Product') fieldsEl.innerHTML = `<div class="setting-block"><label class="setting-label">Product Name</label><input class="inp" id="f1"></div><div class="setting-block"><label class="setting-label">Price</label><input class="inp" id="f2"></div><div class="setting-block"><label class="setting-label">Currency</label><input class="inp" id="f3" value="USD"></div>`;
      else if (type==='FAQPage') fieldsEl.innerHTML = `<div class="setting-block"><label class="setting-label">Question</label><input class="inp" id="f1"></div><div class="setting-block"><label class="setting-label">Answer</label><textarea class="ta" id="f2" rows="2"></textarea></div>`;
      else fieldsEl.innerHTML = `<div class="setting-block"><label class="setting-label">Business Name</label><input class="inp" id="f1"></div><div class="setting-block"><label class="setting-label">Address</label><input class="inp" id="f2"></div><div class="setting-block"><label class="setting-label">Phone</label><input class="inp" id="f3"></div>`;
    }
    document.getElementById('sct').addEventListener('change', renderFields); renderFields();
    runBtnEl(c, '🧩 Generate Schema', ctx.color, () => {
      const type = document.getElementById('sct').value; const f1=document.getElementById('f1').value, f2=document.getElementById('f2').value, f3=document.getElementById('f3')?.value;
      let obj = { '@context':'https://schema.org', '@type':type };
      if (type==='Article') Object.assign(obj, { headline:f1, author:{'@type':'Person',name:f2}, datePublished:f3 });
      else if (type==='Product') Object.assign(obj, { name:f1, offers:{'@type':'Offer',price:f2,priceCurrency:f3} });
      else if (type==='FAQPage') Object.assign(obj, { mainEntity:[{'@type':'Question',name:f1,acceptedAnswer:{'@type':'Answer',text:f2}}] });
      else Object.assign(obj, { name:f1, address:f2, telephone:f3 });
      const code = `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
      codeOutput(c, code); ctx.setStatus('✅ Schema markup generated!', 'ok');
    });
  }},

{ id:'readability', icon:'📖', label:'Readability Checker', desc:'Flesch-Kincaid readability score', cat:'Analyze', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Paste your content</label><textarea class="ta" id="rdt" rows="9" placeholder="Paste your text…"></textarea></div>`;
    runBtnEl(c, '📖 Check Readability', ctx.color, () => {
      const text = document.getElementById('rdt').value;
      const words = (text.match(/[A-Za-z']+/g)||[]).length || 1;
      const sentences = (text.match(/[.!?]+/g)||[]).length || 1;
      const syllables = (text.match(/[A-Za-z']+/g)||[]).reduce((sum,w) => sum + Math.max(1,(w.toLowerCase().match(/[aeiouy]+/g)||[]).length), 0);
      const score = 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words);
      let level = score>=90?'Very Easy (5th grade)':score>=70?'Easy (7th grade)':score>=60?'Standard (8-9th grade)':score>=50?'Fairly Difficult (10-12th grade)':score>=30?'Difficult (College)':'Very Difficult (Graduate)';
      outBox(c, `<div class="kv-grid"><div class="kv-row"><span>Flesch Reading Ease</span><b style="color:${ctx.color}">${score.toFixed(1)}</b></div><div class="kv-row"><span>Reading Level</span><b>${level}</b></div><div class="kv-row"><span>Words</span><b>${words}</b></div><div class="kv-row"><span>Sentences</span><b>${sentences}</b></div><div class="kv-row"><span>Avg words/sentence</span><b>${(words/sentences).toFixed(1)}</b></div></div>`);
      ctx.setStatus('✅ Score calculated!', 'ok');
    });
  }},

{ id:'utm-builder', icon:'🔗', label:'UTM Link Builder', desc:'Build campaign tracking URLs', cat:'Technical', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Website URL</label><input class="inp" id="ub" placeholder="https://example.com"></div>
      <div class="row2"><div><label class="setting-label">Source</label><input class="inp" id="us" placeholder="newsletter"></div><div><label class="setting-label">Medium</label><input class="inp" id="um" placeholder="email"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Campaign</label><input class="inp" id="uc" placeholder="spring_sale"></div><div><label class="setting-label">Term (optional)</label><input class="inp" id="ut"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Content (optional)</label><input class="inp" id="ucon"></div>`;
    runBtnEl(c, '🔗 Build URL', ctx.color, () => {
      const base = document.getElementById('ub').value; const params = new URLSearchParams();
      const s=document.getElementById('us').value, m=document.getElementById('um').value, cmp=document.getElementById('uc').value, t=document.getElementById('ut').value, cont=document.getElementById('ucon').value;
      if(s) params.set('utm_source', s); if(m) params.set('utm_medium', m); if(cmp) params.set('utm_campaign', cmp); if(t) params.set('utm_term', t); if(cont) params.set('utm_content', cont);
      const url = base + (base.includes('?')?'&':'?') + params.toString();
      outBox(c, `<div class="out-head"><span class="out-label">Generated URL</span><button class="out-copy" id="cpUtm">📋 Copy</button></div><textarea class="ta mono" readonly rows="3">${url}</textarea>`);
      document.getElementById('cpUtm').addEventListener('click', () => copyText(url));
      ctx.setStatus('✅ UTM URL built!', 'ok');
    });
  }},

{ id:'htaccess-redirect', icon:'↪️', label:'.htaccess Redirect', desc:'Generate 301 redirect rules', cat:'Technical', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Redirects (old → new, one per line)</label><textarea class="ta mono" id="hrr" rows="6" placeholder="/old-page /new-page\n/old2 https://example.com/new2"></textarea></div>`;
    runBtnEl(c, '↪️ Generate .htaccess', ctx.color, () => {
      const lines = document.getElementById('hrr').value.split('\n').filter(Boolean);
      const code = lines.map(l => { const [from,to] = l.trim().split(/\s+/); return `Redirect 301 ${from} ${to}`; }).join('\n');
      codeOutput(c, code, '.htaccess'); ctx.setStatus(`✅ ${lines.length} redirect rule(s) generated!`, 'ok');
    });
  }},

{ id:'canonical-tag', icon:'🎯', label:'Canonical Tag Generator', desc:'Generate a canonical link tag', cat:'On-Page', catIcon:'📝',
  render(c, ctx) { textTool(c, { label:'Canonical URL', placeholder:'https://example.com/page', buttonLabel:'Generate Tag', outputLabel:'HTML Tag', rows:2, live:true,
    process: u => `<link rel="canonical" href="${u.trim()}">` }); }},

{ id:'hreflang-gen', icon:'🌍', label:'Hreflang Generator', desc:'Generate multi-language hreflang tags', cat:'Technical', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Language URLs (lang-code, url — one per line)</label><textarea class="ta mono" id="hfg" rows="6" placeholder="en, https://example.com/\nes, https://example.com/es/\nfr, https://example.com/fr/"></textarea></div>`;
    runBtnEl(c, '🌍 Generate Hreflang Tags', ctx.color, () => {
      const lines = document.getElementById('hfg').value.split('\n').filter(Boolean);
      const code = lines.map(l => { const [lang,url] = l.split(',').map(s=>s.trim()); return `<link rel="alternate" hreflang="${lang}" href="${url}">`; }).join('\n');
      codeOutput(c, code); ctx.setStatus('✅ Hreflang tags generated!', 'ok');
    });
  }},

{ id:'meta-analyzer', icon:'🔬', label:'Meta Tag Analyzer', desc:'Paste HTML to audit your meta tags', cat:'Analyze', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Paste your page's &lt;head&gt; HTML</label><textarea class="ta mono" id="mat" rows="8" placeholder="<title>...</title>\n<meta name=&quot;description&quot; content=&quot;...&quot;>"></textarea></div>`;
    runBtnEl(c, '🔬 Analyze Tags', ctx.color, () => {
      const html = document.getElementById('mat').value;
      const titleMatch = html.match(/<title>(.*?)<\/title>/i); const title = titleMatch?titleMatch[1]:null;
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i); const desc = descMatch?descMatch[1]:null;
      const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
      const hasCanonical = /<link\s+rel=["']canonical["']/i.test(html);
      const h1Count = (html.match(/<h1/gi)||[]).length;
      const issues = [];
      if (!title) issues.push(['err','Missing &lt;title&gt; tag']); else if (title.length>60) issues.push(['err',`Title too long (${title.length} chars, max ~60)`]); else issues.push(['ok',`Title length OK (${title.length} chars)`]);
      if (!desc) issues.push(['err','Missing meta description']); else if (desc.length>160) issues.push(['err',`Description too long (${desc.length} chars)`]); else issues.push(['ok',`Description length OK (${desc.length} chars)`]);
      issues.push([hasViewport?'ok':'err', hasViewport?'Viewport meta tag present':'Missing viewport meta tag']);
      issues.push([hasCanonical?'ok':'info', hasCanonical?'Canonical tag present':'No canonical tag found']);
      issues.push([h1Count===1?'ok':'err', `Found ${h1Count} H1 tag(s) ${h1Count===1?'(ideal)':'(should be exactly 1)'}`]);
      outBox(c, issues.map(([t,m]) => `<div class="msg msg-${t}" style="margin-top:8px">${t==='ok'?'✅':t==='err'?'⚠️':'ℹ️'} ${m}</div>`).join(''));
    });
  }},
];
