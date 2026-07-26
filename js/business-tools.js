/* ════════════ BUSINESS TOOLS (12) ════════════ */
const { PDFDocument, rgb, StandardFonts } = PDFLib;
function runBtnEl(container, label, color, onClick) {
  const btn = document.createElement('button'); btn.className='run-btn';
  btn.style.background = `linear-gradient(135deg,${color},#8B5CF6)`; btn.textContent = label;
  btn.addEventListener('click', async () => { btn.disabled=true; const orig=btn.textContent; btn.innerHTML='<span class="spinner"></span>Working…'; try{ await onClick(); } finally { btn.disabled=false; btn.textContent=orig; } });
  container.appendChild(btn); return btn;
}
function outBox(c, html) { let el = c.querySelector('.biz-out'); if (!el) { el = document.createElement('div'); el.className='biz-out out-block'; c.appendChild(el); } el.innerHTML = html; }

const TOOLS = [
{ id:'invoice-generator', icon:'🧾', label:'Invoice Generator', desc:'Create & download a professional invoice', cat:'Documents', catIcon:'📄',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Your Business Name</label><input class="inp" id="ibn" value="Acme Co."></div><div><label class="setting-label">Invoice #</label><input class="inp" id="iin" value="INV-001"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Client Name</label><input class="inp" id="icn" value="Client Name"></div><div><label class="setting-label">Date</label><input class="inp" id="idt" type="date" value="${new Date().toISOString().slice(0,10)}"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Line Items (description, qty, price — one per line)</label><textarea class="ta mono" id="ili" rows="5">Web Design Services, 1, 1200\nHosting (1 year), 1, 150</textarea></div>`;
    runBtnEl(c, '🧾 Generate Invoice PDF', ctx.color, async () => {
      const biz = document.getElementById('ibn').value, inv = document.getElementById('iin').value, client = document.getElementById('icn').value, date = document.getElementById('idt').value;
      const items = document.getElementById('ili').value.split('\n').filter(Boolean).map(l => { const [d,q,p] = l.split(',').map(s=>s.trim()); return { desc:d, qty:+q, price:+p }; });
      const total = items.reduce((s,i)=>s+i.qty*i.price, 0);
      const doc = await PDFDocument.create(); const page = doc.addPage([595,842]); const font = await doc.embedFont(StandardFonts.Helvetica); const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      let y = 780;
      page.drawText(biz, { x:50, y, size:20, font:bold, color:rgb(0.2,0.2,0.5) }); y-=30;
      page.drawText(`Invoice: ${inv}`, { x:50, y, size:12, font }); y-=18;
      page.drawText(`Date: ${date}`, { x:50, y, size:12, font }); y-=18;
      page.drawText(`Bill To: ${client}`, { x:50, y, size:12, font }); y-=40;
      page.drawText('Description', { x:50, y, size:11, font:bold }); page.drawText('Qty', { x:330, y, size:11, font:bold }); page.drawText('Price', { x:400, y, size:11, font:bold }); page.drawText('Total', { x:480, y, size:11, font:bold }); y-=8;
      page.drawLine({ start:{x:50,y}, end:{x:545,y}, thickness:1, color:rgb(0.7,0.7,0.7) }); y-=20;
      items.forEach(it => { page.drawText(it.desc, { x:50, y, size:11, font }); page.drawText(String(it.qty), { x:330, y, size:11, font }); page.drawText('$'+it.price.toFixed(2), { x:400, y, size:11, font }); page.drawText('$'+(it.qty*it.price).toFixed(2), { x:480, y, size:11, font }); y-=22; });
      y-=10; page.drawLine({ start:{x:350,y}, end:{x:545,y}, thickness:1, color:rgb(0.7,0.7,0.7) }); y-=20;
      page.drawText('Total Due:', { x:400, y, size:13, font:bold }); page.drawText('$'+total.toFixed(2), { x:480, y, size:13, font:bold, color:rgb(0.2,0.5,0.3) });
      ctx.dl(await doc.save(), `${inv}.pdf`); ctx.setStatus('✅ Invoice generated & downloaded!', 'ok');
    });
  }},

{ id:'business-name-gen', icon:'💡', label:'Business Name Generator', desc:'Get creative business name ideas', cat:'Branding', catIcon:'🎨',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Keyword / Industry</label><input class="inp" id="bnk" placeholder="e.g. coffee, fitness, tech"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const prefixes = ['Nova','Prime','Apex','Bright','Swift','Pure','Bold','Elevate','Urban','Pulse','Vivid','True','Next'];
    const suffixes = ['Labs','Co','Hub','Works','Studio','Group','Collective','House','Foundry','Society'];
    runBtnEl(c, '💡 Generate Names', ctx.color, () => {
      const kw = document.getElementById('bnk').value.trim() || 'Brand';
      const cap = kw.charAt(0).toUpperCase()+kw.slice(1);
      const names = new Set();
      while (names.size < 10) { const p = prefixes[Math.floor(Math.random()*prefixes.length)], s = suffixes[Math.floor(Math.random()*suffixes.length)];
        const pattern = Math.random() > 0.5 ? `${p}${cap}` : `${cap} ${s}`; names.add(pattern); }
      out.innerHTML = `<div class="out-block"><div class="out-label" style="margin-bottom:10px">Name Ideas</div>${[...names].map(n=>`<div class="kv-row"><span>${n}</span><button class="btn-sm" data-n="${n}">📋 Copy</button></div>`).join('')}</div>`;
      out.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => copyText(b.dataset.n)));
    });
  }},

{ id:'slogan-gen', icon:'✨', label:'Slogan Generator', desc:'Generate catchy taglines for your brand', cat:'Branding', catIcon:'🎨',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Brand Name</label><input class="inp" id="sgn" placeholder="Acme Co."></div><div class="setting-block"><label class="setting-label">What you offer</label><input class="inp" id="sgw" placeholder="quality coffee"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '✨ Generate Slogans', ctx.color, () => {
      const name = document.getElementById('sgn').value || 'Your Brand', w = document.getElementById('sgw').value || 'great products';
      const templates = [
        `${name} — Where ${w} comes first.`, `Experience ${w}, redefined.`, `${name}: ${w.charAt(0).toUpperCase()+w.slice(1)} made simple.`,
        `Your trusted source for ${w}.`, `${name} — Quality you can feel.`, `Discover better ${w}, every time.`,
        `${name}. Built for you.`, `Elevate your world with ${name}.`,
      ];
      out.innerHTML = `<div class="out-block">${templates.map(t=>`<div class="kv-row"><span>${t}</span><button class="btn-sm" data-t="${t.replace(/"/g,'&quot;')}">📋</button></div>`).join('')}</div>`;
      out.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => copyText(b.dataset.t)));
    });
  }},

{ id:'email-signature', icon:'✉️', label:'Email Signature Generator', desc:'Create a professional HTML signature', cat:'Branding', catIcon:'🎨',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Full Name</label><input class="inp" id="esn" value="Jane Doe"></div><div><label class="setting-label">Job Title</label><input class="inp" id="est" value="Marketing Manager"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Company</label><input class="inp" id="esc" value="Acme Co."></div><div><label class="setting-label">Phone</label><input class="inp" id="esp" value="+1 555 123 4567"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Email</label><input class="inp" id="ese" value="jane@acme.com"></div><div><label class="setting-label">Website</label><input class="inp" id="esw" value="acme.com"></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '✉️ Generate Signature', ctx.color, () => {
      const n=document.getElementById('esn').value, t=document.getElementById('est').value, co=document.getElementById('esc').value, p=document.getElementById('esp').value, e=document.getElementById('ese').value, w=document.getElementById('esw').value;
      const html = `<table style="font-family:Arial,sans-serif;font-size:13px;color:#333"><tr><td style="border-right:3px solid ${ctx.color};padding-right:14px"><b style="font-size:15px">${n}</b><br><span style="color:#666">${t}</span></td><td style="padding-left:14px"><b>${co}</b><br>${p}<br><a href="mailto:${e}" style="color:${ctx.color}">${e}</a><br><a href="https://${w}" style="color:${ctx.color}">${w}</a></td></tr></table>`;
      out.innerHTML = `<div class="out-block"><div class="out-label" style="margin-bottom:10px">Preview</div><div style="padding:18px;border-radius:12px;background:#fff;color:#333">${html}</div><div class="out-head" style="margin-top:14px"><span class="out-label">HTML Code</span><button class="out-copy" id="cpSig">📋 Copy</button></div><textarea class="ta mono" readonly rows="4">${html.replace(/</g,'&lt;')}</textarea></div>`;
      document.getElementById('cpSig').addEventListener('click', () => copyText(html));
    });
  }},

{ id:'meeting-cost', icon:'⏱️', label:'Meeting Cost Calculator', desc:'See what that meeting really costs', cat:'Productivity', catIcon:'⚡',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Attendees</label><input class="inp" id="mca" type="number" value="6"></div><div><label class="setting-label">Avg Hourly Rate</label><input class="inp" id="mcr" type="number" value="50"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Duration (minutes)</label><input class="inp" id="mcd" type="number" value="60"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = () => { const a=+document.getElementById('mca').value, r=+document.getElementById('mcr').value, d=+document.getElementById('mcd').value;
      const cost = a*r*(d/60); out.innerHTML = `<div class="kv-grid" style="margin-top:14px"><div class="kv-row"><span>Total Meeting Cost</span><b style="color:${ctx.color};font-size:18px">$${cost.toFixed(2)}</b></div><div class="kv-row"><span>Cost per Minute</span><b>$${(cost/d).toFixed(2)}</b></div></div>`; };
    ['mca','mcr','mcd'].forEach(id => document.getElementById(id).addEventListener('input', update)); update();
  }},

{ id:'roi-calculator', icon:'📈', label:'ROI Calculator', desc:'Calculate return on investment', cat:'Finance', catIcon:'💰',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Investment Cost</label><input class="inp" id="ric" type="number" value="5000"></div><div><label class="setting-label">Revenue Generated</label><input class="inp" id="rir" type="number" value="8000"></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = () => { const cost=+document.getElementById('ric').value, rev=+document.getElementById('rir').value; const profit=rev-cost; const roi=profit/cost*100;
      out.innerHTML = `<div class="kv-grid" style="margin-top:14px"><div class="kv-row"><span>Net Profit</span><b>$${profit.toFixed(2)}</b></div><div class="kv-row"><span>ROI</span><b style="color:${roi>=0?'#34D399':'#F87171'};font-size:17px">${roi.toFixed(1)}%</b></div></div>`; };
    document.getElementById('ric').addEventListener('input', update); document.getElementById('rir').addEventListener('input', update); update();
  }},

{ id:'profit-loss', icon:'📉', label:'Profit & Loss Calculator', desc:'Quick P&L snapshot for your business', cat:'Finance', catIcon:'💰',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Total Revenue</label><input class="inp" id="plr" type="number" value="50000"></div>
      <div class="setting-block"><label class="setting-label">Cost of Goods Sold</label><input class="inp" id="plc" type="number" value="20000"></div>
      <div class="setting-block"><label class="setting-label">Operating Expenses</label><input class="inp" id="ple" type="number" value="15000"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = () => { const rev=+document.getElementById('plr').value, cogs=+document.getElementById('plc').value, exp=+document.getElementById('ple').value;
      const gross = rev-cogs; const net = gross-exp;
      out.innerHTML = `<div class="kv-grid" style="margin-top:14px"><div class="kv-row"><span>Gross Profit</span><b>$${gross.toLocaleString()}</b></div><div class="kv-row"><span>Gross Margin</span><b>${(gross/rev*100).toFixed(1)}%</b></div><div class="kv-row"><span>Net Profit</span><b style="color:${net>=0?'#34D399':'#F87171'};font-size:16px">$${net.toLocaleString()}</b></div><div class="kv-row"><span>Net Margin</span><b>${(net/rev*100).toFixed(1)}%</b></div></div>`; };
    ['plr','plc','ple'].forEach(id => document.getElementById(id).addEventListener('input', update)); update();
  }},

{ id:'salary-slip', icon:'📑', label:'Salary Slip Generator', desc:'Generate a downloadable salary slip', cat:'Documents', catIcon:'📄',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Employee Name</label><input class="inp" id="ssn" value="John Smith"></div><div><label class="setting-label">Month</label><input class="inp" id="ssm" value="${new Date().toLocaleString('default',{month:'long',year:'numeric'})}"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Basic Salary</label><input class="inp" id="ssb" type="number" value="4000"></div><div><label class="setting-label">Allowances</label><input class="inp" id="ssa" type="number" value="500"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Deductions</label><input class="inp" id="ssd" type="number" value="300"></div><div><label class="setting-label">Company Name</label><input class="inp" id="ssc" value="Acme Co."></div></div>`;
    runBtnEl(c, '📑 Generate Salary Slip PDF', ctx.color, async () => {
      const name=document.getElementById('ssn').value, month=document.getElementById('ssm').value, basic=+document.getElementById('ssb').value, allow=+document.getElementById('ssa').value, ded=+document.getElementById('ssd').value, comp=document.getElementById('ssc').value;
      const net = basic+allow-ded;
      const doc = await PDFDocument.create(); const page = doc.addPage([595,500]); const font = await doc.embedFont(StandardFonts.Helvetica); const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      let y = 440;
      page.drawText(comp, { x:50, y, size:18, font:bold }); y-=26;
      page.drawText(`Salary Slip — ${month}`, { x:50, y, size:13, font }); y-=30;
      page.drawText(`Employee: ${name}`, { x:50, y, size:12, font }); y-=40;
      const rows = [['Basic Salary', basic], ['Allowances', allow], ['Deductions', -ded]];
      rows.forEach(([l,v]) => { page.drawText(l, { x:50, y, size:12, font }); page.drawText('$'+v.toFixed(2), { x:450, y, size:12, font }); y-=22; });
      y-=10; page.drawLine({start:{x:50,y},end:{x:545,y},thickness:1,color:rgb(0.6,0.6,0.6)}); y-=22;
      page.drawText('Net Pay', { x:50, y, size:14, font:bold }); page.drawText('$'+net.toFixed(2), { x:450, y, size:14, font:bold, color:rgb(0.2,0.5,0.3) });
      ctx.dl(await doc.save(), `salary-slip-${name.replace(/\s/g,'-')}.pdf`); ctx.setStatus('✅ Salary slip generated!', 'ok');
    });
  }},

{ id:'business-card', icon:'💳', label:'Business Card Designer', desc:'Design & download a business card', cat:'Branding', catIcon:'🎨',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Name</label><input class="inp" id="bcn" value="Jane Doe"></div><div><label class="setting-label">Title</label><input class="inp" id="bct" value="Founder & CEO"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Company</label><input class="inp" id="bcc" value="Acme Co."></div><div><label class="setting-label">Phone</label><input class="inp" id="bcp" value="+1 555 123 4567"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Email</label><input class="inp" id="bce" value="jane@acme.com"></div><div><label class="setting-label">Accent Color</label><input type="color" id="bccol" value="${ctx.color}"></div></div>`;
    const wrap = document.createElement('div'); wrap.className='canvas-wrap'; wrap.style.marginTop='18px'; c.appendChild(wrap);
    function render() { const cv = document.createElement('canvas'); cv.width=1000; cv.height=600; const x = cv.getContext('2d');
      x.fillStyle = '#0F172A'; x.fillRect(0,0,1000,600);
      const col = document.getElementById('bccol').value;
      x.fillStyle = col; x.fillRect(0,0,18,600);
      x.fillStyle = '#F1F5F9'; x.font = 'bold 52px Arial'; x.fillText(document.getElementById('bcn').value, 70, 220);
      x.fillStyle = col; x.font = '28px Arial'; x.fillText(document.getElementById('bct').value, 70, 270);
      x.fillStyle = '#94A3B8'; x.font = '24px Arial'; x.fillText(document.getElementById('bcc').value, 70, 420);
      x.fillText(document.getElementById('bcp').value, 70, 460); x.fillText(document.getElementById('bce').value, 70, 495);
      wrap.innerHTML=''; wrap.appendChild(cv); window.__bcCv = cv; }
    ['bcn','bct','bcc','bcp','bce','bccol'].forEach(id => document.getElementById(id).addEventListener('input', render)); render();
    runBtnEl(c, '⬇ Download Business Card', ctx.color, async () => { dlCanvas(window.__bcCv, 'business-card.png'); }).disabled = false;
  }},

{ id:'letterhead-gen', icon:'📃', label:'Letterhead Generator', desc:'Create a branded letterhead PDF', cat:'Documents', catIcon:'📄',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Company Name</label><input class="inp" id="lhc" value="Acme Co."></div>
      <div class="row2"><div><label class="setting-label">Address</label><input class="inp" id="lha" value="123 Business Ave, City, ST 12345"></div><div><label class="setting-label">Phone / Email</label><input class="inp" id="lhp" value="555-123-4567 · info@acme.com"></div></div>`;
    runBtnEl(c, '📃 Generate Letterhead PDF', ctx.color, async () => {
      const comp = document.getElementById('lhc').value, addr = document.getElementById('lha').value, contact = document.getElementById('lhp').value;
      const doc = await PDFDocument.create(); const page = doc.addPage([595,842]); const font = await doc.embedFont(StandardFonts.Helvetica); const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      page.drawRectangle({ x:0, y:790, width:595, height:8, color: rgb(0.42,0.39,1) });
      page.drawText(comp, { x:50, y:740, size:24, font:bold });
      page.drawText(addr, { x:50, y:715, size:11, font, color:rgb(0.4,0.4,0.4) });
      page.drawText(contact, { x:50, y:698, size:11, font, color:rgb(0.4,0.4,0.4) });
      page.drawLine({ start:{x:50,y:685}, end:{x:545,y:685}, thickness:1, color:rgb(0.8,0.8,0.8) });
      page.drawText('[ Your letter content goes here ]', { x:50, y:640, size:12, font, color:rgb(0.6,0.6,0.6) });
      ctx.dl(await doc.save(), 'letterhead.pdf'); ctx.setStatus('✅ Letterhead generated!', 'ok');
    });
  }},

{ id:'break-timer', icon:'⏳', label:'Pomodoro Timer', desc:'Focus timer with work/break intervals', cat:'Productivity', catIcon:'⚡',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Work (minutes)</label><input class="inp" id="ptw" type="number" value="25"></div><div><label class="setting-label">Break (minutes)</label><input class="inp" id="ptb" type="number" value="5"></div></div>
      <div style="text-align:center;margin-top:24px"><div id="ptDisplay" style="font-family:'Syne',sans-serif;font-size:56px;font-weight:800;color:${ctx.color}">25:00</div><div id="ptLabel" style="color:var(--text3);font-size:13px;margin-top:6px">Work session</div></div>
      <div style="display:flex;gap:10px;margin-top:20px;justify-content:center"><button class="btn-sm" id="ptStart">▶ Start</button><button class="btn-sm" id="ptReset">↺ Reset</button></div>`;
    let timer = null, seconds = 25*60, onBreak = false;
    function render() { const m = Math.floor(seconds/60), s = seconds%60; document.getElementById('ptDisplay').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
    document.getElementById('ptStart').addEventListener('click', () => { if (timer) { clearInterval(timer); timer=null; document.getElementById('ptStart').textContent='▶ Start'; return; }
      document.getElementById('ptStart').textContent = '⏸ Pause';
      timer = setInterval(() => { seconds--; render(); if (seconds<=0) { onBreak=!onBreak; seconds = (onBreak?+document.getElementById('ptb').value:+document.getElementById('ptw').value)*60; document.getElementById('ptLabel').textContent = onBreak?'Break time! ☕':'Work session 💪'; toast(onBreak?'Break time!':'Back to work!'); } }, 1000); });
    document.getElementById('ptReset').addEventListener('click', () => { clearInterval(timer); timer=null; onBreak=false; seconds=+document.getElementById('ptw').value*60; document.getElementById('ptLabel').textContent='Work session'; document.getElementById('ptStart').textContent='▶ Start'; render(); });
    document.getElementById('ptw').addEventListener('change', () => { if(!timer && !onBreak){ seconds=+document.getElementById('ptw').value*60; render(); } });
  }},

{ id:'qr-vcard', icon:'📇', label:'vCard QR Generator', desc:'Generate a scannable QR business card', cat:'Branding', catIcon:'🎨',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Full Name</label><input class="inp" id="vcn" value="Jane Doe"></div><div><label class="setting-label">Phone</label><input class="inp" id="vcp" value="+15551234567"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Email</label><input class="inp" id="vce" value="jane@acme.com"></div><div><label class="setting-label">Company</label><input class="inp" id="vcc" value="Acme Co."></div></div>`;
    const out = document.createElement('div'); out.style.textAlign='center'; out.style.marginTop='18px'; c.appendChild(out);
    runBtnEl(c, '📇 Generate vCard QR', ctx.color, () => {
      const n=document.getElementById('vcn').value, p=document.getElementById('vcp').value, e=document.getElementById('vce').value, co=document.getElementById('vcc').value;
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${n}\nORG:${co}\nTEL:${p}\nEMAIL:${e}\nEND:VCARD`;
      out.innerHTML = `<div id="vqBox" style="display:inline-block;padding:16px;background:#fff;border-radius:14px"></div><p style="font-size:12px;color:var(--text3);margin-top:10px">Scan with any phone camera to save contact</p>`;
      new QRCode(document.getElementById('vqBox'), { text: vcard, width:220, height:220 });
      ctx.setStatus('✅ vCard QR generated!', 'ok');
    });
  }},
];
