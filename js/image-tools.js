/* ════════════ IMAGE TOOLS (16) ════════════ */

function imgDropzone(container, opts = {}) {
  const { multiple=false, label='Drop your image here', onFiles } = opts;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="dropzone" id="dz">
      <span class="dropzone-icon">🖼️</span>
      <div class="dropzone-title">${label}</div>
      <div class="dropzone-sub">JPG, PNG, WebP supported</div>
      <label class="dropzone-btn" style="background:linear-gradient(135deg,var(--p),var(--s))">Choose Image${multiple?'s':''}
        <input type="file" id="fi" accept="image/*" ${multiple?'multiple':''} style="display:none"/>
      </label>
    </div>
    <div class="chip-row" id="chips"></div>`;
  container.appendChild(wrap);
  let files = [];
  const dz = wrap.querySelector('#dz'), fi = wrap.querySelector('#fi'), chips = wrap.querySelector('#chips');
  function renderChips(){ chips.innerHTML=''; files.forEach((f,i)=>{ const ch=document.createElement('div'); ch.className='chip'; ch.style.cssText='background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);color:#FDBA74'; ch.innerHTML=`<span>🖼️</span><span class="chip-name">${f.name}</span><span class="chip-size">${(f.size/1024).toFixed(0)}KB</span><button class="chip-rm">✕</button>`; ch.querySelector('.chip-rm').addEventListener('click',()=>{files.splice(i,1);renderChips();onFiles(files);}); chips.appendChild(ch); }); }
  function add(nf){ files = multiple ? [...files,...nf] : nf; renderChips(); onFiles(files); }
  fi.addEventListener('change', e=>add(Array.from(e.target.files)));
  dz.addEventListener('dragover', e=>{e.preventDefault();dz.classList.add('drag');});
  dz.addEventListener('dragleave', ()=>dz.classList.remove('drag'));
  dz.addEventListener('drop', e=>{e.preventDefault();dz.classList.remove('drag');add(Array.from(e.dataTransfer.files));});
  return { getFiles: () => files };
}
function loadImg(file) { return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = URL.createObjectURL(file); }); }
function runBtnEl(container, label, color, onClick) {
  const btn = document.createElement('button'); btn.className='run-btn'; btn.disabled=true;
  btn.style.background = `linear-gradient(135deg,${color},#A18CD1)`; btn.textContent = label;
  btn.addEventListener('click', async () => { btn.disabled=true; const orig=btn.textContent; btn.innerHTML='<span class="spinner"></span>Working…'; try{ await onClick(); } finally { btn.disabled=false; btn.textContent=orig; } });
  container.appendChild(btn); return btn;
}

const TOOLS = [
{ id:'resize', icon:'📏', label:'Image Resizer', desc:'Resize images to exact dimensions', cat:'Transform', catIcon:'🔧',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: fs => btn.disabled = fs.length<1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<div class="row2"><div><label class="setting-label">Width (px)</label><input class="inp" id="rw" type="number" value="800"></div><div><label class="setting-label">Height (px)</label><input class="inp" id="rh" type="number" value="600"></div></div>
      <label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:13px;color:var(--text2)"><input type="checkbox" id="ratio" checked> Keep aspect ratio</label>`;
    c.appendChild(sb);
    let origRatio = 1;
    dz.getFiles; const origOnFiles = async fs => { if(fs[0]){ const img = await loadImg(fs[0]); origRatio = img.width/img.height; document.getElementById('rw').value = img.width; document.getElementById('rh').value = img.height; } };
    const btn = runBtnEl(c, '📏 Resize Image', ctx.color, async () => {
      const file = dz.getFiles()[0]; const img = await loadImg(file);
      let w = +document.getElementById('rw').value, h = +document.getElementById('rh').value;
      if (document.getElementById('ratio').checked) h = Math.round(w / origRatio);
      const cv = document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      ctx.output(`<div class="canvas-wrap" style="margin-top:16px"><canvas id="resCv" width="${w}" height="${h}"></canvas></div><button class="run-btn" id="dlRes" style="background:linear-gradient(135deg,${ctx.color},#A18CD1);margin-top:14px">⬇ Download Resized Image</button>`);
      document.getElementById('resCv').getContext('2d').drawImage(img,0,0,w,h);
      document.getElementById('dlRes').addEventListener('click', () => ctx.dlCanvas(document.getElementById('resCv'), `resized-${w}x${h}.png`));
      ctx.setStatus(`✅ Resized to ${w}×${h}!`, 'ok');
    });
    const dzWrap = dz; const fi = c.querySelector('#fi'); if (fi) fi.addEventListener('change', e => origOnFiles(Array.from(e.target.files)));
  }},

{ id:'compress', icon:'🗜️', label:'Image Compressor', desc:'Reduce file size with a quality slider', cat:'Optimize', catIcon:'⚡',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: fs => btn.disabled = fs.length<1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><label class="setting-label" style="margin:0">Quality</label><span id="qv" style="color:${ctx.color};font-weight:800">80%</span></div><input type="range" id="q" min="10" max="100" value="80">`;
    c.appendChild(sb);
    document.getElementById('q').addEventListener('input', e => document.getElementById('qv').textContent = e.target.value+'%');
    const btn = runBtnEl(c, '🗜️ Compress Image', ctx.color, async () => {
      const file = dz.getFiles()[0]; const img = await loadImg(file); const q = +document.getElementById('q').value/100;
      const cv = document.createElement('canvas'); cv.width=img.width; cv.height=img.height; cv.getContext('2d').drawImage(img,0,0);
      cv.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        ctx.output(`<div class="kv-grid" style="margin-top:14px"><div class="kv-row"><span>Original size</span><b>${(file.size/1024).toFixed(1)} KB</b></div><div class="kv-row"><span>Compressed size</span><b>${(blob.size/1024).toFixed(1)} KB</b></div><div class="kv-row"><span>Reduction</span><b style="color:#34D399">${(100-blob.size/file.size*100).toFixed(0)}%</b></div></div><a class="run-btn" href="${url}" download="compressed.jpg" style="display:block;text-align:center;text-decoration:none;background:linear-gradient(135deg,${ctx.color},#A18CD1);margin-top:14px">⬇ Download Compressed Image</a>`);
        ctx.setStatus('✅ Compressed!', 'ok');
      }, 'image/jpeg', q);
    });
  }},

{ id:'crop', icon:'✂️', label:'Image Cropper', desc:'Crop to a custom rectangle', cat:'Transform', catIcon:'🔧',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(fs[0]){ await showPreview(fs[0]); btn.disabled=false; } else btn.disabled=true; } });
    const prevWrap = document.createElement('div'); prevWrap.className='canvas-wrap'; prevWrap.style.marginTop='16px'; c.appendChild(prevWrap);
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<div class="row2"><div><label class="setting-label">X</label><input class="inp" id="cx" type="number" value="0"></div><div><label class="setting-label">Y</label><input class="inp" id="cy" type="number" value="0"></div></div>
      <div class="row2" style="margin-top:12px"><div><label class="setting-label">Width</label><input class="inp" id="cw" type="number" value="200"></div><div><label class="setting-label">Height</label><input class="inp" id="ch2" type="number" value="200"></div></div>`;
    c.appendChild(sb);
    let curImg = null;
    async function showPreview(file) { curImg = await loadImg(file); document.getElementById('cw').value = Math.min(200,curImg.width); document.getElementById('ch2').value = Math.min(200,curImg.height);
      prevWrap.innerHTML = `<canvas id="cropPrev"></canvas>`; const cv = document.getElementById('cropPrev'); cv.width=curImg.width; cv.height=curImg.height; cv.getContext('2d').drawImage(curImg,0,0); }
    const btn = runBtnEl(c, '✂️ Crop Image', ctx.color, async () => {
      const x=+document.getElementById('cx').value, y=+document.getElementById('cy').value, w=+document.getElementById('cw').value, h=+document.getElementById('ch2').value;
      const cv = document.createElement('canvas'); cv.width=w; cv.height=h; cv.getContext('2d').drawImage(curImg, x, y, w, h, 0, 0, w, h);
      ctx.output(`<div class="canvas-wrap" style="margin-top:16px"><canvas id="croppedOut"></canvas></div><button class="run-btn" id="dlCrop" style="background:linear-gradient(135deg,${ctx.color},#A18CD1);margin-top:14px">⬇ Download Cropped Image</button>`);
      const outCv = document.getElementById('croppedOut'); outCv.width=w; outCv.height=h; outCv.getContext('2d').drawImage(cv,0,0);
      document.getElementById('dlCrop').addEventListener('click', () => ctx.dlCanvas(outCv, 'cropped.png'));
      ctx.setStatus('✅ Cropped!', 'ok');
    });
  }},

{ id:'convert', icon:'🔄', label:'Format Converter', desc:'Convert between PNG, JPG & WebP', cat:'Convert', catIcon:'🔁',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: fs => btn.disabled = fs.length<1 });
    let fmt = 'png';
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Convert To</label><div class="choice-row">${['png','jpeg','webp'].map((f,i)=>`<button class="ch ${i===0?'active':''}" data-v="${f}">${f.toUpperCase()}</button>`).join('')}</div>`;
    c.appendChild(sb);
    sb.querySelectorAll('.ch').forEach(b=>b.addEventListener('click',()=>{sb.querySelectorAll('.ch').forEach(x=>x.classList.remove('active'));b.classList.add('active');fmt=b.dataset.v;}));
    const btn = runBtnEl(c, '🔄 Convert Format', ctx.color, async () => {
      const file = dz.getFiles()[0]; const img = await loadImg(file);
      const cv = document.createElement('canvas'); cv.width=img.width; cv.height=img.height; cv.getContext('2d').drawImage(img,0,0);
      cv.toBlob(blob => { const url = URL.createObjectURL(blob); ctx.output(`<a class="run-btn" href="${url}" download="converted.${fmt==='jpeg'?'jpg':fmt}" style="display:block;text-align:center;text-decoration:none;background:linear-gradient(135deg,${ctx.color},#A18CD1);margin-top:14px">⬇ Download .${fmt==='jpeg'?'jpg':fmt}</a>`); ctx.setStatus(`✅ Converted to ${fmt.toUpperCase()}!`, 'ok'); }, `image/${fmt}`, 0.92);
    });
  }},

{ id:'to-base64', icon:'🔢', label:'Image to Base64', desc:'Convert an image to a Base64 string', cat:'Convert', catIcon:'🔁',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: fs => btn.disabled = fs.length<1 });
    const btn = runBtnEl(c, '🔢 Convert to Base64', ctx.color, async () => {
      const file = dz.getFiles()[0]; const dataUrl = await ctx.readFileAsDataURL(file);
      ctx.output(`<div class="out-block"><div class="out-head"><span class="out-label">Base64 String</span><button class="out-copy" id="cpB64">📋 Copy</button></div><textarea class="ta mono" readonly rows="8">${dataUrl}</textarea></div>`);
      document.getElementById('cpB64').addEventListener('click', () => ctx.copyText(dataUrl));
      ctx.setStatus('✅ Converted!', 'ok');
    });
  }},

{ id:'from-base64', icon:'📥', label:'Base64 to Image', desc:'Paste a Base64 string to render an image', cat:'Convert', catIcon:'🔁',
  render(c, ctx) {
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Paste Base64 / Data URL</label><textarea class="ta mono" id="b64in" rows="6" placeholder="data:image/png;base64,..."></textarea>`;
    c.appendChild(sb);
    runBtnEl(c, '📥 Render Image', ctx.color, async () => {
      let val = document.getElementById('b64in').value.trim();
      if (!val.startsWith('data:')) val = 'data:image/png;base64,' + val;
      ctx.output(`<div class="canvas-wrap" style="margin-top:14px;padding:12px"><img src="${val}" style="max-width:100%;display:block;margin:0 auto"/></div><a class="run-btn" href="${val}" download="image.png" style="display:block;text-align:center;text-decoration:none;background:linear-gradient(135deg,${ctx.color},#A18CD1);margin-top:14px">⬇ Download Image</a>`);
      ctx.setStatus('✅ Rendered!', 'ok');
    });
  }},

{ id:'color-picker', icon:'🎨', label:'Image Color Picker', desc:'Click anywhere to pick a pixel color', cat:'Analyze', catIcon:'🔍',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(fs[0]) await show(fs[0]); } });
    const wrap = document.createElement('div'); wrap.className='canvas-wrap'; wrap.style.marginTop='16px'; c.appendChild(wrap);
    const result = document.createElement('div'); result.style.marginTop='14px'; c.appendChild(result);
    async function show(file) { const img = await loadImg(file); wrap.innerHTML = '<canvas id="cpCv" style="cursor:crosshair"></canvas>'; const cv=document.getElementById('cpCv'); cv.width=img.width; cv.height=img.height; const cctx=cv.getContext('2d'); cctx.drawImage(img,0,0);
      cv.addEventListener('click', e => { const r=cv.getBoundingClientRect(); const x=Math.round((e.clientX-r.left)*(cv.width/r.width)); const y=Math.round((e.clientY-r.top)*(cv.height/r.height)); const [R,G,B] = cctx.getImageData(x,y,1,1).data; const hex = '#'+[R,G,B].map(v=>v.toString(16).padStart(2,'0')).join(''); result.innerHTML = `<div class="kv-row"><span>Picked Color</span><b style="display:flex;align-items:center;gap:8px"><span style="width:18px;height:18px;border-radius:5px;background:${hex};display:inline-block;border:1px solid rgba(255,255,255,0.2)"></span>${hex.toUpperCase()} · rgb(${R},${G},${B})</b></div>`; ctx.copyText(hex); }); }
  }},

{ id:'filters', icon:'🌈', label:'Image Filters', desc:'B&W, sepia, invert, blur & more', cat:'Transform', catIcon:'🔧',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(fs[0]) { curImg = await loadImg(fs[0]); apply('none'); } } });
    const wrap = document.createElement('div'); wrap.className='canvas-wrap'; wrap.style.marginTop='16px'; c.appendChild(wrap);
    const sb = document.createElement('div'); sb.className='setting-block';
    const filters = [['none','✨ Original'],['grayscale(100%)','⚫ B&W'],['sepia(100%)','🟤 Sepia'],['invert(100%)','🔄 Invert'],['blur(3px)','💫 Blur'],['brightness(1.4)','☀️ Bright'],['contrast(1.6)','◐ Contrast'],['saturate(2.5)','🎨 Saturate']];
    sb.innerHTML = `<div class="choice-row" style="flex-wrap:wrap">${filters.map(([v,l],i)=>`<button class="ch ${i===0?'active':''}" data-v="${v}" style="flex:0 0 calc(25% - 8px)">${l}</button>`).join('')}</div>`;
    c.appendChild(sb);
    let curImg = null, curFilter = 'none';
    function apply(f) { curFilter = f; if (!curImg) return; const cv = document.createElement('canvas'); cv.width=curImg.width; cv.height=curImg.height; const cctx=cv.getContext('2d'); cctx.filter = f; cctx.drawImage(curImg,0,0); wrap.innerHTML=''; wrap.appendChild(cv); window.__filteredCv = cv; }
    sb.querySelectorAll('.ch').forEach(b=>b.addEventListener('click',()=>{sb.querySelectorAll('.ch').forEach(x=>x.classList.remove('active'));b.classList.add('active');apply(b.dataset.v);}));
    const btn = runBtnEl(c, '⬇ Download Filtered Image', ctx.color, async () => { if (window.__filteredCv) ctx.dlCanvas(window.__filteredCv, 'filtered.png'); });
    btn.disabled = false;
  }},

{ id:'rotate-flip', icon:'🔃', label:'Rotate & Flip', desc:'Rotate or mirror an image', cat:'Transform', catIcon:'🔧',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(fs[0]){ curImg = await loadImg(fs[0]); render(); } } });
    const wrap = document.createElement('div'); wrap.className='canvas-wrap'; wrap.style.marginTop='16px'; c.appendChild(wrap);
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<div class="choice-row"><button class="ch" id="rL">⟲ Left</button><button class="ch" id="rR">⟳ Right</button><button class="ch" id="fH">↔ Flip H</button><button class="ch" id="fV">↕ Flip V</button></div>`;
    c.appendChild(sb);
    let curImg=null, angle=0, flipH=1, flipV=1;
    function render() { if(!curImg) return; const w=curImg.width, h=curImg.height; const swapped = angle%180!==0;
      const cv = document.createElement('canvas'); cv.width = swapped?h:w; cv.height = swapped?w:h;
      const cctx = cv.getContext('2d'); cctx.translate(cv.width/2, cv.height/2); cctx.rotate(angle*Math.PI/180); cctx.scale(flipH,flipV);
      cctx.drawImage(curImg, -w/2, -h/2); wrap.innerHTML=''; wrap.appendChild(cv); window.__rfCv = cv; }
    document.getElementById('rL').addEventListener('click', ()=>{angle=(angle-90+360)%360;render();});
    document.getElementById('rR').addEventListener('click', ()=>{angle=(angle+90)%360;render();});
    document.getElementById('fH').addEventListener('click', ()=>{flipH*=-1;render();});
    document.getElementById('fV').addEventListener('click', ()=>{flipV*=-1;render();});
    runBtnEl(c, '⬇ Download Image', ctx.color, async () => { if(window.__rfCv) ctx.dlCanvas(window.__rfCv,'rotated.png'); }).disabled = false;
  }},

{ id:'watermark', icon:'💧', label:'Watermark Image', desc:'Overlay text watermark on an image', cat:'Edit', catIcon:'✏️',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(fs[0]){ curImg = await loadImg(fs[0]); render(); } } });
    const wrap = document.createElement('div'); wrap.className='canvas-wrap'; wrap.style.marginTop='16px'; c.appendChild(wrap);
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Watermark Text</label><input class="inp" id="wt" value="© My Brand">
      <div style="display:flex;justify-content:space-between;margin-top:12px;margin-bottom:6px"><label class="setting-label" style="margin:0">Opacity</label><span id="wov" style="color:${ctx.color};font-weight:800">60%</span></div><input type="range" id="wo" min="10" max="100" value="60">`;
    c.appendChild(sb);
    let curImg = null;
    function render() { if(!curImg) return; const cv=document.createElement('canvas'); cv.width=curImg.width; cv.height=curImg.height; const cctx=cv.getContext('2d'); cctx.drawImage(curImg,0,0);
      const txt = document.getElementById('wt').value||'WATERMARK'; const op = +document.getElementById('wo').value/100;
      cctx.globalAlpha = op; cctx.fillStyle='#ffffff'; cctx.font = `bold ${Math.round(curImg.width*0.06)}px sans-serif`; cctx.textAlign='center';
      cctx.save(); cctx.translate(cv.width/2, cv.height/2); cctx.rotate(-Math.PI/8); cctx.fillText(txt, 0, 0); cctx.restore();
      wrap.innerHTML=''; wrap.appendChild(cv); window.__wmCv = cv; }
    document.getElementById('wt').addEventListener('input', render); document.getElementById('wo').addEventListener('input', e=>{document.getElementById('wov').textContent=e.target.value+'%';render();});
    runBtnEl(c, '⬇ Download Watermarked Image', ctx.color, async () => { if(window.__wmCv) ctx.dlCanvas(window.__wmCv,'watermarked.png'); }).disabled=false;
  }},

{ id:'favicon-gen', icon:'⭐', label:'Favicon Generator', desc:'Generate favicon sizes from any image', cat:'Generate', catIcon:'⚙️',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: fs => btn.disabled = fs.length<1 });
    const btn = runBtnEl(c, '⭐ Generate Favicons', ctx.color, async () => {
      const file = dz.getFiles()[0]; const img = await loadImg(file);
      const sizes = [16,32,48,180,192,512]; let html = '<div class="out-block"><div class="out-label" style="margin-bottom:12px">Download Each Size</div><div style="display:flex;flex-wrap:wrap;gap:14px">';
      for (const sz of sizes) { const cv=document.createElement('canvas'); cv.width=sz; cv.height=sz; cv.getContext('2d').drawImage(img,0,0,sz,sz); html += `<div style="text-align:center"><canvas id="fav${sz}" width="${sz}" height="${sz}" style="border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:#fff;max-width:64px;width:64px;height:64px"></canvas><div style="font-size:11px;color:var(--text3);margin-top:6px">${sz}×${sz}</div><button class="btn-sm" data-sz="${sz}" style="margin-top:6px;font-size:11px">⬇</button></div>`; }
      html += '</div></div>'; ctx.output(html);
      for (const sz of sizes) { const cv=document.getElementById(`fav${sz}`); cv.getContext('2d').drawImage(img,0,0,sz,sz); }
      document.querySelectorAll('[data-sz]').forEach(b => b.addEventListener('click', () => ctx.dlCanvas(document.getElementById(`fav${b.dataset.sz}`), `favicon-${b.dataset.sz}.png`)));
      ctx.setStatus('✅ Favicons generated!', 'ok');
    });
  }},

{ id:'meme-gen', icon:'😂', label:'Meme Generator', desc:'Add top & bottom caption text', cat:'Generate', catIcon:'⚙️',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(fs[0]){ curImg=await loadImg(fs[0]); render(); } } });
    const wrap = document.createElement('div'); wrap.className='canvas-wrap'; wrap.style.marginTop='16px'; c.appendChild(wrap);
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<div class="row2"><div><label class="setting-label">Top Text</label><input class="inp" id="tt"></div><div><label class="setting-label">Bottom Text</label><input class="inp" id="bt"></div></div>`;
    c.appendChild(sb);
    let curImg=null;
    function render() { if(!curImg)return; const cv=document.createElement('canvas'); cv.width=curImg.width; cv.height=curImg.height; const cctx=cv.getContext('2d'); cctx.drawImage(curImg,0,0);
      const fs = Math.round(curImg.width*0.08); cctx.font=`bold ${fs}px Impact, sans-serif`; cctx.textAlign='center'; cctx.fillStyle='#fff'; cctx.strokeStyle='#000'; cctx.lineWidth=fs/15;
      const top=document.getElementById('tt').value.toUpperCase(), bot=document.getElementById('bt').value.toUpperCase();
      if(top){ cctx.strokeText(top, cv.width/2, fs+10); cctx.fillText(top, cv.width/2, fs+10); }
      if(bot){ cctx.strokeText(bot, cv.width/2, cv.height-20); cctx.fillText(bot, cv.width/2, cv.height-20); }
      wrap.innerHTML=''; wrap.appendChild(cv); window.__memeCv=cv; }
    document.getElementById('tt').addEventListener('input', render); document.getElementById('bt').addEventListener('input', render);
    runBtnEl(c, '⬇ Download Meme', ctx.color, async () => { if(window.__memeCv) ctx.dlCanvas(window.__memeCv,'meme.png'); }).disabled=false;
  }},

{ id:'collage', icon:'🧩', label:'Photo Collage', desc:'Combine multiple photos into a grid', cat:'Generate', catIcon:'⚙️',
  render(c, ctx) {
    const dz = imgDropzone(c, { multiple:true, label:'Drop 2-9 photos', onFiles: fs => btn.disabled = fs.length<2 });
    const btn = runBtnEl(c, '🧩 Create Collage', ctx.color, async () => {
      const files = dz.getFiles(); const imgs = await Promise.all(files.map(loadImg));
      const cols = Math.ceil(Math.sqrt(imgs.length)); const rows = Math.ceil(imgs.length/cols);
      const cellSize = 320; const cv = document.createElement('canvas'); cv.width=cols*cellSize; cv.height=rows*cellSize;
      const cctx = cv.getContext('2d'); cctx.fillStyle='#0D0F1C'; cctx.fillRect(0,0,cv.width,cv.height);
      imgs.forEach((img,i) => { const x=(i%cols)*cellSize, y=Math.floor(i/cols)*cellSize; const ratio=Math.max(cellSize/img.width,cellSize/img.height);
        const w=img.width*ratio, h=img.height*ratio; cctx.drawImage(img, x+(cellSize-w)/2, y+(cellSize-h)/2, w, h); });
      ctx.output(`<div class="canvas-wrap" style="margin-top:14px"><canvas id="collOut"></canvas></div><button class="run-btn" id="dlColl" style="background:linear-gradient(135deg,${ctx.color},#A18CD1);margin-top:14px">⬇ Download Collage</button>`);
      const outCv = document.getElementById('collOut'); outCv.width=cv.width; outCv.height=cv.height; outCv.getContext('2d').drawImage(cv,0,0);
      document.getElementById('dlColl').addEventListener('click', () => ctx.dlCanvas(outCv,'collage.png'));
      ctx.setStatus('✅ Collage created!', 'ok');
    });
  }},

{ id:'metadata', icon:'📊', label:'Image Info Viewer', desc:'View dimensions, size & file type', cat:'Analyze', catIcon:'🔍',
  render(c, ctx) {
    const dz = imgDropzone(c, { onFiles: async fs => { if(!fs[0]) return; const img = await loadImg(fs[0]); const f = fs[0];
      ctx.output(`<div class="kv-grid" style="margin-top:14px">
        <div class="kv-row"><span>File name</span><b>${f.name}</b></div>
        <div class="kv-row"><span>File size</span><b>${(f.size/1024).toFixed(1)} KB</b></div>
        <div class="kv-row"><span>File type</span><b>${f.type}</b></div>
        <div class="kv-row"><span>Dimensions</span><b>${img.width} × ${img.height} px</b></div>
        <div class="kv-row"><span>Aspect ratio</span><b>${(img.width/img.height).toFixed(2)}</b></div>
        <div class="kv-row"><span>Megapixels</span><b>${(img.width*img.height/1e6).toFixed(2)} MP</b></div>
        <div class="kv-row"><span>Last modified</span><b>${new Date(f.lastModified).toLocaleString()}</b></div>
      </div>`); }});
  }},

{ id:'compare', icon:'⚖️', label:'Image Compare', desc:'Slide to compare two images', cat:'Analyze', catIcon:'🔍',
  render(c, ctx) {
    const l1=document.createElement('div'); l1.className='setting-label'; l1.textContent='First Image'; c.appendChild(l1);
    const dz1 = imgDropzone(c, { onFiles: () => update() });
    const l2=document.createElement('div'); l2.className='setting-label'; l2.style.marginTop='16px'; l2.textContent='Second Image'; c.appendChild(l2);
    const dz2 = imgDropzone(c, { onFiles: () => update() });
    const out = document.createElement('div'); out.style.marginTop='18px'; c.appendChild(out);
    async function update() { const f1=dz1.getFiles()[0], f2=dz2.getFiles()[0]; if(!f1||!f2) return;
      const u1 = URL.createObjectURL(f1), u2 = URL.createObjectURL(f2);
      out.innerHTML = `<div style="position:relative;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)"><img src="${u2}" style="width:100%;display:block"><div id="ovWrap" style="position:absolute;inset:0;width:50%;overflow:hidden"><img src="${u1}" style="width:200%;display:block;height:100%;object-fit:cover"></div><input type="range" id="cmpSl" min="0" max="100" value="50" style="position:absolute;bottom:10px;left:5%;width:90%"></div>`;
      document.getElementById('cmpSl').addEventListener('input', e => document.getElementById('ovWrap').style.width = e.target.value+'%'); }
  }},

{ id:'bulk-resize', icon:'📦', label:'Bulk Resizer', desc:'Resize multiple images at once', cat:'Optimize', catIcon:'⚡',
  render(c, ctx) {
    const dz = imgDropzone(c, { multiple:true, label:'Drop multiple images', onFiles: fs => btn.disabled = fs.length<1 });
    const sb = document.createElement('div'); sb.className='setting-block';
    sb.innerHTML = `<label class="setting-label">Max width (px)</label><input class="inp" id="bw" type="number" value="1024">`;
    c.appendChild(sb);
    const btn = runBtnEl(c, '📦 Resize All', ctx.color, async () => {
      const files = dz.getFiles(); const maxW = +document.getElementById('bw').value;
      let html = '<div class="out-block"><div class="out-label" style="margin-bottom:12px">Resized Images</div>';
      const cvs = [];
      for (let i=0;i<files.length;i++) { ctx.setStatus(`Resizing ${i+1} of ${files.length}…`); const img = await loadImg(files[i]);
        const ratio = Math.min(1, maxW/img.width); const w = Math.round(img.width*ratio), h = Math.round(img.height*ratio);
        const cv = document.createElement('canvas'); cv.width=w; cv.height=h; cv.getContext('2d').drawImage(img,0,0,w,h);
        cvs.push({cv, name: files[i].name}); html += `<div class="img-result"><canvas id="bcv${i}"></canvas><button class="img-dl" data-i="${i}">⬇ ${w}×${h}</button></div>`; }
      html += '</div>'; ctx.output(html);
      cvs.forEach((item,i) => { const target = document.getElementById(`bcv${i}`); target.width=item.cv.width; target.height=item.cv.height; target.getContext('2d').drawImage(item.cv,0,0); });
      document.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => ctx.dlCanvas(cvs[+b.dataset.i].cv, 'resized-'+cvs[+b.dataset.i].name)));
      ctx.setStatus(`✅ ${files.length} image(s) resized!`, 'ok');
    });
  }},
];
