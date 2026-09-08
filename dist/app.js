'use strict';
const $=s=>document.querySelector(s);
const termById=Object.fromEntries(TERMS.map(t=>[t.id,t]));
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceLink=id=>{const s=SOURCES[id];return `<a href="${s[1]}" target="_blank" rel="noopener noreferrer">${escapeHTML(s[0])} ↗</a>`};
let selectedTerm='wafer',selectedLayer=0;
$('#termcount').textContent=`${TERMS.length} 組名詞`;
function renderLayers(){
 $('#layers').innerHTML=LAYERS.map((l,i)=>`<button data-layer="${i}" class="${i===selectedLayer?'active':''}" style="--layer:${l[4]}" aria-pressed="${i===selectedLayer}"><span class="number">0${i+1}</span><b>${l[0]}</b><small>${l[1]}</small></button>`).join('');
 $('#layer-caption').textContent=`0${selectedLayer+1} / ${LAYERS[selectedLayer][0]}`;
 $('#terms').innerHTML=TERMS.filter(t=>t.layer===selectedLayer).map(t=>`<button data-term="${t.id}" aria-pressed="${t.id===selectedTerm}" class="${t.id===selectedTerm?'active':''}">${t.title}<small>${t.en}</small></button>`).join('');
}
function companyRows(ids){return ids.map(id=>{const c=COMPANIES[id];return `<tr><td><a target="_blank" rel="noopener noreferrer" href="${SOURCES[c[4]][1]}">${c[0]} ↗</a><span class="code">${c[1]}</span></td><td>${c[2]}</td><td>${c[3]}</td></tr>`}).join('')}
function renderTerm(id,scroll=false){
 const t=termById[id];if(!t)return;selectedTerm=id;selectedLayer=t.layer;renderLayers();
 $('#detail').innerHTML=`<div class="eyebrow">${LAYERS[t.layer][0]} / ${t.id.toUpperCase()}</div><h3 tabindex="-1" id="detail-title">${t.title}</h3><p class="english">${t.en}</p><p class="takeaway">${t.one}</p><p>${t.body}</p><div class="analogy"><b>換個方式理解</b>${t.analogy}</div><div class="roles"><div><h4>與台積電的關係</h4><p>${t.tsmc}</p></div><div><h4>與輝達的關係</h4><p>${t.nvidia}</p></div></div><div class="invest"><h4>讀投資新聞時，追問這件事</h4><p>${t.invest}</p></div><div class="pitfall"><h4>容易混淆</h4><p>${t.pitfall}</p></div><div class="companies"><h4>台股代表公司 · 依產品領域列舉</h4><div class="table-wrap"><table><thead><tr><th>公司／代號</th><th>市場</th><th>本頁對應角色</th></tr></thead><tbody>${companyRows(t.companies)}</tbody></table></div><p class="small">產品領域相符不等於供貨特定平台。只有官方明示的合作才作合作解讀；未列公司不代表不在產業鏈內。</p></div><div class="source-links">${t.sources.map(sourceLink).join('')}</div><div class="related"><span>接著理解</span>${t.related.map(id=>`<button data-term="${id}" data-scroll="true">${termById[id].title} ↗</button>`).join('')}</div>`;
 if(scroll){$('#detail').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('#detail-title').focus({preventScroll:true})}
}
document.addEventListener('click',e=>{
 const term=e.target.closest('[data-term]');if(term)renderTerm(term.dataset.term,term.dataset.scroll==='true');
 const layer=e.target.closest('[data-layer]');if(layer){renderTerm(LAYERS[Number(layer.dataset.layer)][2]);}
 const view=e.target.closest('[data-scene]');if(view)setScene(view.dataset.scene);
 const part=e.target.closest('[data-part]');if(part)selectPart(part.dataset.part,true);
});
const power=$('#power');function updatePower(){const p=Number(power.value);$('#power-label').textContent=`${p} kW`;$('#amps54').textContent=`${Math.round(p*1000/54).toLocaleString()} A`;$('#amps800').textContent=`${(p*1000/800).toLocaleString()} A`;}
power.addEventListener('input',updatePower);updatePower();
const stackItems=[['gpu','運算裸晶 ＋ HBM','最上方：運算晶片與記憶體靠近配置。HBM 是堆疊 DRAM，不是下面的載板。'],['interposer','中介層 / Interposer','中介層：提供裸晶與 HBM 之間的高密度互連；CoWoS-S、R、L 的做法不同。'],['substrate','IC 載板 / Package Substrate','IC 載板：承接封裝，把極細接點連到系統板。ABF 是這類載板可能使用的增層絕緣膜。'],['pcb','系統 PCB / Server Board','PCB：承載已封裝的晶片及其他元件。CCL 是製造它的原料，並非額外裝在下面的成品板。']];
$('#stack').innerHTML=stackItems.map((s,i)=>`<button data-stack="${i}" aria-pressed="${i===0}" class="${i===0?'active':''}">${s[1]}</button>`).join('');
function updateStack(i){$('#stack-note').textContent=stackItems[i][2];document.querySelectorAll('[data-stack]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.stack)===i);b.setAttribute('aria-pressed',String(Number(b.dataset.stack)===i))})}updateStack(0);
$('#stack').addEventListener('click',e=>{const b=e.target.closest('[data-stack]');if(b)updateStack(Number(b.dataset.stack))});
$('#news-cases').innerHTML=NEWS_CASES.map(c=>`<article><h3>${c[0]}</h3><div class="translation">${c[1]}</div><p>${c[2]}</p>${c[3].map(id=>`<button data-term="${id}" data-scroll="true">${termById[id].title}</button>`).join('')}</article>`).join('');
$('#source-list').innerHTML=Object.entries(SOURCES).map(([id,s])=>`<details id="source-${id}"><summary>${s[0]}</summary><p>${s[2]}。<br>查閱日：2026-09-08<br>${sourceLink(id)}</p></details>`).join('');
window.SCENES={
 datacenter:{title:'算力的所在地',sub:'運算、網路與電力，共同維持 AI 運轉。',index:'01 / DATA CENTER',default:'rack',parts:[['rack','AI 運算機櫃','rack'],['switch','網路交換器',''],['hvdc','電力轉換與配電',''],['cooling','CDU 冷卻系統','']]},
 rack:{title:'一櫃，不只是一台電腦',sub:'點選抽屜式運算託盤，繼續走進系統。',index:'02 / RACK SYSTEM',default:'rack',parts:[['pcb','運算託盤與主機板','board'],['nvlink','互連交換託盤',''],['psu','電源模組',''],['cooling','冷卻液管路',''],['rack','機櫃框架','']]},
 board:{title:'晶片，需要一張連結全局的板',sub:'打開冷板，看看運算與記憶體怎麼配置。',index:'03 / SERVER BOARD',default:'pcb',parts:[['gpu','GPU 封裝','package'],['memory','CPU／系統記憶體',''],['network','高速連接埠',''],['cooling','晶片冷板',''],['pcb','PCB 板材','materials']]},
 package:{title:'把運算與資料，放在一起',sub:'拉開結構，區分 HBM、中介層與 IC 載板。',index:'04 / ADVANCED PACKAGING',default:'cowos',parts:[['gpu','GPU 裸晶','fab'],['hbm','HBM 堆疊',''],['interposer','中介層',''],['substrate','IC 載板',''],['pcb','系統 PCB','']]},
 materials:{title:'把電路板，拆到材料',sub:'銅箔、玻纖與樹脂，如何成為 CCL 與 PCB？',index:'05 / BOARD MATERIALS',default:'ccl',parts:[['copper','銅箔／銅線路',''],['glass','玻纖布骨架',''],['ccl','樹脂與 CCL',''],['drilling','鑽孔與層間連接',''],['dkdf','高速材料電性','']]},
 fab:{title:'從一片晶圓，開始運算的可能',sub:'方格是裸晶概念；奈米級電路不在此比例顯示。',index:'06 / SILICON WAFER',default:'wafer',parts:[['wafer','矽晶圓',''],['gpu','切分後的裸晶',''],['n2','二奈米製程',''],['asic','ASIC 設計服務','']]}
};
window.currentScene='datacenter';window.activePart='rack';
function renderSide(id){
 const t=termById[id],s=SCENES[window.currentScene];const p=s.parts.find(p=>p[0]===id);const next=p?.[2];
 $('#scene-side').innerHTML=`<div class="eyebrow">${LAYERS[t.layer][0]} / 點圖學概念</div><h2>${t.title}</h2><div class="english">${t.en}</div><p class="brief">${t.one}</p><p>${t.body}</p><div class="mini-title">台股代表 · 依產品領域</div><div class="mini-companies">${t.companies.map(id=>`<span>${COMPANIES[id][0]} ${COMPANIES[id][1]}</span>`).join('')}</div><p class="small">${id==='hbm'?'所列台股為封裝相關環節，非 HBM DRAM 直接製造商。':'不代表已供貨特定 NVIDIA 平台。'}</p>${next?`<button class="primary-btn" data-scene="${next}">深入${{rack:'機櫃',board:'主機板',package:'晶片封裝',materials:'板材剖面',fab:'晶圓製造'}[next]} →</button>`:''}<button class="text-btn" data-term="${id}" data-scroll="true">閱讀供應鏈角色與投資解說 ↗</button><div class="source-links">${sourceLink(t.sources[0])}</div>`;
 document.querySelectorAll('[data-part]').forEach(b=>{b.classList.toggle('active',b.dataset.part===id);b.setAttribute('aria-pressed',String(b.dataset.part===id))});
}
window.selectPart=function(id,drill=false){const s=SCENES[window.currentScene];const p=s.parts.find(p=>p[0]===id);if(!termById[id])return;window.activePart=id;if(drill&&p?.[2]){setScene(p[2]);return}renderSide(id);window.dispatchEvent(new CustomEvent('partselect',{detail:id}));};
window.setScene=function(name){if(!SCENES[name])return;window.currentScene=name;const s=SCENES[name];$('#scene-title').textContent=s.title;$('#scene-index').textContent=s.index;$('#scene-subtitle').textContent=s.sub;document.querySelectorAll('.scene-nav [data-scene]').forEach(b=>{b.classList.toggle('active',b.dataset.scene===name);b.setAttribute('aria-pressed',String(b.dataset.scene===name))});$('#scene-key').innerHTML=`<span>部件入口 /</span>`+s.parts.map(p=>`<button data-part="${p[0]}" aria-pressed="false">${p[1]}${p[2]?' ↗':''}</button>`).join('');$('#explode').value=name==='package'||name==='materials'?35:0;$('#explode-value').textContent=$('#explode').value+'%';window.activePart=s.default;renderSide(s.default);window.dispatchEvent(new CustomEvent('scenechange',{detail:name}));};
$('#explode').addEventListener('input',()=>{$('#explode-value').textContent=$('#explode').value+'%';window.dispatchEvent(new CustomEvent('explodechange',{detail:Number($('#explode').value)/100}));});
renderTerm('wafer');setScene('datacenter');
const infraSearch=$('#infra-search');infraSearch.addEventListener('input',()=>{const q=infraSearch.value.toLowerCase().trim();if(!q){$('#infra-results').innerHTML='';return}const hits=TERMS.filter(t=>[t.title,t.en,t.body,...t.companies.map(id=>COMPANIES[id].join(' '))].join(' ').toLowerCase().includes(q));$('#infra-results').innerHTML=hits.length?hits.map(t=>`<button data-term="${t.id}" data-scroll="true">${t.title}</button>`).join(''):'<p>找不到相符名詞，試試英文縮寫或公司代號。</p>'});
document.addEventListener('click',e=>{const b=e.target.closest('[data-term]');if(b)history.replaceState(null,'','#term='+b.dataset.term)});
function followTermHash(){if(location.hash.startsWith('#term=')){const id=decodeURIComponent(location.hash.slice(6));if(termById[id])renderTerm(id,true)}}followTermHash();window.addEventListener('hashchange',followTermHash);
