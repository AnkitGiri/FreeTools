/* ════════════ PDF TOOLS (20) ════════════ */
const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;

function pdfDropzone(container, opts = {}) {
  const { multiple = false, label = 'Drop your PDF here', accept = '.pdf,application/pdf', onFiles } = opts;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="dropzone" id="dz">
      <span class="dropzone-icon">📂</span>
      <div class="dropzone-title">${label}</div>
      <div class="dropzone-sub">or click to browse from your device</div>
      <label class="dropzone-btn" style="background:linear-gradient(135deg,var(--p),var(--s))">
        Choose File${multiple ? 's' : ''}
        <input type="file" id="fi" accept="${accept}" ${multiple ? 'multiple' : ''} style="display:none"/>
      </label>
    </div>
    <div class="chip-row" id="chips"></div>
  `;
  container.appendChild(wrap);
  let files = [];
  const dz = wrap.querySelector('#dz'), fi = wrap.querySelector('#fi'), chips = wrap.querySelector('#chips');
  function renderChips() {
    chips.innerHTML = '';
    files.forEach((f, i) => {
      const c = document.createElement('div');
      c.className = 'chip'; c.style.cssText = 'background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);color:#C4B5FD';
      c.innerHTML = `<span>📄</span><span class="chip-name">${f.name}</span><span class="chip-size">${(f.size/1024).toFixed(0)}KB</span><button class="chip-rm">✕</button>`;
      c.querySelector('.chip-rm').addEventListener('click', () => { files.splice(i,1); renderChips(); onFiles(files); });
      chips.appendChild(c);
    });
  }
  function add(newFiles) { files = multiple ? [...files, ...newFiles] : newFiles; renderChips(); onFiles(files); }
  fi.addEventListener('change', e => add(Array.from(e.target.files)));
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drag'); add(Array.from(e.dataTransfer.files)); });
  return { getFiles: () => files };
}

function runBtnEl(container, label, color, onClick) {
  const btn = document.createElement('button');
  btn.className = 'run-btn'; btn.disabled = true;
  btn.style.background = `linear-gradient(135deg,${color},#A18CD1)`;
  btn.textContent = label;
  btn.addEventListener('click', async () => {
    btn.disabled = true; const orig = btn.textContent; btn.innerHTML = '<span class="spinner"></span>Working…';
    try { await onClick(); } finally { btn.disabled = false; btn.textContent = orig; }
  });
  container.appendChild(btn);
  return btn;
}

const TOOLS = [
{ id:'merge', icon:'🔗', label:'Merge PDFs', desc:'Combine multiple PDFs into one document', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { multiple:true, label:'Drop multiple PDFs to merge', onFiles: fs => { btn.disabled = fs.length < 1; renderOrder(); } });
    const orderWrap = document.createElement('div'); c.appendChild(orderWrap);
    function renderOrder() {
      const files = dz.getFiles();
      orderWrap.innerHTML = '';
      if (files.length > 1) {
        orderWrap.innerHTML = `<div class="merge-order" style="border-radius:14px;padding:18px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07)"><div style="font-size:10px;font-weight:800;letter-spacing:1.5px;color:${ctx.color};text-transform:uppercase;margin-bottom:12px">Merge Order (${files.length} files)</div>${files.map((f,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,0.03);margin-bottom:7px;font-size:13px"><span style="color:${ctx.color};font-weight:800">${i+1}</span><span>📄 ${f.name}</span></div>`).join('')}</div>`;
      }
    }
    const btn = runBtnEl(c, '🔗 Merge PDFs', ctx.color, async () => {
      const files = dz.getFiles();
      ctx.setStatus('Merging PDFs…');
      const out = await PDFDocument.create();
      for (const f of files) { const d = await PDFDocument.load(await ctx.readFile(f)); (await out.copyPages(d, d.getPageIndices())).forEach(p => out.addPage(p)); }
      ctx.dl(await out.save(), 'merged.pdf');
      ctx.setStatus('✅ Merged & downloaded!', 'ok');
    });
  }},

{ id:'split', icon:'✂️', label:'Split PDF', desc:'Divide PDF into separate files by page', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className = 'setting-block';
    sb.innerHTML = `<label class="setting-label">Split at page numbers (e.g. 3,6)</label><input class="inp" id="sp" placeholder="3,6 — leave blank to split every page"/>`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '✂️ Split PDF', ctx.color, async () => {
      const file = dz.getFiles()[0]; const at = document.getElementById('sp').value;
      ctx.setStatus('Splitting PDF…');
      const src = await PDFDocument.load(await ctx.readFile(file)); const total = src.getPageCount();
      let b = at.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n)&&n>0&&n<total); b=[0,...b,total];
      for (let i=0;i<b.length-1;i++){ const d=await PDFDocument.create(); (await d.copyPages(src,Array.from({length:b[i+1]-b[i]},(_,j)=>b[i]+j))).forEach(p=>d.addPage(p)); ctx.dl(await d.save(),`split-part-${i+1}.pdf`); await new Promise(r=>setTimeout(r,350)); }
      ctx.setStatus(`✅ Split into ${b.length-1} file(s)!`, 'ok');
    });
  }},

{ id:'rotate', icon:'🔃', label:'Rotate PDF', desc:'Rotate all pages to any angle', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    let angle = '90';
    const sb = document.createElement('div'); sb.className = 'setting-block';
    sb.innerHTML = `<label class="setting-label">Rotation Angle</label><div class="choice-row" id="rch">${['90','180','270','-90'].map((d,i)=>`<button class="ch ${i===0?'active':''}" data-v="${d}">${d}°</button>`).join('')}</div><div style="text-align:center;margin-top:18px;font-size:44px;transition:transform .4s" id="prev">📄</div>`;
    c.appendChild(sb);
    sb.querySelectorAll('.ch').forEach(b => b.addEventListener('click', () => { sb.querySelectorAll('.ch').forEach(x=>x.classList.remove('active')); b.classList.add('active'); angle=b.dataset.v; document.getElementById('prev').style.transform=`rotate(${angle}deg)`; }));
    const btn = runBtnEl(c, '🔃 Rotate PDF', ctx.color, async () => {
      const file = dz.getFiles()[0]; ctx.setStatus('Rotating pages…');
      const d = await PDFDocument.load(await ctx.readFile(file));
      d.getPages().forEach(p => p.setRotation(degrees((p.getRotation().angle + parseInt(angle)) % 360)));
      ctx.dl(await d.save(), `rotated-${file.name}`); ctx.setStatus('✅ Rotated & downloaded!', 'ok');
    });
  }},

{ id:'compress', icon:'🗜️', label:'Compress PDF', desc:'Shrink file size while preserving quality', cat:'Optimize', catIcon:'⚡',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    let level = 'medium';
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Compression Level</label><div class="choice-row">${['low','medium','high'].map(l=>`<button class="ch ${l==='medium'?'active':''}" data-v="${l}">${l==='low'?'🟡 Low':l==='medium'?'🟠 Medium':'🔴 High'}</button>`).join('')}</div>`;
    c.appendChild(sb);
    sb.querySelectorAll('.ch').forEach(b=>b.addEventListener('click',()=>{sb.querySelectorAll('.ch').forEach(x=>x.classList.remove('active'));b.classList.add('active');level=b.dataset.v;}));
    const btn = runBtnEl(c, '🗜️ Compress PDF', ctx.color, async () => {
      const file = dz.getFiles()[0]; ctx.setStatus('Compressing…');
      const d = await PDFDocument.load(await ctx.readFile(file), { updateMetadata:false });
      ctx.dl(await d.save({ useObjectStreams: level !== 'low' }), `compressed-${file.name}`);
      ctx.setStatus('✅ Compressed & downloaded!', 'ok');
    });
  }},

{ id:'pdf-to-jpg', icon:'🔄', label:'PDF to JPG', desc:'Convert each PDF page to a JPG image', cat:'Convert', catIcon:'🔄',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const btn = runBtnEl(c, '🔄 Convert to JPG', ctx.color, async () => {
      const file = dz.getFiles()[0];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf = await pdfjsLib.getDocument({ data: await ctx.readFile(file) }).promise;
      let html = '<div class="out-block"><div class="out-label" style="margin-bottom:14px">Converted Pages</div>';
      for (let i=1;i<=pdf.numPages;i++) {
        ctx.setStatus(`Converting page ${i} of ${pdf.numPages}…`);
        const pg = await pdf.getPage(i); const vp = pg.getViewport({ scale:2 });
        const cv = document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height;
        await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
        const url = cv.toDataURL('image/jpeg', 0.92);
        html += `<div class="img-result"><img src="${url}"/><a class="img-dl" href="${url}" download="page-${i}.jpg">⬇ Download</a></div>`;
      }
      html += '</div>'; ctx.output(html);
      ctx.setStatus(`✅ ${pdf.numPages} page(s) converted!`, 'ok');
    });
  }},

{ id:'jpg-to-pdf', icon:'🖼️', label:'JPG to PDF', desc:'Convert images into a single PDF', cat:'Convert', catIcon:'🔄',
  render(c, ctx) {
    const dz = pdfDropzone(c, { multiple:true, accept:'image/*', label:'Drop images to convert', onFiles: fs => btn.disabled = fs.length < 1 });
    const btn = runBtnEl(c, '🖼️ Convert to PDF', ctx.color, async () => {
      const files = dz.getFiles(); ctx.setStatus('Building PDF…');
      const doc = await PDFDocument.create();
      for (const f of files) {
        const bytes = await ctx.readFile(f);
        const img = f.type.includes('png') ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x:0, y:0, width: img.width, height: img.height });
      }
      ctx.dl(await doc.save(), 'images-to-pdf.pdf'); ctx.setStatus('✅ PDF created & downloaded!', 'ok');
    });
  }},

{ id:'extract-text', icon:'🔍', label:'Extract Text', desc:'Extract selectable text from PDFs', cat:'Convert', catIcon:'🔄',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const btn = runBtnEl(c, '🔍 Extract Text', ctx.color, async () => {
      const file = dz.getFiles()[0];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf = await pdfjsLib.getDocument({ data: await ctx.readFile(file) }).promise;
      let text = '';
      for (let i=1;i<=pdf.numPages;i++) { ctx.setStatus(`Extracting page ${i} of ${pdf.numPages}…`); const content = await (await pdf.getPage(i)).getTextContent(); text += `\n─── Page ${i} ───\n` + content.items.map(it=>it.str).join(' '); }
      text = text.trim() || 'No selectable text found.';
      ctx.output(`<div class="out-block"><div class="out-head"><span class="out-label">Extracted Text</span><button class="out-copy" id="dlTxt">⬇ Download .txt</button></div><textarea class="ta mono" readonly rows="10">${ctx.escapeHtml(text)}</textarea></div>`);
      document.getElementById('dlTxt').addEventListener('click', () => ctx.dl(text, 'extracted-text.txt'));
      ctx.setStatus('✅ Text extracted!', 'ok');
    });
  }},

{ id:'watermark', icon:'💧', label:'Watermark PDF', desc:'Stamp text watermark on all pages', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Watermark Text</label><input class="inp" id="wt" value="CONFIDENTIAL"/>
      <div style="margin-top:14px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><label class="setting-label" style="margin:0">Opacity</label><span id="opv" style="color:${ctx.color};font-weight:800;font-size:13px">50%</span></div><input type="range" id="op" min="10" max="100" value="50"/></div>`;
    c.appendChild(sb);
    document.getElementById('op').addEventListener('input', e => document.getElementById('opv').textContent = e.target.value+'%');
    const btn = runBtnEl(c, '💧 Add Watermark', ctx.color, async () => {
      const file = dz.getFiles()[0]; const text = document.getElementById('wt').value || 'WATERMARK'; const opacity = +document.getElementById('op').value;
      ctx.setStatus('Adding watermark…');
      const d = await PDFDocument.load(await ctx.readFile(file)); const font = await d.embedFont(StandardFonts.HelveticaBold);
      d.getPages().forEach(p => { const { width, height } = p.getSize(); const sz = Math.min(width,height)*0.1; p.drawText(text, { x:width/2-font.widthOfTextAtSize(text,sz)/2, y:height/2-sz/2, size:sz, font, color:rgb(0.6,0.6,0.6), opacity:opacity/100, rotate:degrees(-30) }); });
      ctx.dl(await d.save(), `watermarked-${file.name}`); ctx.setStatus('✅ Watermark added & downloaded!', 'ok');
    });
  }},

{ id:'pageno', icon:'📄', label:'Page Numbers', desc:'Add page numbers to your PDF', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    let pos = 'bottom-center';
    const sb = document.createElement('div'); sb.className='setting-block';
    const positions = ['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right'];
    sb.innerHTML = `<label class="setting-label">Position</label><div class="row3">${positions.map(p=>`<button class="ch ${p==='bottom-center'?'active':''}" data-v="${p}" style="text-transform:capitalize;font-size:11px">${p.replace('-',' ')}</button>`).join('')}</div>`;
    c.appendChild(sb);
    sb.querySelectorAll('.ch').forEach(b=>b.addEventListener('click',()=>{sb.querySelectorAll('.ch').forEach(x=>x.classList.remove('active'));b.classList.add('active');pos=b.dataset.v;}));
    const btn = runBtnEl(c, '📄 Add Page Numbers', ctx.color, async () => {
      const file = dz.getFiles()[0]; ctx.setStatus('Adding page numbers…');
      const d = await PDFDocument.load(await ctx.readFile(file)); const font = await d.embedFont(StandardFonts.Helvetica);
      d.getPages().forEach((p,i) => { const { width, height } = p.getSize(); const sz=11, txt=`${i+1}`, tw=font.widthOfTextAtSize(txt,sz), mg=24;
        const x = pos.includes('left')?mg:pos.includes('right')?width-tw-mg:(width-tw)/2; const y = pos.includes('top')?height-mg-sz:mg;
        p.drawText(txt,{x,y,size:sz,font,color:rgb(0.4,0.4,0.4)}); });
      ctx.dl(await d.save(), `numbered-${file.name}`); ctx.setStatus('✅ Page numbers added!', 'ok');
    });
  }},

{ id:'sign', icon:'🖊️', label:'Sign PDF', desc:'Draw & embed your signature', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: () => {} });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<span class="setting-label">Draw your signature (placed bottom-right of page 1)</span>
      <canvas id="sigC" style="border:1.5px solid rgba(255,255,255,0.1);border-radius:14px;width:100%;height:138px;cursor:crosshair;background:rgba(255,255,255,0.03);touch-action:none;display:block" width="520" height="138"></canvas>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn-sm" id="sigClear" style="flex:1">🗑 Clear</button><button class="run-btn" id="sigUse" style="flex:2;margin-top:0;background:linear-gradient(135deg,${ctx.color},#A18CD1)">✅ Use This Signature</button></div>`;
    c.appendChild(sb);
    const cv = document.getElementById('sigC'); const sctx = cv.getContext('2d'); let drawing=false, last=null;
    const pos = e => { const r=cv.getBoundingClientRect(); const s=e.touches?e.touches[0]:e; return [s.clientX-r.left, s.clientY-r.top]; };
    cv.addEventListener('mousedown', e=>{drawing=true;last=pos(e);});
    cv.addEventListener('mousemove', e=>{if(!drawing)return;const [x,y]=pos(e);sctx.strokeStyle='#F1F5F9';sctx.lineWidth=2.5;sctx.lineCap='round';sctx.beginPath();sctx.moveTo(...last);sctx.lineTo(x,y);sctx.stroke();last=[x,y];});
    cv.addEventListener('mouseup', ()=>drawing=false); cv.addEventListener('mouseleave', ()=>drawing=false);
    cv.addEventListener('touchstart', e=>{e.preventDefault();drawing=true;last=pos(e);});
    cv.addEventListener('touchmove', e=>{if(!drawing)return;e.preventDefault();const [x,y]=pos(e);sctx.strokeStyle='#F1F5F9';sctx.lineWidth=2.5;sctx.lineCap='round';sctx.beginPath();sctx.moveTo(...last);sctx.lineTo(x,y);sctx.stroke();last=[x,y];});
    cv.addEventListener('touchend', ()=>drawing=false);
    document.getElementById('sigClear').addEventListener('click', ()=>sctx.clearRect(0,0,cv.width,cv.height));
    document.getElementById('sigUse').addEventListener('click', async () => {
      const file = dz.getFiles()[0]; if (!file) { ctx.setStatus('⚠️ Upload a PDF first.', 'err'); return; }
      ctx.setStatus('Embedding signature…');
      const d = await PDFDocument.load(await ctx.readFile(file));
      const dataUrl = cv.toDataURL('image/png');
      const img = await d.embedPng(Uint8Array.from(atob(dataUrl.split(',')[1]), ch=>ch.charCodeAt(0)));
      const pg = d.getPage(0); const { width, height } = pg.getSize();
      pg.drawImage(img, { x:width-230, y:30, width:190, height:65 });
      ctx.dl(await d.save(), `signed-${file.name}`); ctx.setStatus('✅ Signed & downloaded!', 'ok');
    });
  }},

{ id:'annotate', icon:'✍️', label:'Annotate PDF', desc:'Add text annotations to any page', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Annotation Text (added to page 1)</label><input class="inp" id="at" placeholder="Type your annotation…"/>
      <div style="display:flex;align-items:center;gap:14px;margin-top:14px"><label class="setting-label" style="margin:0">Color</label><input type="color" id="ac" value="#FFD700"/></div>`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '✍️ Add Annotation', ctx.color, async () => {
      const file = dz.getFiles()[0]; const txt = document.getElementById('at').value || 'Annotation'; const col = document.getElementById('ac').value;
      ctx.setStatus('Adding annotation…');
      const d = await PDFDocument.load(await ctx.readFile(file)); const font = await d.embedFont(StandardFonts.Helvetica);
      const pg = d.getPage(0); const { height } = pg.getSize(); const [r,g,b] = col.match(/\w\w/g).map(x=>parseInt(x,16)/255);
      pg.drawText(txt, { x:50, y:height-60, size:14, font, color:rgb(r,g,b) });
      ctx.dl(await d.save(), `annotated-${file.name}`); ctx.setStatus('✅ Annotation added & downloaded!', 'ok');
    });
  }},

{ id:'delete-pages', icon:'🗑️', label:'Delete Pages', desc:'Remove specific pages from a PDF', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Pages to delete (e.g. 2,4,5)</label><input class="inp" id="dp" placeholder="2,4,5"/>`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '🗑️ Delete Pages', ctx.color, async () => {
      const file = dz.getFiles()[0]; const toDel = document.getElementById('dp').value.split(',').map(s=>parseInt(s.trim())-1).filter(n=>!isNaN(n));
      ctx.setStatus('Removing pages…');
      const d = await PDFDocument.load(await ctx.readFile(file));
      toDel.sort((a,b)=>b-a).forEach(i => { if (i>=0 && i<d.getPageCount()) d.removePage(i); });
      ctx.dl(await d.save(), `edited-${file.name}`); ctx.setStatus(`✅ Removed ${toDel.length} page(s) & downloaded!`, 'ok');
    });
  }},

{ id:'extract-pages', icon:'📑', label:'Extract Pages', desc:'Pull a page range into a new PDF', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Page range to extract (e.g. 2-5)</label><input class="inp" id="ep" placeholder="2-5"/>`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '📑 Extract Pages', ctx.color, async () => {
      const file = dz.getFiles()[0]; const [a,b] = document.getElementById('ep').value.split('-').map(s=>parseInt(s.trim()));
      ctx.setStatus('Extracting pages…');
      const src = await PDFDocument.load(await ctx.readFile(file)); const total = src.getPageCount();
      const start = Math.max(1, a||1)-1, end = Math.min(total, b||a||total)-1;
      const idxs = Array.from({length:end-start+1}, (_,i)=>start+i);
      const d = await PDFDocument.create(); (await d.copyPages(src, idxs)).forEach(p=>d.addPage(p));
      ctx.dl(await d.save(), `pages-${a}-${b||a}.pdf`); ctx.setStatus('✅ Pages extracted & downloaded!', 'ok');
    });
  }},

{ id:'pdf-info', icon:'ℹ️', label:'PDF Info Viewer', desc:'View page count, size & metadata', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const btn = runBtnEl(c, 'ℹ️ View Info', ctx.color, async () => {
      const file = dz.getFiles()[0]; ctx.setStatus('Reading metadata…');
      const d = await PDFDocument.load(await ctx.readFile(file));
      const rows = [
        ['File name', file.name], ['File size', (file.size/1024).toFixed(1)+' KB'],
        ['Page count', d.getPageCount()], ['Title', d.getTitle()||'—'],
        ['Author', d.getAuthor()||'—'], ['Subject', d.getSubject()||'—'],
        ['Creator', d.getCreator()||'—'], ['Producer', d.getProducer()||'—'],
        ['Created', d.getCreationDate()?.toLocaleString()||'—'],
        ['Modified', d.getModificationDate()?.toLocaleString()||'—'],
      ];
      ctx.output(`<div class="out-block"><div class="kv-grid">${rows.map(([k,v])=>`<div class="kv-row"><span>${k}</span><b>${ctx.escapeHtml(String(v))}</b></div>`).join('')}</div></div>`);
      ctx.setStatus('✅ Metadata loaded!', 'ok');
    });
  }},

{ id:'reorder-pages', icon:'🔀', label:'Reorder Pages', desc:'Rearrange pages into a new order', cat:'Organize', catIcon:'📁',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">New page order (e.g. 3,1,2,4)</label><input class="inp" id="ro" placeholder="3,1,2,4"/><div class="hint-box hint-warn" style="margin-top:8px;padding:9px 13px;border-radius:9px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);color:#D97706;font-size:12px">💡 List every page number once, in your desired order.</div>`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '🔀 Reorder Pages', ctx.color, async () => {
      const file = dz.getFiles()[0]; const order = document.getElementById('ro').value.split(',').map(s=>parseInt(s.trim())-1);
      ctx.setStatus('Reordering pages…');
      const src = await PDFDocument.load(await ctx.readFile(file));
      const valid = order.filter(i => i>=0 && i<src.getPageCount());
      const d = await PDFDocument.create(); (await d.copyPages(src, valid)).forEach(p=>d.addPage(p));
      ctx.dl(await d.save(), `reordered-${file.name}`); ctx.setStatus('✅ Reordered & downloaded!', 'ok');
    });
  }},

{ id:'crop-pdf', icon:'📐', label:'Crop PDF', desc:'Trim margins from every page', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => btn.disabled = fs.length < 1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Margin to trim (points, all sides)</label><input class="inp" id="cm" type="number" value="20" min="0"/>`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '📐 Crop PDF', ctx.color, async () => {
      const file = dz.getFiles()[0]; const m = +document.getElementById('cm').value || 0;
      ctx.setStatus('Cropping pages…');
      const d = await PDFDocument.load(await ctx.readFile(file));
      d.getPages().forEach(p => { const { width, height } = p.getSize(); p.setCropBox(m, m, width-2*m, height-2*m); });
      ctx.dl(await d.save(), `cropped-${file.name}`); ctx.setStatus('✅ Cropped & downloaded!', 'ok');
    });
  }},

{ id:'add-image', icon:'🖼️', label:'Add Image to PDF', desc:'Stamp an image onto a page', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: fs => updateBtn() });
    const lbl = document.createElement('div'); lbl.className='setting-label'; lbl.style.marginTop='18px'; lbl.textContent='Upload an image to stamp onto page 1';
    c.appendChild(lbl);
    const dz2 = pdfDropzone(c, { accept:'image/*', label:'Drop an image', onFiles: fs => updateBtn() });
    const btn = runBtnEl(c, '🖼️ Add Image', ctx.color, async () => {
      const pdfFile = dz.getFiles()[0], imgFile = dz2.getFiles()[0];
      ctx.setStatus('Adding image…');
      const d = await PDFDocument.load(await ctx.readFile(pdfFile));
      const bytes = await ctx.readFile(imgFile);
      const img = imgFile.type.includes('png') ? await d.embedPng(bytes) : await d.embedJpg(bytes);
      const pg = d.getPage(0); const { width, height } = pg.getSize();
      const scale = Math.min(width*0.4/img.width, height*0.4/img.height);
      pg.drawImage(img, { x:30, y:height-30-img.height*scale, width: img.width*scale, height: img.height*scale });
      ctx.dl(await d.save(), `image-added-${pdfFile.name}`); ctx.setStatus('✅ Image added & downloaded!', 'ok');
    });
    function updateBtn(){ btn.disabled = !(dz.getFiles().length && dz2.getFiles().length); }
  }},

{ id:'compare-pdf', icon:'🆚', label:'Compare PDFs', desc:'Spot text differences between two PDFs', cat:'Convert', catIcon:'🔄',
  render(c, ctx) {
    const l1 = document.createElement('div'); l1.className='setting-label'; l1.textContent='First PDF'; c.appendChild(l1);
    const dz1 = pdfDropzone(c, { onFiles: () => updateBtn() });
    const l2 = document.createElement('div'); l2.className='setting-label'; l2.style.marginTop='18px'; l2.textContent='Second PDF'; c.appendChild(l2);
    const dz2 = pdfDropzone(c, { onFiles: () => updateBtn() });
    const btn = runBtnEl(c, '🆚 Compare PDFs', ctx.color, async () => {
      ctx.setStatus('Extracting text from both files…');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      async function extract(file) { const pdf = await pdfjsLib.getDocument({ data: await ctx.readFile(file) }).promise; let t=''; for(let i=1;i<=pdf.numPages;i++){ t += (await (await pdf.getPage(i)).getTextContent()).items.map(it=>it.str).join(' ')+'\n'; } return t; }
      const t1 = (await extract(dz1.getFiles()[0])).split('\n').filter(Boolean);
      const t2 = (await extract(dz2.getFiles()[0])).split('\n').filter(Boolean);
      const max = Math.max(t1.length, t2.length); let diffCount = 0; let rows = '';
      for (let i=0;i<max;i++) { const a=t1[i]||'', b=t2[i]||''; const same = a===b; if(!same) diffCount++;
        rows += `<div class="kv-row" style="${same?'':'border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.06)'}"><span style="opacity:.7">Line ${i+1}</span><span style="font-size:12px">${same?'✅ Match':'⚠️ Differs'}</span></div>`; }
      ctx.output(`<div class="out-block"><div class="out-label" style="margin-bottom:10px">${diffCount} difference(s) found out of ${max} lines</div>${rows}</div>`);
      ctx.setStatus('✅ Comparison complete!', 'ok');
    });
    function updateBtn(){ btn.disabled = !(dz1.getFiles().length && dz2.getFiles().length); }
  }},

{ id:'protect', icon:'🔒', label:'Protect PDF', desc:'Password-protect your document', cat:'Security', catIcon:'🛡️',
  render(c, ctx) {
    const dz = pdfDropzone(c, { onFiles: () => {} });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Set Password</label><input class="inp" type="password" placeholder="Enter a strong password"/>`;
    c.appendChild(sb);
    runBtnEl(c, '🔒 Protect PDF', ctx.color, async () => {
      ctx.setStatus('⚠️ True PDF encryption requires a server-side library and isn\'t possible purely client-side. Try <a href="https://www.ilovepdf.com/protect_pdf" target="_blank" rel="noopener">ilovepdf.com</a> or <a href="https://smallpdf.com/protect-pdf" target="_blank" rel="noopener">smallpdf.com</a>.', 'err');
    });
  }},

{ id:'unlock', icon:'🔓', label:'Unlock PDF', desc:'Remove PDF password & restrictions', cat:'Security', catIcon:'🛡️',
  render(c, ctx) {
    pdfDropzone(c, { onFiles: () => {} });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Current Password</label><input class="inp" type="password" placeholder="Enter PDF password"/>`;
    c.appendChild(sb);
    runBtnEl(c, '🔓 Unlock PDF', ctx.color, async () => {
      ctx.setStatus('⚠️ Removing encryption requires a server-side library. Try <a href="https://www.ilovepdf.com/unlock_pdf" target="_blank" rel="noopener">ilovepdf.com</a> or <a href="https://smallpdf.com/unlock-pdf" target="_blank" rel="noopener">smallpdf.com</a>.', 'err');
    });
  }},
];
