/* ════════════ DEVELOPER TOOLS (22) ════════════ */
function runBtnEl(container, label, color, onClick) {
  const btn = document.createElement('button'); btn.className='run-btn';
  btn.style.background = `linear-gradient(135deg,${color},#8B5CF6)`; btn.textContent = label;
  btn.addEventListener('click', async () => { btn.disabled=true; const orig=btn.textContent; btn.innerHTML='<span class="spinner"></span>Working…'; try{ await onClick(); } finally { btn.disabled=false; btn.textContent=orig; } });
  container.appendChild(btn); return btn;
}
function outBox(c, html) { let el = c.querySelector('.dev-out'); if (!el) { el = document.createElement('div'); el.className='dev-out out-block'; c.appendChild(el); } el.innerHTML = html; }

/* tiny inline MD5 (public domain implementation, compact) */
function md5(str){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/\r\n/g,"\n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else if(x>127&&x<2048){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,k=23;var U=6,T=10,R=15,O=21;str=J(str);C=e(str);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],k,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],k,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],k,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],k,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}return(B(Y)+B(X)+B(W)+B(V)).toLowerCase()}

async function sha(algo, text) { const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text)); return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join(''); }

const TOOLS = [
{ id:'json-formatter', icon:'{ }', label:'JSON Formatter', desc:'Format, validate & beautify JSON', cat:'Data', catIcon:'📦',
  render(c, ctx) { textTool(c, { label:'Paste JSON', placeholder:'{"key":"value"}', buttonLabel:'Format & Validate', outputLabel:'Formatted JSON',
    process: t => JSON.stringify(JSON.parse(t), null, 2) }); }},

{ id:'json-to-csv', icon:'📊', label:'JSON to CSV', desc:'Convert a JSON array to CSV', cat:'Data', catIcon:'📦',
  render(c, ctx) { textTool(c, { label:'Paste JSON array', placeholder:'[{"name":"Alice","age":30},{"name":"Bob","age":25}]', buttonLabel:'Convert to CSV', outputLabel:'CSV Output',
    process: t => { const arr = JSON.parse(t); if (!Array.isArray(arr) || !arr.length) throw new Error('Input must be a non-empty JSON array');
      const headers = Object.keys(arr[0]); const rows = arr.map(o => headers.map(h => JSON.stringify(o[h]??'')).join(','));
      return [headers.join(','), ...rows].join('\n'); } }); }},

{ id:'csv-to-json', icon:'📋', label:'CSV to JSON', desc:'Convert CSV data to a JSON array', cat:'Data', catIcon:'📦',
  render(c, ctx) { textTool(c, { label:'Paste CSV', placeholder:'name,age\nAlice,30\nBob,25', buttonLabel:'Convert to JSON', outputLabel:'JSON Output',
    process: t => { const lines = t.trim().split('\n'); const headers = lines[0].split(',').map(h=>h.trim());
      const data = lines.slice(1).map(line => { const vals = line.split(','); const obj = {}; headers.forEach((h,i)=>obj[h]=vals[i]?.trim()); return obj; });
      return JSON.stringify(data, null, 2); } }); }},

{ id:'base64', icon:'🔢', label:'Base64 Encode/Decode', desc:'Encode or decode Base64 strings', cat:'Encoding', catIcon:'🔐',
  render(c, ctx) {
    let mode = 'encode';
    c.innerHTML = `<div class="choice-row" style="margin-bottom:16px"><button class="ch active" id="m1">Encode</button><button class="ch" id="m2">Decode</button></div>`;
    const body = document.createElement('div'); c.appendChild(body);
    function build() { body.innerHTML=''; textTool(body, { label: mode==='encode'?'Plain Text':'Base64 String', buttonLabel: mode==='encode'?'Encode':'Decode', outputLabel: mode==='encode'?'Base64 Output':'Decoded Text',
      process: t => mode==='encode' ? btoa(unescape(encodeURIComponent(t))) : decodeURIComponent(escape(atob(t.trim()))) }); }
    document.getElementById('m1').addEventListener('click', ()=>{mode='encode';document.getElementById('m1').classList.add('active');document.getElementById('m2').classList.remove('active');build();});
    document.getElementById('m2').addEventListener('click', ()=>{mode='decode';document.getElementById('m2').classList.add('active');document.getElementById('m1').classList.remove('active');build();});
    build();
  }},

{ id:'url-encode', icon:'🌐', label:'URL Encode/Decode', desc:'Encode or decode URL strings', cat:'Encoding', catIcon:'🔐',
  render(c, ctx) {
    let mode = 'encode';
    c.innerHTML = `<div class="choice-row" style="margin-bottom:16px"><button class="ch active" id="m1">Encode</button><button class="ch" id="m2">Decode</button></div>`;
    const body = document.createElement('div'); c.appendChild(body);
    function build() { body.innerHTML=''; textTool(body, { label: mode==='encode'?'Plain Text':'Encoded URL', buttonLabel: mode==='encode'?'Encode':'Decode', outputLabel:'Result',
      process: t => mode==='encode' ? encodeURIComponent(t) : decodeURIComponent(t) }); }
    document.getElementById('m1').addEventListener('click', ()=>{mode='encode';document.getElementById('m1').classList.add('active');document.getElementById('m2').classList.remove('active');build();});
    document.getElementById('m2').addEventListener('click', ()=>{mode='decode';document.getElementById('m2').classList.add('active');document.getElementById('m1').classList.remove('active');build();});
    build();
  }},

{ id:'html-entities', icon:'🔤', label:'HTML Entity Encoder', desc:'Encode or decode HTML entities', cat:'Encoding', catIcon:'🔐',
  render(c, ctx) {
    let mode = 'encode';
    c.innerHTML = `<div class="choice-row" style="margin-bottom:16px"><button class="ch active" id="m1">Encode</button><button class="ch" id="m2">Decode</button></div>`;
    const body = document.createElement('div'); c.appendChild(body);
    function build() { body.innerHTML=''; textTool(body, { label:'Input', buttonLabel: mode==='encode'?'Encode':'Decode', outputLabel:'Result',
      process: t => { if (mode==='encode') return t.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
        const ta = document.createElement('textarea'); ta.innerHTML = t; return ta.value; } }); }
    document.getElementById('m1').addEventListener('click', ()=>{mode='encode';document.getElementById('m1').classList.add('active');document.getElementById('m2').classList.remove('active');build();});
    document.getElementById('m2').addEventListener('click', ()=>{mode='decode';document.getElementById('m2').classList.add('active');document.getElementById('m1').classList.remove('active');build();});
    build();
  }},

{ id:'hash-gen', icon:'#️⃣', label:'Hash Generator', desc:'Generate MD5, SHA-1, SHA-256 & SHA-512', cat:'Security', catIcon:'🔒',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Input Text</label><textarea class="ta" id="hgi" rows="4" placeholder="Type or paste text…"></textarea></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = async () => { const t = document.getElementById('hgi').value;
      const md5h = md5(t), sha1 = await sha('SHA-1', t), sha256 = await sha('SHA-256', t), sha512 = await sha('SHA-512', t);
      out.innerHTML = [['MD5',md5h],['SHA-1',sha1],['SHA-256',sha256],['SHA-512',sha512]].map(([name,val]) => `<div class="out-block"><div class="out-head"><span class="out-label">${name}</span><button class="out-copy" data-v="${val}">📋 Copy</button></div><textarea class="ta mono" readonly rows="2">${val}</textarea></div>`).join('');
      out.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => copyText(b.dataset.v))); };
    document.getElementById('hgi').addEventListener('input', update); update();
  }},

{ id:'uuid-gen', icon:'🆔', label:'UUID Generator', desc:'Generate random UUID v4 values', cat:'Generate', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">How many?</label><input class="inp" id="uc" type="number" value="5" min="1" max="50"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '🆔 Generate UUIDs', ctx.color, () => {
      const n = +document.getElementById('uc').value;
      const ids = Array.from({length:n}, () => crypto.randomUUID());
      out.innerHTML = `<div class="out-block"><div class="out-head"><span class="out-label">${n} UUID(s)</span><button class="out-copy" id="cpu">📋 Copy All</button></div><textarea class="ta mono" readonly rows="${Math.min(n,10)}">${ids.join('\n')}</textarea></div>`;
      document.getElementById('cpu').addEventListener('click', () => copyText(ids.join('\n')));
    });
  }},

{ id:'password-gen', icon:'🔐', label:'Password Generator', desc:'Generate strong random passwords', cat:'Security', catIcon:'🔒',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><label class="setting-label" style="margin:0">Length</label><span id="plv" style="color:${ctx.color};font-weight:800">16</span></div><input type="range" id="pl" min="6" max="64" value="16"></div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text2)"><input type="checkbox" id="pU" checked> Uppercase (A-Z)</label>
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text2)"><input type="checkbox" id="pL" checked> Lowercase (a-z)</label>
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text2)"><input type="checkbox" id="pN" checked> Numbers (0-9)</label>
        <label style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text2)"><input type="checkbox" id="pS" checked> Symbols (!@#$%)</label>
      </div>`;
    document.getElementById('pl').addEventListener('input', e => document.getElementById('plv').textContent = e.target.value);
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '🔐 Generate Password', ctx.color, () => {
      const len = +document.getElementById('pl').value;
      let chars = ''; if (document.getElementById('pU').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (document.getElementById('pL').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (document.getElementById('pN').checked) chars += '0123456789'; if (document.getElementById('pS').checked) chars += '!@#$%^&*()_+-=[]{}';
      if (!chars) { ctx.setStatus('⚠️ Select at least one character type.', 'err'); return; }
      const arr = new Uint32Array(len); crypto.getRandomValues(arr);
      const pw = Array.from(arr, n => chars[n % chars.length]).join('');
      out.innerHTML = `<div class="out-block"><div class="out-head"><span class="out-label">Generated Password</span><button class="out-copy" id="cpp">📋 Copy</button></div><textarea class="ta mono" readonly rows="1" style="font-size:16px;font-weight:700;letter-spacing:1px">${pw}</textarea></div>`;
      document.getElementById('cpp').addEventListener('click', () => copyText(pw));
    });
  }},

{ id:'regex-tester', icon:'🧪', label:'Regex Tester', desc:'Test regular expressions live', cat:'Code', catIcon:'💻',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Pattern</label><input class="inp mono" id="rxp" placeholder="\\d+"></div><div><label class="setting-label">Flags</label><input class="inp mono" id="rxf" value="g" placeholder="g, i, m"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Test String</label><textarea class="ta mono" id="rxs" rows="5" placeholder="Type text to test against your pattern…"></textarea></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = () => { const p = document.getElementById('rxp').value, f = document.getElementById('rxf').value, s = document.getElementById('rxs').value;
      if (!p) { out.innerHTML=''; return; }
      try { const re = new RegExp(p, f); const matches = [...s.matchAll(new RegExp(p, f.includes('g')?f:f+'g'))];
        const highlighted = s.replace(re, m => `<mark style="background:${ctx.color}55;color:#fff;border-radius:3px;padding:0 2px">${m}</mark>`);
        out.innerHTML = `<div class="msg msg-ok">✅ ${matches.length} match(es) found</div><div class="ta mono" style="margin-top:10px;padding:13px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);white-space:pre-wrap;min-height:60px">${highlighted||'<span style=\"color:#475569\">No text</span>'}</div>`;
      } catch(e) { out.innerHTML = `<div class="msg msg-err">⚠️ ${e.message}</div>`; } };
    ['rxp','rxf','rxs'].forEach(id => document.getElementById(id).addEventListener('input', update));
  }},

{ id:'color-converter', icon:'🎨', label:'Color Converter', desc:'Convert between HEX, RGB & HSL', cat:'Design', catIcon:'🖌️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Pick or enter a color</label><div style="display:flex;gap:12px"><input type="color" id="ccPick" value="#6C63FF"><input class="inp" id="ccHex" value="#6C63FF" style="flex:1"></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    function hexToRgb(hex) { const v = parseInt(hex.replace('#',''),16); return [v>>16&255, v>>8&255, v&255]; }
    function rgbToHsl(r,g,b){ r/=255;g/=255;b/=255; const max=Math.max(r,g,b),min=Math.min(r,g,b); let h,s,l=(max+min)/2; if(max===min){h=s=0;} else { const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min); switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;} h/=6; } return [Math.round(h*360),Math.round(s*100),Math.round(l*100)]; }
    function update(hex) { try { const [r,g,b] = hexToRgb(hex); const [h,s,l] = rgbToHsl(r,g,b);
      out.innerHTML = `<div style="width:100%;height:60px;border-radius:12px;background:${hex};margin-bottom:14px;border:1px solid rgba(255,255,255,0.1)"></div><div class="kv-grid"><div class="kv-row"><span>HEX</span><b>${hex.toUpperCase()}</b></div><div class="kv-row"><span>RGB</span><b>rgb(${r}, ${g}, ${b})</b></div><div class="kv-row"><span>HSL</span><b>hsl(${h}, ${s}%, ${l}%)</b></div></div>`; } catch(e){} }
    document.getElementById('ccPick').addEventListener('input', e => { document.getElementById('ccHex').value = e.target.value; update(e.target.value); });
    document.getElementById('ccHex').addEventListener('input', e => { if(/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) { document.getElementById('ccPick').value = e.target.value; update(e.target.value); } });
    update('#6C63FF');
  }},

{ id:'css-minify', icon:'📦', label:'CSS Minifier', desc:'Compress CSS by removing whitespace', cat:'Code', catIcon:'💻',
  render(c, ctx) { textTool(c, { label:'Paste CSS', placeholder:'.class { color: red; }', buttonLabel:'Minify', outputLabel:'Minified CSS',
    process: t => t.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim() }); }},

{ id:'css-beautify', icon:'✨', label:'CSS Beautifier', desc:'Format minified CSS readably', cat:'Code', catIcon:'💻',
  render(c, ctx) { textTool(c, { label:'Paste minified CSS', placeholder:'.a{color:red;margin:0}', buttonLabel:'Beautify', outputLabel:'Formatted CSS',
    process: t => t.replace(/\{/g,' {\n  ').replace(/\}/g,'\n}\n').replace(/;/g,';\n  ').replace(/\n\s*\n/g,'\n').replace(/  \n\}/g,'\n}').trim() }); }},

{ id:'js-minify', icon:'⚙️', label:'JS Minifier', desc:'Basic JavaScript whitespace minifier', cat:'Code', catIcon:'💻',
  render(c, ctx) { textTool(c, { label:'Paste JavaScript', placeholder:'function add(a, b) {\n  return a + b;\n}', buttonLabel:'Minify', outputLabel:'Minified JS',
    process: t => t.replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}();,:])\s*/g,'$1').trim() }); }},

{ id:'lorem-ipsum', icon:'📜', label:'Lorem Ipsum Generator', desc:'Generate placeholder text', cat:'Generate', catIcon:'⚙️',
  render(c, ctx) {
    const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat'.split(' ');
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Paragraphs</label><input class="inp" id="lp" type="number" value="3" min="1" max="20"></div><div><label class="setting-label">Words per paragraph</label><input class="inp" id="lw" type="number" value="40" min="5" max="200"></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '📜 Generate Text', ctx.color, () => {
      const p = +document.getElementById('lp').value, w = +document.getElementById('lw').value;
      const paras = Array.from({length:p}, () => { let s = Array.from({length:w}, () => words[Math.floor(Math.random()*words.length)]).join(' '); return s.charAt(0).toUpperCase()+s.slice(1)+'.'; });
      const text = paras.join('\n\n');
      out.innerHTML = `<div class="out-block"><div class="out-head"><span class="out-label">Generated Text</span><button class="out-copy" id="cpl">📋 Copy</button></div><textarea class="ta" readonly rows="10">${text}</textarea></div>`;
      document.getElementById('cpl').addEventListener('click', () => copyText(text));
    });
  }},

{ id:'markdown-preview', icon:'📃', label:'Markdown Previewer', desc:'Live-preview Markdown as HTML', cat:'Code', catIcon:'💻',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Markdown</label><textarea class="ta mono" id="mdi" rows="8" placeholder="# Heading\n\n**bold** and *italic*\n\n- list item"></textarea></div>
      <div class="out-block"><div class="out-label" style="margin-bottom:10px">Preview</div><div id="mdPrev" style="padding:16px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);color:#CBD5E1;min-height:80px"></div></div>`;
    function render() { let h = document.getElementById('mdi').value;
      h = h.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      h = h.replace(/^### (.*$)/gim,'<h3>$1</h3>').replace(/^## (.*$)/gim,'<h2>$1</h2>').replace(/^# (.*$)/gim,'<h1>$1</h1>')
           .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\*(.*?)\*/g,'<i>$1</i>')
           .replace(/^- (.*$)/gim,'<li>$1</li>').replace(/\n/g,'<br>');
      document.getElementById('mdPrev').innerHTML = h; }
    document.getElementById('mdi').addEventListener('input', render); render();
  }},

{ id:'diff-checker', icon:'🆚', label:'Text Diff Checker', desc:'Compare two blocks of text line-by-line', cat:'Code', catIcon:'💻',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Text A</label><textarea class="ta mono" id="da" rows="8"></textarea></div><div><label class="setting-label">Text B</label><textarea class="ta mono" id="db" rows="8"></textarea></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '🆚 Compare', ctx.color, () => {
      const a = document.getElementById('da').value.split('\n'), b = document.getElementById('db').value.split('\n');
      const max = Math.max(a.length, b.length); let diffs = 0; let rows = '';
      for (let i=0;i<max;i++) { const same = (a[i]||'')===(b[i]||''); if(!same) diffs++;
        rows += `<div style="display:flex;gap:10px;padding:6px 10px;border-radius:8px;font-size:12px;font-family:monospace;${same?'':'background:rgba(239,68,68,0.08)'}"><span style="color:#475569;min-width:24px">${i+1}</span><span style="flex:1;color:${same?'#64748B':'#F87171'}">${ctx.escapeHtml(a[i]||'')}</span><span style="flex:1;color:${same?'#64748B':'#34D399'}">${ctx.escapeHtml(b[i]||'')}</span></div>`; }
      out.innerHTML = `<div class="msg msg-${diffs?'err':'ok'}">${diffs} line(s) differ out of ${max}</div><div style="margin-top:10px">${rows}</div>`;
    });
  }},

{ id:'timestamp-converter', icon:'🕐', label:'Timestamp Converter', desc:'Convert Unix timestamps to dates', cat:'Data', catIcon:'📦',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Unix Timestamp (seconds)</label><input class="inp mono" id="tsi" placeholder="${Math.floor(Date.now()/1000)}"></div>
      <button class="btn-sm" id="tsNow" style="margin-bottom:16px">Use current time</button>
      <div class="setting-block"><label class="setting-label">Or pick a date/time</label><input class="inp" id="dti" type="datetime-local"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    function fromTs() { const ts = +document.getElementById('tsi').value; if(!ts) return; const d = new Date(ts*1000);
      out.innerHTML = `<div class="kv-grid"><div class="kv-row"><span>ISO 8601</span><b>${d.toISOString()}</b></div><div class="kv-row"><span>Local</span><b>${d.toLocaleString()}</b></div><div class="kv-row"><span>UTC</span><b>${d.toUTCString()}</b></div></div>`; }
    document.getElementById('tsi').addEventListener('input', fromTs);
    document.getElementById('tsNow').addEventListener('click', () => { document.getElementById('tsi').value = Math.floor(Date.now()/1000); fromTs(); });
    document.getElementById('dti').addEventListener('input', e => { const ts = Math.floor(new Date(e.target.value).getTime()/1000); document.getElementById('tsi').value = ts; fromTs(); });
    fromTs(); document.getElementById('tsi').value = Math.floor(Date.now()/1000); fromTs();
  }},

{ id:'number-base', icon:'🔢', label:'Number Base Converter', desc:'Convert between binary, octal, decimal & hex', cat:'Data', catIcon:'📦',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Decimal</label><input class="inp mono" id="nbD" placeholder="255"></div>
      <div class="row3" style="margin-top:14px"><div><label class="setting-label">Binary</label><input class="inp mono" id="nbB" readonly></div><div><label class="setting-label">Octal</label><input class="inp mono" id="nbO" readonly></div><div><label class="setting-label">Hex</label><input class="inp mono" id="nbH" readonly></div></div>`;
    document.getElementById('nbD').addEventListener('input', e => { const n = parseInt(e.target.value); if(isNaN(n)) return;
      document.getElementById('nbB').value = n.toString(2); document.getElementById('nbO').value = n.toString(8); document.getElementById('nbH').value = n.toString(16).toUpperCase(); });
  }},

{ id:'jwt-decoder', icon:'🪪', label:'JWT Decoder', desc:'Decode JSON Web Tokens', cat:'Security', catIcon:'🔒',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Paste JWT Token</label><textarea class="ta mono" id="jwi" rows="4" placeholder="eyJhbGciOiJIUzI1NiIs..."></textarea></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    runBtnEl(c, '🪪 Decode JWT', ctx.color, () => {
      try { const parts = document.getElementById('jwi').value.trim().split('.');
        if (parts.length < 2) throw new Error('Invalid JWT format');
        const decode = p => JSON.stringify(JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g,'+').replace(/_/g,'/'))))), null, 2);
        out.innerHTML = `<div class="out-block"><div class="out-label">Header</div><textarea class="ta mono" readonly rows="4">${decode(parts[0])}</textarea></div><div class="out-block"><div class="out-label">Payload</div><textarea class="ta mono" readonly rows="6">${decode(parts[1])}</textarea></div>`;
      } catch(e) { ctx.setStatus('⚠️ '+e.message, 'err'); }
    });
  }},

{ id:'qr-generator', icon:'📱', label:'QR Code Generator', desc:'Generate a QR code from any text', cat:'Generate', catIcon:'⚙️',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Text or URL</label><input class="inp" id="qri" placeholder="https://example.com"></div>
      <div class="setting-block"><label class="setting-label">Size (px)</label><input class="inp" id="qrs" type="number" value="240" min="100" max="500"></div>`;
    const out = document.createElement('div'); out.style.marginTop='16px'; out.style.textAlign='center'; c.appendChild(out);
    runBtnEl(c, '📱 Generate QR Code', ctx.color, () => {
      const text = document.getElementById('qri').value || 'https://example.com'; const size = +document.getElementById('qrs').value;
      out.innerHTML = `<div id="qrBox" style="display:inline-block;padding:16px;background:#fff;border-radius:14px"></div><br><button class="btn-sm" id="qrDl" style="margin-top:14px">⬇ Download PNG</button>`;
      new QRCode(document.getElementById('qrBox'), { text, width: size, height: size, colorDark:'#000000', colorLight:'#ffffff' });
      setTimeout(() => { document.getElementById('qrDl').addEventListener('click', () => { const img = document.querySelector('#qrBox img') || document.querySelector('#qrBox canvas'); if (img.tagName==='CANVAS') dl(img.toDataURL().split(',')[1] ? (() => { const a=document.createElement('a'); a.href=img.toDataURL(); a.download='qrcode.png'; a.click(); })() : null); else { const a=document.createElement('a'); a.href=img.src; a.download='qrcode.png'; a.click(); } }); }, 200);
      ctx.setStatus('✅ QR code generated!', 'ok');
    });
  }},

{ id:'cron-parser', icon:'⏰', label:'Cron Expression Helper', desc:'Understand & build cron expressions', cat:'Code', catIcon:'💻',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Cron Expression</label><input class="inp mono" id="cre" value="0 9 * * 1-5" placeholder="* * * * *"></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const names = ['Minute','Hour','Day of Month','Month','Day of Week'];
    function describe() { const parts = document.getElementById('cre').value.trim().split(/\s+/);
      if (parts.length !== 5) { out.innerHTML = '<div class="msg msg-err">⚠️ Cron expression must have exactly 5 fields</div>'; return; }
      out.innerHTML = `<div class="kv-grid">${parts.map((p,i)=>`<div class="kv-row"><span>${names[i]}</span><b>${p}</b></div>`).join('')}</div>
        <div class="msg msg-info" style="margin-top:12px">ℹ️ Reads as: minute(s) <b>${parts[0]}</b>, hour(s) <b>${parts[1]}</b>, day-of-month <b>${parts[2]}</b>, month(s) <b>${parts[3]}</b>, day-of-week <b>${parts[4]}</b></div>`; }
    document.getElementById('cre').addEventListener('input', describe); describe();
  }},
];
