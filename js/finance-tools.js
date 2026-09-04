/* ════════════ FINANCE CALCULATORS (16) ════════════ */
function runBtnEl(container, label, color, onClick) {
  const btn = document.createElement('button'); btn.className='run-btn';
  btn.style.background = `linear-gradient(135deg,${color},#10B981)`; btn.textContent = label;
  btn.addEventListener('click', async () => { btn.disabled=true; const orig=btn.textContent; btn.innerHTML='<span class="spinner"></span>Calculating…'; try{ await onClick(); } finally { btn.disabled=false; btn.textContent=orig; } });
  container.appendChild(btn); return btn;
}
function outBox(c, html) { let el = c.querySelector('.fin-out'); if (!el) { el = document.createElement('div'); el.className='fin-out out-block'; c.appendChild(el); } el.innerHTML = html; }
function fmt(n, cur='$') { return cur + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }); }
function row(label, val, highlight) { return `<div class="kv-row"><span>${label}</span><b style="${highlight?'color:#10B981;font-size:15px':''}">${val}</b></div>`; }

const TOOLS = [
{ id:'emi-calculator', icon:'🏦', label:'Loan EMI Calculator', desc:'Calculate monthly loan payments', cat:'Loans', catIcon:'🏦',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Loan Amount</label><input class="inp" id="la" type="number" value="500000"></div>
      <div class="row2"><div><label class="setting-label">Interest Rate (% / year)</label><input class="inp" id="lr" type="number" value="8.5" step="0.1"></div><div><label class="setting-label">Tenure (months)</label><input class="inp" id="lt" type="number" value="60"></div></div>`;
    runBtnEl(c, '🏦 Calculate EMI', ctx.color, () => {
      const P = +document.getElementById('la').value, R = +document.getElementById('lr').value/12/100, N = +document.getElementById('lt').value;
      const emi = P*R*Math.pow(1+R,N)/(Math.pow(1+R,N)-1); const total = emi*N; const interest = total-P;
      outBox(c, row('Monthly EMI', fmt(emi.toFixed(0)), true) + row('Total Interest Payable', fmt(interest.toFixed(0))) + row('Total Payment', fmt(total.toFixed(0))));
    });
  }},

{ id:'compound-interest', icon:'📈', label:'Compound Interest', desc:'Calculate compound growth over time', cat:'Investing', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Principal</label><input class="inp" id="cp" type="number" value="10000"></div>
      <div class="row2"><div><label class="setting-label">Annual Rate (%)</label><input class="inp" id="cr" type="number" value="7" step="0.1"></div><div><label class="setting-label">Years</label><input class="inp" id="cy" type="number" value="10"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Compounds per year</label><select class="inp" id="cn"><option value="1">Annually</option><option value="4">Quarterly</option><option value="12" selected>Monthly</option><option value="365">Daily</option></select></div>`;
    runBtnEl(c, '📈 Calculate', ctx.color, () => {
      const P=+document.getElementById('cp').value, r=+document.getElementById('cr').value/100, t=+document.getElementById('cy').value, n=+document.getElementById('cn').value;
      const A = P*Math.pow(1+r/n, n*t); const interest = A-P;
      outBox(c, row('Final Amount', fmt(A.toFixed(0)), true) + row('Interest Earned', fmt(interest.toFixed(0))) + row('Total Growth', ((A/P-1)*100).toFixed(1)+'%'));
    });
  }},

{ id:'simple-interest', icon:'💵', label:'Simple Interest', desc:'Calculate simple interest earned', cat:'Investing', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Principal</label><input class="inp" id="sp" type="number" value="10000"></div>
      <div class="row2"><div><label class="setting-label">Rate (% / year)</label><input class="inp" id="sr" type="number" value="6" step="0.1"></div><div><label class="setting-label">Time (years)</label><input class="inp" id="st" type="number" value="5"></div></div>`;
    runBtnEl(c, '💵 Calculate', ctx.color, () => {
      const P=+document.getElementById('sp').value, r=+document.getElementById('sr').value/100, t=+document.getElementById('st').value;
      const interest = P*r*t; outBox(c, row('Interest Earned', fmt(interest.toFixed(0)), true) + row('Total Amount', fmt((P+interest).toFixed(0))));
    });
  }},

{ id:'sip-calculator', icon:'💹', label:'SIP Calculator', desc:'Calculate returns on monthly investments', cat:'Investing', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Monthly Investment</label><input class="inp" id="sm" type="number" value="5000"></div>
      <div class="row2"><div><label class="setting-label">Expected Annual Return (%)</label><input class="inp" id="srate" type="number" value="12" step="0.1"></div><div><label class="setting-label">Duration (years)</label><input class="inp" id="sy" type="number" value="10"></div></div>`;
    runBtnEl(c, '💹 Calculate Returns', ctx.color, () => {
      const M=+document.getElementById('sm').value, r=+document.getElementById('srate').value/100/12, n=+document.getElementById('sy').value*12;
      const fv = M*((Math.pow(1+r,n)-1)/r)*(1+r); const invested = M*n; const gains = fv-invested;
      outBox(c, row('Future Value', fmt(fv.toFixed(0)), true) + row('Total Invested', fmt(invested.toFixed(0))) + row('Wealth Gained', fmt(gains.toFixed(0))));
    });
  }},

{ id:'mortgage-calculator', icon:'🏠', label:'Mortgage Calculator', desc:'Calculate home loan monthly payments', cat:'Loans', catIcon:'🏦',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Home Price</label><input class="inp" id="mp" type="number" value="300000"></div>
      <div class="row2"><div><label class="setting-label">Down Payment</label><input class="inp" id="md" type="number" value="60000"></div><div><label class="setting-label">Loan Term (years)</label><input class="inp" id="mt" type="number" value="30"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Interest Rate (% / year)</label><input class="inp" id="mr" type="number" value="6.5" step="0.1"></div>`;
    runBtnEl(c, '🏠 Calculate Mortgage', ctx.color, () => {
      const price=+document.getElementById('mp').value, down=+document.getElementById('md').value, years=+document.getElementById('mt').value, rate=+document.getElementById('mr').value/100/12;
      const P = price-down, N = years*12; const m = P*rate*Math.pow(1+rate,N)/(Math.pow(1+rate,N)-1);
      outBox(c, row('Loan Amount', fmt(P.toFixed(0))) + row('Monthly Payment', fmt(m.toFixed(0)), true) + row('Total Paid Over Term', fmt((m*N).toFixed(0))) + row('Total Interest', fmt((m*N-P).toFixed(0))));
    });
  }},

{ id:'retirement-calculator', icon:'🌅', label:'Retirement Savings', desc:'Project your retirement nest egg', cat:'Planning', catIcon:'🎯',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Current Age</label><input class="inp" id="rca" type="number" value="30"></div><div><label class="setting-label">Retirement Age</label><input class="inp" id="rra" type="number" value="65"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Current Savings</label><input class="inp" id="rcs" type="number" value="20000"></div><div><label class="setting-label">Monthly Contribution</label><input class="inp" id="rmc" type="number" value="500"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Expected Annual Return (%)</label><input class="inp" id="rrate" type="number" value="7" step="0.1"></div>`;
    runBtnEl(c, '🌅 Project Savings', ctx.color, () => {
      const years = +document.getElementById('rra').value - +document.getElementById('rca').value; const n = years*12;
      const r = +document.getElementById('rrate').value/100/12; const PV = +document.getElementById('rcs').value, PMT = +document.getElementById('rmc').value;
      const fv = PV*Math.pow(1+r,n) + PMT*((Math.pow(1+r,n)-1)/r);
      outBox(c, row('Years to Retirement', years) + row('Projected Nest Egg', fmt(fv.toFixed(0)), true) + row('Total Contributions', fmt((PV+PMT*n).toFixed(0))));
    });
  }},

{ id:'currency-converter', icon:'💱', label:'Currency Converter', desc:'Convert between world currencies live', cat:'Investing', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Amount</label><input class="inp" id="cca" type="number" value="100"></div><div><label class="setting-label">From</label><select class="inp" id="ccf"></select></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">To</label><select class="inp" id="cct"></select></div>`;
    const curList = ['USD','EUR','GBP','INR','JPY','AUD','CAD','CHF','CNY','SGD'];
    const f = document.getElementById('ccf'), t = document.getElementById('cct');
    curList.forEach(cu => { f.innerHTML += `<option ${cu==='USD'?'selected':''}>${cu}</option>`; t.innerHTML += `<option ${cu==='EUR'?'selected':''}>${cu}</option>`; });
    runBtnEl(c, '💱 Convert', ctx.color, async () => {
      const amt = +document.getElementById('cca').value, from = f.value, to = t.value;
      try { const res = await fetch(`https://api.frankfurter.app/latest?amount=${amt}&from=${from}&to=${to}`); const data = await res.json();
        const result = data.rates[to]; outBox(c, row(`${amt} ${from} =`, `${result.toFixed(2)} ${to}`, true) + row('Exchange Rate', `1 ${from} = ${(result/amt).toFixed(4)} ${to}`));
        ctx.setStatus('✅ Live rate fetched!', 'ok');
      } catch(e) { ctx.setStatus('⚠️ Could not fetch live rates. Check your connection.', 'err'); }
    });
  }},

{ id:'tax-calculator', icon:'🧾', label:'Income Tax Estimator', desc:'Estimate tax using sample progressive slabs', cat:'Planning', catIcon:'🎯',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Annual Income</label><input class="inp" id="tia" type="number" value="60000"></div>
      <div class="msg msg-info">ℹ️ Uses an illustrative progressive slab system. Replace with your country's actual tax brackets for precise figures.</div>`;
    runBtnEl(c, '🧾 Estimate Tax', ctx.color, () => {
      const income = +document.getElementById('tia').value;
      const slabs = [[10000,0],[30000,0.10],[50000,0.20],[Infinity,0.30]];
      let tax = 0, prev = 0;
      for (const [limit, rate] of slabs) { const taxable = Math.min(income, limit) - prev; if (taxable > 0) tax += taxable * rate; prev = limit; if (income <= limit) break; }
      outBox(c, row('Estimated Tax', fmt(tax.toFixed(0)), true) + row('Effective Rate', (tax/income*100).toFixed(1)+'%') + row('Take-Home Income', fmt((income-tax).toFixed(0))));
    });
  }},

{ id:'discount-calculator', icon:'🏷️', label:'Discount Calculator', desc:'Calculate sale prices & savings', cat:'Shopping', catIcon:'🛒',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Original Price</label><input class="inp" id="dop" type="number" value="100"></div><div><label class="setting-label">Discount (%)</label><input class="inp" id="dod" type="number" value="25"></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = () => { const p=+document.getElementById('dop').value, d=+document.getElementById('dod').value; const saved = p*d/100; const final = p-saved;
      out.innerHTML = `<div class="kv-grid" style="margin-top:14px">${row('Final Price', fmt(final.toFixed(2)), true)}${row('You Save', fmt(saved.toFixed(2)))}</div>`; };
    document.getElementById('dop').addEventListener('input', update); document.getElementById('dod').addEventListener('input', update); update();
  }},

{ id:'profit-margin', icon:'📊', label:'Profit Margin Calculator', desc:'Calculate gross profit margin & markup', cat:'Business', catIcon:'💼',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Cost Price</label><input class="inp" id="pmc" type="number" value="50"></div><div><label class="setting-label">Selling Price</label><input class="inp" id="pms" type="number" value="80"></div></div>`;
    const out = document.createElement('div'); c.appendChild(out);
    const update = () => { const cost=+document.getElementById('pmc').value, sell=+document.getElementById('pms').value; const profit=sell-cost; const margin=profit/sell*100; const markup=profit/cost*100;
      out.innerHTML = `<div class="kv-grid" style="margin-top:14px">${row('Profit', fmt(profit.toFixed(2)), true)}${row('Profit Margin', margin.toFixed(1)+'%')}${row('Markup', markup.toFixed(1)+'%')}</div>`; };
    document.getElementById('pmc').addEventListener('input', update); document.getElementById('pms').addEventListener('input', update); update();
  }},

{ id:'breakeven-calculator', icon:'⚖️', label:'Break-Even Calculator', desc:'Find your break-even sales volume', cat:'Business', catIcon:'💼',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Fixed Costs</label><input class="inp" id="bfc" type="number" value="10000"></div>
      <div class="row2"><div><label class="setting-label">Price per Unit</label><input class="inp" id="bpp" type="number" value="50"></div><div><label class="setting-label">Variable Cost per Unit</label><input class="inp" id="bvc" type="number" value="20"></div></div>`;
    runBtnEl(c, '⚖️ Calculate Break-Even', ctx.color, () => {
      const fc=+document.getElementById('bfc').value, price=+document.getElementById('bpp').value, vc=+document.getElementById('bvc').value;
      const units = fc/(price-vc); const revenue = units*price;
      outBox(c, row('Break-Even Units', Math.ceil(units), true) + row('Break-Even Revenue', fmt(revenue.toFixed(0))) + row('Contribution Margin / Unit', fmt(price-vc)));
    });
  }},

{ id:'salary-calculator', icon:'💼', label:'Take-Home Salary', desc:'Estimate net salary after deductions', cat:'Planning', catIcon:'🎯',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Gross Annual Salary</label><input class="inp" id="sga" type="number" value="80000"></div>
      <div class="row2"><div><label class="setting-label">Tax Rate (%)</label><input class="inp" id="str" type="number" value="22"></div><div><label class="setting-label">Other Deductions (%)</label><input class="inp" id="sod" type="number" value="5"></div></div>`;
    runBtnEl(c, '💼 Calculate Take-Home', ctx.color, () => {
      const gross=+document.getElementById('sga').value, tax=+document.getElementById('str').value/100, other=+document.getElementById('sod').value/100;
      const net = gross*(1-tax-other);
      outBox(c, row('Net Annual Salary', fmt(net.toFixed(0)), true) + row('Net Monthly', fmt((net/12).toFixed(0))) + row('Total Deductions', fmt((gross-net).toFixed(0))));
    });
  }},

{ id:'cagr-calculator', icon:'📈', label:'CAGR Calculator', desc:'Compound Annual Growth Rate of an investment', cat:'Investing', catIcon:'📊',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Initial Value</label><input class="inp" id="cgi" type="number" value="10000"></div><div><label class="setting-label">Final Value</label><input class="inp" id="cgf" type="number" value="25000"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Number of Years</label><input class="inp" id="cgy" type="number" value="5"></div>`;
    runBtnEl(c, '📈 Calculate CAGR', ctx.color, () => {
      const i=+document.getElementById('cgi').value, f=+document.getElementById('cgf').value, y=+document.getElementById('cgy').value;
      const cagr = (Math.pow(f/i, 1/y)-1)*100; outBox(c, row('CAGR', cagr.toFixed(2)+'%', true) + row('Total Growth', ((f/i-1)*100).toFixed(1)+'%'));
    });
  }},

{ id:'loan-affordability', icon:'🏡', label:'Loan Affordability', desc:'See how much loan you can afford', cat:'Loans', catIcon:'🏦',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Monthly Income</label><input class="inp" id="lai" type="number" value="6000"></div><div><label class="setting-label">Existing Monthly Debt</label><input class="inp" id="lad" type="number" value="500"></div></div>
      <div class="row2" style="margin-top:14px"><div><label class="setting-label">Interest Rate (%/yr)</label><input class="inp" id="lar" type="number" value="7" step="0.1"></div><div><label class="setting-label">Loan Term (years)</label><input class="inp" id="lat" type="number" value="20"></div></div>`;
    runBtnEl(c, '🏡 Calculate Affordability', ctx.color, () => {
      const income=+document.getElementById('lai').value, debt=+document.getElementById('lad').value, r=+document.getElementById('lar').value/100/12, n=+document.getElementById('lat').value*12;
      const maxEmi = income*0.4 - debt; const maxLoan = maxEmi*(Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n));
      outBox(c, row('Max Affordable EMI', fmt(maxEmi.toFixed(0))) + row('Max Loan Amount', fmt(maxLoan.toFixed(0)), true));
    });
  }},

{ id:'credit-card-payoff', icon:'💳', label:'Credit Card Payoff', desc:'See how long it takes to pay off debt', cat:'Loans', catIcon:'🏦',
  render(c, ctx) {
    c.innerHTML = `<div class="setting-block"><label class="setting-label">Current Balance</label><input class="inp" id="ccb" type="number" value="5000"></div>
      <div class="row2"><div><label class="setting-label">Annual Interest Rate (%)</label><input class="inp" id="ccr" type="number" value="22" step="0.1"></div><div><label class="setting-label">Monthly Payment</label><input class="inp" id="ccp" type="number" value="200"></div></div>`;
    runBtnEl(c, '💳 Calculate Payoff', ctx.color, () => {
      const bal=+document.getElementById('ccb').value, r=+document.getElementById('ccr').value/100/12, pay=+document.getElementById('ccp').value;
      if (pay <= bal*r) { outBox(c, `<div class="msg msg-err">⚠️ Your payment is too low to ever pay off this balance — increase the monthly payment.</div>`); return; }
      let b = bal, months = 0, totalInterest = 0;
      while (b > 0 && months < 1000) { const interest = b*r; totalInterest += interest; b = b + interest - pay; months++; }
      outBox(c, row('Months to Pay Off', months, true) + row('Years', (months/12).toFixed(1)) + row('Total Interest Paid', fmt(totalInterest.toFixed(0))));
    });
  }},

{ id:'inflation-calculator', icon:'💸', label:'Inflation Calculator', desc:'See how inflation erodes purchasing power', cat:'Planning', catIcon:'🎯',
  render(c, ctx) {
    c.innerHTML = `<div class="row2"><div><label class="setting-label">Current Amount</label><input class="inp" id="ifa" type="number" value="10000"></div><div><label class="setting-label">Years</label><input class="inp" id="ify" type="number" value="10"></div></div>
      <div class="setting-block" style="margin-top:14px"><label class="setting-label">Annual Inflation Rate (%)</label><input class="inp" id="ifr" type="number" value="3" step="0.1"></div>`;
    runBtnEl(c, '💸 Calculate Impact', ctx.color, () => {
      const amt=+document.getElementById('ifa').value, y=+document.getElementById('ify').value, r=+document.getElementById('ifr').value/100;
      const futureNeeded = amt*Math.pow(1+r,y); const futureValueErosion = amt/Math.pow(1+r,y);
      outBox(c, row(`Equivalent value in ${y} yrs`, fmt(futureNeeded.toFixed(0)), true) + row(`Today's $${amt} will feel like`, fmt(futureValueErosion.toFixed(0))+` in ${y} years`));
    });
  }},
];
