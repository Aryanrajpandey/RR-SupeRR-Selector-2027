
let all=[];
const watchNames=['Naman Dhir','Rinku Singh','Tim David','Rasikh Salam','Matheesha Pathirana','Sunil Narine'];
let kind='Batter',selected='Naman Dhir';
const $=s=>document.querySelector(s); const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>Number(v).toLocaleString('en-IN');
function getList(){let q=$('#search').value.toLowerCase().trim();let data=all.filter(p=>p.kind===kind&&p.name.toLowerCase().includes(q));const sort=$('#sort').value; if(sort==='rank')data.sort((a,b)=>a.rank-b.rank);else data.sort((a,b)=>b[sort]-a[sort]||a.rank-b.rank);return data}
function choose(name){selected=name;render()}
function setKind(k){kind=k;$('#batterBtn').classList.toggle('active',k==='Batter');$('#bowlerBtn').classList.toggle('active',k==='Bowler');selected=all.find(x=>x.kind===k).name;$('#search').value='';$('#sort').value='rank';render()}
function render(){const data=getList();$('#chartLabel').textContent=`Top 10 ${kind.toLowerCase()}s · pressure reliability score`;$('#metricHeader').textContent=kind==='Batter'?'Pressure SR':'Pressure econ';const max=Math.max(...data.map(x=>x.score),1);
$('#bars').innerHTML=data.length?data.map(p=>`<div class="bar-row ${kind==='Bowler'?'bowler':''} ${p.name===selected?'selected':''}" role="button" tabindex="0" data-player="${escapeHtml(p.name)}" aria-label="View ${escapeHtml(p.name)}"><div class="bar-label" title="${escapeHtml(p.name)}">${p.rank}. ${escapeHtml(p.name)}</div><div class="bar-track"><div class="bar-fill" style="width:${(p.score/max*100).toFixed(1)}%"></div></div><div class="bar-number">${p.score.toFixed(1)}</div></div>`).join(''):'<p class="empty">No matching players.</p>';
$('#rankTable').innerHTML=data.map(p=>`<tr data-player="${escapeHtml(p.name)}" class="${p.name===selected?'selected':''}"><td class="rank">#${p.rank}</td><td class="name">${escapeHtml(p.name)}</td><td class="score">${p.score.toFixed(1)}</td><td>${fmt(p.balls)}</td><td>${p.matches}</td><td><span class="metric-pill">${p.metric}${kind==='Batter'?'':' '}</span></td><td>${p.consistency}%</td><td>${fmt(p.ipl)}</td></tr>`).join('');
const p=all.find(x=>x.name===selected&&x.kind===kind)||data[0];if(p){$('#playerPanel').innerHTML=`<div class="small-label">Player profile · ${p.kind.toLowerCase()}</div><div class="player-top"><div><h3>${escapeHtml(p.name)}</h3><span>#${p.rank} in ${p.kind.toLowerCase()} rankings · ${escapeHtml(p.role)}</span></div><div class="score-box"><strong>${p.score.toFixed(1)}</strong><small>RELIABILITY</small></div></div><div class="player-metrics"><div class="mini"><strong>${fmt(p.balls)}</strong><span>Pressure balls</span></div><div class="mini"><strong>${p.matches}</strong><span>Pressure matches</span></div><div class="mini"><strong>${p.consistency}%</strong><span>Positive qualifying matches</span></div><div class="mini"><strong>${kind==='Batter'?p.metric+' SR':p.metric.toFixed(1)+' econ'}</strong><span>${kind==='Batter'?'Runs / 100 pressure batter balls':'Runs / 6 pressure legal balls'}</span></div></div><div class="recommend"><strong>Potential RR role:</strong> ${escapeHtml(p.fit)}</div><p class="footnote">IPL pressure exposure in the dataset: ${fmt(p.ipl)} balls. Rank is evidence of past performance, not a prediction of availability.</p>`}else{$('#playerPanel').innerHTML='<p class="empty">Select a player to view their profile.</p>'}
$('#bars').querySelectorAll('[data-player]').forEach(el=>{el.onclick=()=>choose(el.dataset.player);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(el.dataset.player)}}});$('#rankTable').querySelectorAll('[data-player]').forEach(el=>el.onclick=()=>choose(el.dataset.player));}
function renderWatch(){const items=watchNames.map(name=>all.find(p=>p.name===name));$('#watchlist').innerHTML=items.map(p=>`<article class="fit-card"><span class="sub">${p.kind} · report rank #${p.rank}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.fit)}</p><footer><span><b>${p.score.toFixed(1)}</b> score</span><span>${fmt(p.ipl)} IPL pressure balls</span></footer></article>`).join('')}
function populateCompare(){const k=$('#compareKind').value,arr=all.filter(x=>x.kind===k);for(let id of ['#p1','#p2']){$(id).innerHTML=arr.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('')}$('#p1').value=arr[0].name;$('#p2').value=arr[1].name;renderComparison()}
function renderComparison(){const a=all.find(p=>p.name===$('#p1').value),b=all.find(p=>p.name===$('#p2').value);if(!a||!b)return;const max=(x,y)=>Math.max(x,y,1);let metrics=[['Reliability score','score',''],['Pressure balls','balls',''],['Pressure matches','matches',''],['Consistency','consistency','%'],['IPL pressure balls','ipl','']];if(a.kind==='Batter')metrics.splice(1,0,['Pressure strike rate','metric','']);else metrics.splice(1,0,['Pressure economy ↓','metric','']);$('#comparison').innerHTML=`<div class="compare-line"><span>Metric</span><strong style="color:var(--pink)">${escapeHtml(a.name)}</strong><strong style="color:var(--gold)">${escapeHtml(b.name)}</strong></div>`+metrics.map(([label,key,suffix])=>{const scale=max(a[key],b[key]);return `<div class="compare-line"><span>${label}</span><div><strong>${fmt(a[key])}${suffix}</strong><div class="compare-track"><i style="width:${a[key]/scale*100}%"></i></div></div><div><strong>${fmt(b[key])}${suffix}</strong><div class="compare-track gold"><i style="width:${b[key]/scale*100}%"></i></div></div></div>`}).join('')}
async function loadPlayers(){
  // GitHub Pages cannot host a Python backend; this bundled snapshot works by itself.
  // Optionally set window.RR_API_BASE in config.js to read from a deployed FastAPI service.
  const api=String(window.RR_API_BASE||'').trim().replace(/\/$/,'');
  if(api){
    try{const result=await fetch(api+'/api/players',{signal:AbortSignal.timeout(6000)});if(!result.ok)throw new Error('API '+result.status);const payload=await result.json();if(!Array.isArray(payload)||payload.length<20)throw new Error('Invalid response');return payload}
    catch(error){console.warn('API unavailable, loading bundled report data:',error)}
  }
  const local=await fetch('./data/players.json');if(!local.ok)throw new Error('Could not load bundled players JSON');return await local.json();
}
async function boot(){
  try{
    all=await loadPlayers();
    $('#batterBtn').onclick=()=>setKind('Batter');$('#bowlerBtn').onclick=()=>setKind('Bowler');
    $('#search').oninput=render;$('#sort').onchange=render;$('#compareKind').onchange=populateCompare;
    $('#p1').onchange=renderComparison;$('#p2').onchange=renderComparison;
    render();renderWatch();populateCompare();
  }catch(error){console.error(error);$('#bars').textContent='Unable to load player data. Open this dashboard via a web server (not file://).';}
}
boot();

