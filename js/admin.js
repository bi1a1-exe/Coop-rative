const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => (n % 1 ? n.toFixed(2) : n) + ' د.م.';

let orders = [];

const themeBtn = $('#themeBtn');
function applyTheme(t) {
  document.body.classList.toggle('light', t === 'light');
  localStorage.setItem('msb_theme', t);
  themeBtn.textContent = t === 'light' ? '🌙' : '☀️';
}
themeBtn.addEventListener('click', () => applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
(function initAdmTheme() {
  const sv = localStorage.getItem('msb_theme');
  if (sv) return applyTheme(sv);
  const h = new Date().getHours();
  applyTheme((h >= 20 || h < 6) ? 'light' : 'dark');
})();

const CLOUD = { on: false, sub: null, lastId: null };

function clUI() {
  const user = (window.FB && FB.auth && FB.auth.currentUser) || null;
  CLOUD.on = !!user;
  $('#clStatus').textContent = CLOUD.on ? '✅ Connecté: ' + user.email : '⚫ Mode local — les données ghir f had navigateur';
  $('#clLogin').style.display = CLOUD.on ? 'none' : 'block';
  $('#clConnected').style.display = CLOUD.on ? 'block' : 'none';
  if (CLOUD.on) startCloudOrders(); else stopCloudOrders();
}

$('#cloudBtn').addEventListener('click', () => { clUI(); $('#cloudModal').classList.add('open'); });
$('#cloudClose').addEventListener('click', () => $('#cloudModal').classList.remove('open'));
$('#cloudModal').addEventListener('click', e => { if (e.target.id === 'cloudModal') e.target.classList.remove('open'); });

$('#clConnect').addEventListener('click', async () => {
  if (!(window.FB && FB.auth)) { $('#clErr').textContent = '❌ Firebase makaynch — verifi internet'; return; }
  const em = $('#clEmail').value.trim(), pw = $('#clPass').value;
  if (!em || !pw) { $('#clErr').textContent = '⚠️ 3mer email w password'; return; }
  $('#clErr').textContent = '';
  try {
    await FB.auth.signInWithEmailAndPassword(em, pw);
    $('#clPass').value = '';
    clUI();
    toastOk('☁️ Connecté au Cloud!');
    seedIfEmpty();
    FB.db.collection('products').doc('__site__').get().then(d => {
      if (!d.exists) return;
const v = d.data();
      if (v.logo) localStorage.setItem('msb_logo', v.logo);
      if (Array.isArray(v.hero)) localStorage.setItem('msb_hero_imgs', JSON.stringify(v.hero));
      if (v.texts) localStorage.setItem('msb_texts', JSON.stringify(v.texts));
      paintIdn();
      paintTxt();
    }).catch(() => {});
  } catch (e) {
    $('#clErr').textContent =
      (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') ? '❌ Email wla password ghalat' :
      e.code === 'auth/too-many-requests' ? '⏳ Bezzaf d attempts — tsenna chwiya' :
      e.code === 'auth/network-request-failed' ? '❌ Mochkil f internet' : ('❌ ' + e.message);
  }
});

$('#clDisconnect').addEventListener('click', async () => {
  try { await FB.auth.signOut(); } catch(e) {}
  orders = [];
  clUI();
  refresh();
  toastOk('Déconnecté mn Cloud');
});

function startCloudOrders() {
  if (CLOUD.sub || !(window.FB && FB.db)) return;
  CLOUD.sub = FB.db.collection('orders').onSnapshot(snap => {
    orders = snap.docs.map(d => Object.assign({}, d.data(), { id: d.id }));
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const newestId = orders.length ? orders[0].id : null;
    if (CLOUD.lastId && newestId && newestId !== CLOUD.lastId) notify();
    if (newestId) CLOUD.lastId = newestId;
    paint();
  }, err => console.warn('orders sync:', err.code));
}
function stopCloudOrders() { if (CLOUD.sub) { CLOUD.sub(); CLOUD.sub = null; } }

async function seedIfEmpty() {
  if (!(window.FB && FB.db)) return;
  try {
    const snap = await FB.db.collection('products').get();
    const cloudIds = snap.docs.map(d => d.id);
    const local = allProds();
    const localIds = new Set(local.map(x => x.eff.id));
    const missing = cloudIds.filter(id => !localIds.has(id) && !id.startsWith('__'));
    let ok = false;
    if (missing.length) {
      ok = confirm(missing.length + ' produit(s) kaynin f Cloud ma kayninch f l\'admin dyalek.\nGhadi ytmshaw mn Cloud o les produits dyalek t-uploadaw.\nWakha?');
    } else {
      ok = confirm('N-synciw les produits dyal daba m3a Cloud?\n(Li kayn f admin howa li ghadi ybqa f internet)');
    }
    if (!ok) return;
    const batch = FB.db.batch();
    missing.forEach(id => batch.delete(FB.db.collection('products').doc(id)));
    local.forEach(({ eff }, i) => {
      const c = JSON.parse(JSON.stringify(eff));
      c.order = i;
      batch.set(FB.db.collection('products').doc(eff.id), c);
    });
    await batch.commit();
    toastOk('☁️ Cloud tsync m3a l\'admin!');
  } catch (e) { toastOk('⚠️ Sync: ' + (e.code || e.message)); }
}

$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const tab = t.dataset.tab;
  $('#tab-orders').style.display = tab === 'orders' ? 'block' : 'none';
  $('#tab-prods').style.display = tab === 'prods' ? 'block' : 'none';
  $('#tab-stats').style.display = tab === 'stats' ? 'block' : 'none';
  $('#tab-txt').style.display = tab === 'txt' ? 'block' : 'none';
  if (tab === 'prods') renderProds();
  if (tab === 'stats') renderStats();
  if (tab === 'orders') clearTitle();
}));

const PKEY = 'msb_prod_overrides';
const CKEY = 'msb_prod_custom';
function getOvr() { try { return JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch(e) { return {}; } }
function setOvr(o) { localStorage.setItem(PKEY, JSON.stringify(o)); }
function getCust() { try { return JSON.parse(localStorage.getItem(CKEY) || '[]'); } catch(e) { return []; } }
function setCust(c) { localStorage.setItem(CKEY, JSON.stringify(c)); }
const pendingImg = {};

function allProds() {
  const ovr = getOvr();
  const alive = x => !(ovr[x.id] && ovr[x.id].deleted);
  const base = PRODUCTS.filter(alive).map(p => ({ eff: Object.assign({}, p, ovr[p.id] || {}), custom: false }));
  const custr = getCust().filter(alive).map(c => ({ eff: Object.assign({}, c, ovr[c.id] || {}), custom: true }));
  return [...base, ...custr];
}

function renderProds() {
  $('#prodList').innerHTML = allProds().map(({ eff: e, custom }) => {
    const id = e.id;
    const vars = e.variants ? `
        <div class="pe-vars">${e.variants.map((v, i) => `
          <div class="pe-var-row">
            <input data-vl="${i}" value="${esc(v.label)}" placeholder="الحجم">
            <input data-vp="${i}" type="number" step="0.5" min="0" value="${v.price}" placeholder="الثمن">
          </div>`).join('')}
        </div>` : `
        <div class="pe-row">
          <input data-f="price" type="number" step="0.5" min="0" value="${e.price ?? ''}" placeholder="الثمن">
          <input data-f="unit" value="${esc(e.unit || '')}" placeholder="الوحدة">
        </div>`;
    return `<div class="pe-card${e.hidden ? ' off' : ''}" data-id="${id}"${custom ? ' data-custom="1"' : ''}>
      <div class="pe-media">
        ${e.img ? `<img src="${e.img}" id="pv-${id}" alt="">` : `<div class="pe-emoji" id="pv-${id}">${e.emoji}</div>`}
        <label class="pe-up">📷 بدّل التصويرة<input type="file" accept="image/*" data-img="${id}" hidden></label>
      </div>
      <div class="pe-fields">
        <input data-f="name" value="${esc(e.name)}" placeholder="سمية المنتج">
        ${vars}
        <textarea data-f="desc" rows="2">${esc(e.desc)}</textarea>
        <div class="pe-foot">
          <label class="pe-vis"><input type="checkbox" data-f="vis" ${e.hidden ? '' : 'checked'}> ظاهر فالسايت</label>
          <div class="pe-foot-btns">
            <button class="pe-del" data-delprod="${id}" title="مسح المنتج">🗑️</button>
            <button class="pe-save" data-save="${id}">💾 سجّل</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function resizeImg(file, cb) {
  const img = new Image();
  img.onload = () => {
    const max = 700;
    let w = img.width, h = img.height;
    if (w > max || h > max) { const r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    cb(c.toDataURL('image/jpeg', .82));
  };
img.onerror = () => toastOk('❌ التصويرة ما قدرتش تقرا');
  img.src = URL.createObjectURL(file);
}
async function saveSite(obj) {
  const g = p => {
    const o = {};
    Object.keys(p).forEach(k => {
      const v = p[k];
      if (v === undefined || v === null) { o[k] = ''; return; }
      if (typeof v === 'string') o[k] = v;
      else if (Array.isArray(v)) o[k] = v.map(x => (x === undefined || x === null) ? '' : x);
      else if (typeof v === 'object') o[k] = g(v);
      else o[k] = v;
    });
    return o;
  };
  const clean = g(obj);
  clean.ver = Math.floor(Date.now() / 1000);
  let size = 0;
  try { size = new Blob([JSON.stringify(clean)]).size; } catch(e) {}
  if (size > 900000) { throw { code: 'too-large', message: 'الملف كبار (تصاور بزاف). صغّر التصاور وبِدّل مرة أخرى.' }; }
  try {
    await FB.db.collection('products').doc('__site__').set(clean);
  } catch (err) {
    const det = {};
    ['texts','logo','hero'].forEach(f => {
      try { det[f] = JSON.stringify(clean[f]).length + ' حرف'; } catch(e) { det[f] = '؟'; }
    });
    throw { code: err.code || '?', message: 'خطأ فالكلاود ' + (err.code || err.message) + '. الحجم: logo=' + det.logo + ', hero=' + det.hero + ', texts=' + det.texts };
  }
}

$('#prodList').addEventListener('change', e => {
  const f = e.target.closest('input[data-img]');
  if (!f) return;
  const id = f.dataset.img, file = f.files[0];
  if (!file) return;
  resizeImg(file, url => {
    pendingImg[id] = url;
    document.getElementById('pv-' + id).outerHTML = `<img src="${url}" id="pv-${id}" alt="">`;
    toastOk('📸 التصويرة تبدلات — ديّر «سجّل» باش تتأكد');
  });
});

$('#prodList').addEventListener('click', e => {
  const del = e.target.closest('[data-delprod]');
  if (del) {
    if (!confirm('واش متأكد بغيتي تمسح هاد المنتج نهائياً؟')) return;
    const id = del.dataset.delprod;
    const isCustom = del.closest('.pe-card').dataset.custom === '1';
    if (isCustom) {
      setCust(getCust().filter(x => x.id !== id));
      const ovr = getOvr();
      delete ovr[id];
      setOvr(ovr);
    } else {
      const ovr = getOvr();
      ovr[id] = Object.assign({}, ovr[id] || {}, { deleted: true });
      setOvr(ovr);
    }
    if (CLOUD.on && window.FB && FB.db) FB.db.collection('products').doc(id).delete().catch(() => {});
    renderProds();
    toastOk('🗑️ المنتج تمسح');
    return;
  }
  const b = e.target.closest('[data-save]');
  if (!b) return;
  const id = b.dataset.save;
  const card = document.querySelector(`.pe-card[data-id="${id}"]`);
  const get = f => card.querySelector(`[data-f="${f}"]`);
  const ovr = getOvr();
  const cur = Object.assign({}, allProds().find(x => x.eff.id === id).eff);
  cur.name = get('name').value.trim() || cur.name;
  cur.desc = get('desc').value.trim();
  cur.hidden = !get('vis').checked;
  if (cur.variants) {
    const vs = [...card.querySelectorAll('[data-vl]')].map(inp => ({
      label: inp.value.trim() || 'حجم',
      price: Math.max(0, parseFloat(card.querySelector(`[data-vp="${inp.dataset.vl}"]`).value)) || 0
    }));
    if (vs.length) cur.variants = vs;
  } else {
    cur.price = Math.max(0, parseFloat(get('price').value)) || cur.price || 0;
    cur.unit = get('unit').value.trim() || cur.unit || '';
  }
  if (pendingImg[id]) { cur.img = pendingImg[id]; delete pendingImg[id]; }
  ovr[id] = cur;
  setOvr(ovr);
  card.classList.toggle('off', cur.hidden);
  if (CLOUD.on && window.FB && FB.db) {
    const c = JSON.parse(JSON.stringify(cur));
    c.order = allProds().findIndex(x => x.eff.id === id);
    FB.db.collection('products').doc(id).set(c)
      .then(() => toastOk('☁️ تسجل f Cloud — ban l kolchi!'))
      .catch(err => toastOk('⚠️ Cloud: ' + (err.code || err.message)));
    return;
  }
  toastOk('✅ تسجل! البدلات بانو فالسايت الرئيسي');
});

$('#addProdBtn').addEventListener('click', () => {
  const f = $('#newProdForm');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
  if (f.style.display === 'block') $('#npName').focus();
});

$('#npCancel').addEventListener('click', () => { $('#newProdForm').style.display = 'none'; });

function npVarsUI() {
  const isM = $('#npCat').value === 'ma2kulat';
  $('#npVarsBox').style.display = isM ? 'block' : 'none';
  $('#npPriceLbl').style.opacity = isM ? .45 : 1;
  $('#npPrice').disabled = isM;
  if (isM) { $('#npPrice').value = ''; $('#npPrice').required = false; }
  else {
    $('#npPrice').required = true;
    ['npV1','npV2','npV3'].forEach(id => $('#' + id).value = '');
  }
}
$('#npCat').addEventListener('change', npVarsUI);

$('#npImg').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  resizeImg(file, url => {
    pendingImg['__new'] = url;
    $('#npImgPrev').innerHTML = `<img src="${url}" alt="">`;
    toastOk('📸 التصويرة واجدة — غالي ضغط «سجّل المنتج»');
  });
});

$('#newProdForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#npName').value.trim();
  const cat = $('#npCat').value;
  let np = {
    id: 'c' + Date.now().toString(36),
    name,
    cat,
    unit: $('#npUnit').value.trim() || '',
    desc: $('#npDesc').value.trim(),
    emoji: $('#npEmoji').value.trim() || '✨',
    img: pendingImg['__new'] || ''
  };
  if (cat === 'ma2kulat') {
    const v1 = parseFloat($('#npV1').value), v2 = parseFloat($('#npV2').value), v3 = parseFloat($('#npV3').value);
    if (isNaN(v1) || v1 <= 0) return toastOk('⚠️ عمّر ثمن الطبق الفردي على الأقل');
    np.variants = [{ label: 'فردي — شخص واحد', price: Math.max(0, v1) }];
    np.variants.push({ label: 'لشخصين', price: isNaN(v2) || v2 <= 0 ? Math.round(v1 * 2 * 10) / 10 : Math.max(0, v2) });
    np.variants.push({ label: 'عائلي — 5-6 أشخاص', price: isNaN(v3) || v3 <= 0 ? Math.round(v1 * 4 * 10) / 10 : Math.max(0, v3) });
    np.ph = 'ph-cous';
  } else {
    const price = parseFloat($('#npPrice').value);
    if (isNaN(price)) return toastOk('⚠️ السمية والثمن ضروريين');
    np.price = Math.max(0, price);
  }
  delete pendingImg['__new'];
  const cust = getCust();
  cust.push(np);
  setCust(cust);
  if (CLOUD.on && window.FB && FB.db) {
    const c = JSON.parse(JSON.stringify(np));
    c.order = PRODUCTS.length + cust.length;
    FB.db.collection('products').doc(np.id).set(c)
      .then(() => toastOk('☁️ المنتج الجديد t-uploada l Cloud!'))
      .catch(err => toastOk('⚠️ Cloud: ' + (err.code || err.message)));
  }
  e.target.reset();
  e.target.style.display = 'none';
  $('#npImgPrev').innerHTML = '';
  npVarsUI();
  renderProds();
  toastOk('🎉 المنتج الجديد تزاد وكيبان فالسايت!');
});

/* ===== 🎨 هوية الموقع (لوگو + تصاور الواجهة) ===== */
function idnGet() { try { return JSON.parse(localStorage.getItem('msb_hero_imgs') || 'null') || []; } catch(e) { return []; } }
function paintIdn() {
  const logo = localStorage.getItem('msb_logo');
  const pl = $('#prevLogo');
  pl.innerHTML = logo ? `<img src="${logo}" alt="">` : '🫓';
  const hero = idnGet();
  for (let i = 0; i < 3; i++) {
    const el = $('#prevHero' + i), u = hero[i];
    el.innerHTML = u ? `<img src="${u}" alt="">` : ['🫓','🍞','🍬'][i];
  }
}
async function saveIdentity(patch) {
  const cur = { logo: localStorage.getItem('msb_logo') || '', hero: idnGet() };
  Object.assign(cur, patch);
  localStorage.setItem('msb_logo', cur.logo || '');
  localStorage.setItem('msb_hero_imgs', JSON.stringify(cur.hero));
  paintIdn();
  if (CLOUD.on && window.FB && FB.db) {
try {
      await saveSite(cur);
      toastOk('☁️ الهوية تبانات لجميع الزوار!');
    } catch (err) { toastOk('⚠️ Cloud: ' + (err.code || err.message)); }
  } else {
    toastOk('✅ تبدلت! (ربطي ☁️ باش يبانو للزوار فكل الأجهزة)');
  }
}
$$('[data-idn]').forEach(inp => inp.addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const which = inp.dataset.idn;
  resizeImg(f, url => {
    if (which === 'logo') saveIdentity({ logo: url });
    else {
      const hero = idnGet();
      while (hero.length < 3) hero.push('');
      hero[+which.slice(4)] = url;
      saveIdentity({ hero });
    }
  });
  inp.value = '';
}));
$$('[data-idnx]').forEach(b => b.addEventListener('click', () => {
  const which = b.dataset.idnx;
  if (which === 'logo') saveIdentity({ logo: '' });
  else {
    const hero = idnGet();
    while (hero.length < 3) hero.push('');
    hero[+which.slice(4)] = '';
    saveIdentity({ hero });
  }
}));
paintIdn();

$('#resetProds').addEventListener('click', async () => {
  if (!confirm('واش ترجع جميع المنتجات كيما كانو بالضبط؟')) return;
  localStorage.removeItem(PKEY);
  Object.keys(pendingImg).forEach(k => delete pendingImg[k]);
  renderProds();
  if (CLOUD.on && window.FB && FB.db) {
    try {
      const qs = await FB.db.collection('products').get();
      const batch = FB.db.batch();
      qs.forEach(d => { if (!d.id.startsWith('__')) batch.delete(d.ref); });
      allProds().forEach(({ eff }, i) => {
        const c = JSON.parse(JSON.stringify(eff));
        c.order = i;
        batch.set(FB.db.collection('products').doc(eff.id), c);
      });
      await batch.commit();
      toastOk('☁️ Cloud rj3 l les produits l\'aslin');
      return;
    } catch (err) { toastOk('⚠️ ' + (err.code || err.message)); }
  }
  toastOk('↩️ رجعو كيما كانو');
});

function load() {
  try { orders = JSON.parse(localStorage.getItem('msb_orders') || '[]'); }
  catch(e) { orders = []; }
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function save() { localStorage.setItem('msb_orders', JSON.stringify(orders)); }

function showLogin() { $('#loginBox').style.display = 'flex'; $('#dash').style.display = 'none'; $('#pwd').value = ''; }
function showDash() { $('#loginBox').style.display = 'none'; $('#dash').style.display = 'block'; refresh(); clUI(); }

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  if ($('#pwd').value === ADMIN_PASSWORD) {
    sessionStorage.setItem('msb_admin', '1');
    showDash();
  } else {
    $('#loginErr').textContent = '❌ كلمة المرور غالطة!';
    const c = $('.login-card');
    c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
  }
});

$('#logoutBtn').addEventListener('click', () => { sessionStorage.removeItem('msb_admin'); showLogin(); });
$('#refreshBtn').addEventListener('click', () => { refresh(); toastOk('✅ تحدثت القائمة'); });
$('#q').addEventListener('input', refresh);
$('#fStatus').addEventListener('change', refresh);
$('#fPeriod').addEventListener('change', refresh);

function statusClass(s) {
  return { 'جديد':'st-new','مؤكد':'st-ok','تم التسليم':'st-done','ملغي':'st-cancel' }[s] || 'st-new';
}

function fmtDT(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ar-MA') + '<br><small style="color:var(--mut)">' + d.toLocaleTimeString('ar-MA', { hour:'2-digit', minute:'2-digit' }) + '</small>';
}

function filtered() {
  const q = $('#q').value.trim().toLowerCase();
  const st = $('#fStatus').value;
  const per = $('#fPeriod').value;
  let start = null;
  if (per === 'today') { const n = new Date(); start = new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  if (per === 'week') start = new Date(Date.now() - 7 * 864e5);
  return orders.filter(o => {
    if (st && o.status !== st) return false;
    if (start && new Date(o.createdAt) < start) return false;
    if (!q) return true;
    return (o.id + o.name + o.phone + o.address).toLowerCase().includes(q);
  });
}

function paint() {
  $('#stTotal').textContent = orders.length.toLocaleString('ar-MA');
  const today = new Date().toDateString();
  $('#stToday').textContent = orders.filter(o => new Date(o.createdAt).toDateString() === today).length.toLocaleString('ar-MA');
  $('#stRevenue').textContent = money(orders.filter(o => o.status !== 'ملغي').reduce((s, o) => s + o.total, 0));
  $('#stClients').textContent = new Set(orders.map(o => o.phone)).size.toLocaleString('ar-MA');

  const list = filtered();
  $('#emptyTbl').style.display = list.length ? 'none' : 'block';
  const ipCount = {};
  list.forEach(o => { const ip = o.meta && o.meta.ip; if (ip) ipCount[ip] = (ipCount[ip] || 0) + 1; });
  $('#tbody').innerHTML = list.map((o, i) => {
    const ipN = o.meta && o.meta.ip ? ipCount[o.meta.ip] : 0;
    return `
    <tr${ipN >= 3 ? ' class="tr-warn"' : ''}>
      <td class="t-id" data-l="رقم الطلب">${o.id}</td>
      <td data-l="الزبون"><span class="t-name">${esc(o.name)}</span><br><a class="t-phone" href="tel:${esc(o.phone)}">${esc(o.phone)}</a></td>
      <td class="t-addr" data-l="العنوان">${esc(o.address)}<a class="t-map" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address + ' الهرهورة')}" title="شوف فالخريطة">🗺️</a></td>
      <td class="t-items" data-l="الطلب">${o.items.map(it => `${it.emoji} <b>${esc(it.name)}</b> × ${it.qty}`).join('<br>')}${o.note ? `<br>📝 ${esc(o.note)}` : ''}${o.meta ? `<div class="t-meta">🌐 ${esc(o.meta.ip || '—')}${o.meta.geo ? ' • ' + esc(o.meta.geo) : ''} • ${esc(o.meta.dev || '')}</div>` : ''}${ipN > 1 ? (ipN >= 3 ? `<div class="t-warn red">🚨 هاد الـIP دار ${ipN} طلبات — لاعب مؤكد!</div>` : `<div class="t-warn">⚠️ هاد الـIP دار ${ipN} طلبات — يمكن لاعب!</div>`) : ''}</td>
      <td class="t-tot" data-l="المجموع">${money(o.total)}</td>
      <td class="t-date" data-l="الموعد المطلوب">📅 ${esc(o.date)}<br>⏰ ${esc(o.slot)}</td>
      <td data-l="وقت الطلب">${fmtDT(o.createdAt)}</td>
      <td class="t-status" data-l="الحالة">
        <select data-id="${o.id}" class="${statusClass(o.status)}">
          ${['جديد','مؤكد','تم التسليم','ملغي'].map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
      <td data-l=""><div class="row-btns"><button class="t-print" data-print="${o.id}" title="طباعة التذكرة">🖨️</button><button class="t-del" data-del="${o.id}" title="حذف">🗑️</button></div></td>
    </tr>`;
  }).join('');

  if ($('#tab-stats').style.display !== 'none') renderStats();
}

function refresh() {
  if (CLOUD.on) return;
  load();
  paint();
}

function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

$('#tbody').addEventListener('change', e => {
  const sel = e.target.closest('select[data-id]');
  if (!sel) return;
  if (CLOUD.on && window.FB && FB.db) {
    FB.db.collection('orders').doc(sel.dataset.id).update({ status: sel.value })
      .then(() => toastOk('☁️ الحالة تبدلات'))
      .catch(err => toastOk('⚠️ ' + (err.code || err.message)));
    return;
  }
  const o = orders.find(x => x.id === sel.dataset.id);
  if (o) { o.status = sel.value; save(); refresh(); toastOk('الحالة تبدلات ✅'); }
});

$('#tbody').addEventListener('click', e => {
  const pb = e.target.closest('button[data-print]');
  if (pb) { printTicket(pb.dataset.print); return; }
  const b = e.target.closest('button[data-del]');
  if (!b) return;
  if (!confirm('واش متأكد بغيتي تحيد هاد الطلب؟')) return;
  if (CLOUD.on && window.FB && FB.db) {
    FB.db.collection('orders').doc(b.dataset.del).delete()
      .then(() => toastOk('☁️ الطلب تحيد'))
      .catch(err => toastOk('⚠️ ' + (err.code || err.message)));
    return;
  }
  orders = orders.filter(x => x.id !== b.dataset.del);
  save(); refresh(); toastOk('الطلب تحيد 🗑️');
});

$('#clearBtn').addEventListener('click', async () => {
  if (!orders.length) return toastOk('ما كاين ما يتحيد');
  if (!confirm('⚠️ غادي تحيد جميع الطلبات! واش متأكد؟')) return;
  if (!confirm('متأكد 100%؟ هاد العملية ما كاين لها رجعة!')) return;
  if (CLOUD.on && window.FB && FB.db) {
    try {
      const qs = await FB.db.collection('orders').get();
      const batch = FB.db.batch();
      qs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      toastOk('☁️ تحيدو كلشي');
    } catch (err) { toastOk('⚠️ ' + (err.code || err.message)); }
    return;
  }
  orders = [];
  save(); refresh(); toastOk('تحيدو كلشي 🗑️');
});

$('#csvBtn').addEventListener('click', () => {
  if (!orders.length) return toastOk('ما كاين حتى طلب باش تصدر');
  const head = ['رقم الطلب','الاسم','الهاتف','العنوان','نوع الطلب','نهار الطلب','الوقت','المنتجات','المجموع (د.م.)','الحالة','وقت تسجيل الطلب','ملاحظة'];
  const rows = orders.map(o => [
    o.id, o.name, o.phone, o.address,
    o.dtype === 'delivery' ? 'توصيل' : 'استلام',
    o.date, o.slot,
    o.items.map(i => `${i.name} x${i.qty}`).join(' | '),
    o.total, o.status,
    new Date(o.createdAt).toLocaleString('ar-MA'),
    o.note || ''
  ]);
  const csv = '\uFEFF' + [head, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'commandes-mostakbal-' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  toastOk('⬇️ تصدر الملف');
});

/* ===== 💾 Backup / Restore ===== */
$('#bkBtn').addEventListener('click', () => {
  const data = { v: 1, date: new Date().toISOString(), orders, ovr: getOvr(), cust: getCust() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'mostakbal-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toastOk('💾 النسخة الاحتياطية تسدرات');
});

$('#rsBtn').addEventListener('click', () => $('#rsFile').click());

$('#rsFile').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.orders)) throw new Error('bad');
    if (!confirm(`استرجاع ${d.orders.length} طلب (نسخة ديال ${(d.date || '').slice(0, 10) || '?'})؟\nالطلبات الحالية غادي يبقاو، الجداد من النسخة غادي يتزادو.`)) return;
    const map = new Map(orders.map(o => [o.id, o]));
    d.orders.forEach(o => { if (o && o.id) map.set(o.id, o); });
    orders = [...map.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    save();
    if (d.ovr && typeof d.ovr === 'object') setOvr(d.ovr);
    if (Array.isArray(d.cust)) setCust(d.cust);
    if (CLOUD.on && window.FB && FB.db) {
      try {
        const b = FB.db.batch();
        orders.forEach(o => b.set(FB.db.collection('orders').doc(o.id), JSON.parse(JSON.stringify(o))));
        await b.commit();
        toastOk('☁️ ترجعت النسخة l Cloud!');
      } catch (err) { toastOk('⚠️ Cloud: ' + (err.code || err.message)); }
    } else {
      refresh();
      toastOk('✅ رجعت النسخة!');
    }
    renderProds();
  } catch (err) {
    toastOk('❌ الملف ماشي صالح');
  }
  e.target.value = '';
});

let tT;
function toastOk(m) {
  let t = $('.adm-toast');
  if (!t) { t = document.createElement('div'); t.className = 'adm-toast'; document.body.appendChild(t); }
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(tT);
  tT = setTimeout(() => t.classList.remove('show'), 2000);
}

const st = document.createElement('style');
st.textContent = '.adm-toast{position:fixed;top:18px;right:50%;transform:translate(50%,-130%);z-index:300;background:linear-gradient(135deg,#e8963d,#f2b95c);color:#2a1c0e;font-weight:800;padding:11px 24px;border-radius:99px;transition:transform .35s}.adm-toast.show{transform:translate(50%,0)}';
document.head.appendChild(st);

window.addEventListener('storage', e => {
  if (!CLOUD.on && $('#dash').style.display !== 'none') {
    if (e.key === 'msb_orders') notify();
    refresh();
  }
});
window.addEventListener('focus', () => {
  const ot = $('.tab[data-tab="orders"]');
  if (ot && ot.classList.contains('active')) clearTitle();
});

/* ===== 🔔 Son + badge titre ===== */
let audioCtx = null;
let unseen = 0;
const baseTitle = document.title;
function bumpTitle() { unseen++; document.title = `(${unseen}) ${baseTitle}`; }
function clearTitle() { unseen = 0; document.title = baseTitle; }
function notify() { ring(); bumpTitle(); }
function ring() {
  if (localStorage.getItem('msb_mute') === '1') return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t0 = audioCtx.currentTime;
    [[880, 0], [1174.66, .22]].forEach(([f, dt]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(.35, t0 + dt + .03);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dt + .45);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t0 + dt); o.stop(t0 + dt + .5);
    });
  } catch(e) {}
}
const muteBtn = $('#muteBtn');
function muteUI() {
  const off = localStorage.getItem('msb_mute') === '1';
  muteBtn.textContent = off ? '🔕' : '🔔';
  muteBtn.classList.toggle('off', off);
}
muteBtn.addEventListener('click', () => {
  localStorage.setItem('msb_mute', localStorage.getItem('msb_mute') === '1' ? '0' : '1');
  muteUI();
  if (localStorage.getItem('msb_mute') !== '1') ring();
});
muteUI();

/* ===== 🖨️ Ticket cuisine ===== */
function printTicket(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const w = window.open('', '_blank', 'width=440,height=680');
  if (!w) { toastOk('⚠️ Sed les popups bach ykhdem l\'impression'); return; }
  w.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${o.id}</title>
<style>
body{font-family:'Cairo',Tahoma,sans-serif;padding:16px;color:#000;width:300px;margin:auto}
.hd{text-align:center;border-bottom:2px dashed #000;padding-bottom:8px;margin-bottom:10px}
.hd b{font-size:20px}.hd small{display:block;font-size:11px;margin-top:2px}
.info{font-size:13px;line-height:1.9;margin-bottom:8px}
table{width:100%;border-collapse:collapse;font-size:14px}
td{padding:5px 0;border-bottom:1px dotted #999}
.r{text-align:left;font-weight:bold;white-space:nowrap}
.tot{font-size:17px;font-weight:900;border-top:2px solid #000;margin-top:6px;padding-top:7px;display:flex;justify-content:space-between}
.note{font-size:13px;margin-top:8px;background:#f3f3f3;padding:7px;border-radius:6px}
@media print{body{padding:4px}}
</style></head><body>
<div class="hd"><b>🫓 تعاونية المستقبل</b><small>لإنتاج الخبز والحلويات — الهرهورة</small><small>${new Date(o.createdAt).toLocaleString('ar-MA')}</small></div>
<div class="info">
🧾 <b>${o.id}</b> — ${o.dtype === 'delivery' ? '🛵 توصيل' : '🏪 استلام'}<br>
👤 ${esc(o.name)} — <span dir="ltr">${esc(o.phone)}</span><br>
📍 ${esc(o.address)}<br>
📅 ${esc(o.date)} — ⏰ ${esc(o.slot)}
</div>
<table>${(o.items || []).map(i => `<tr><td>${i.emoji} ${esc(i.name)}</td><td>× ${i.qty}</td><td class="r">${(i.price * i.qty) % 1 ? (i.price * i.qty).toFixed(2) : i.price * i.qty}</td></tr>`).join('')}</table>
<div class="tot"><span>المجموع</span><span>${o.total % 1 ? o.total.toFixed(2) : o.total} د.م.</span></div>
${o.note ? `<div class="note">📝 ${esc(o.note)}</div>` : ''}
<script>window.onload=function(){setTimeout(function(){window.print()},350)}<\/script>
</body></html>`);
  w.document.close();
}

/* ===== 📊 Statistiques ===== */
function renderStats() {
  const valid = orders.filter(o => o.status !== 'ملغي');

  const map = {};
  valid.forEach(o => (o.items || []).forEach(it => {
    const k = it.name;
    map[k] = map[k] || { qty: 0, rev: 0, emoji: it.emoji || '' };
    map[k].qty += it.qty;
    map[k].rev += it.qty * it.price;
  }));
  const top = Object.entries(map).sort((a, b) => b[1].qty - a[1].qty).slice(0, 8);
  const max = top.length ? top[0][1].qty : 1;
  $('#topProds').innerHTML = top.length ? top.map(([n, v]) => `
    <div class="bar-row">
      <span class="bar-name">${v.emoji} ${esc(n)}</span>
      <div class="bar-track"><i style="width:${Math.round(v.qty / max * 100)}%"></i></div>
      <b class="bar-val">${v.qty}</b>
    </div>`).join('') : '<p class="empty-mini">ما كاين حتى طلب دابا</p>';

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push({ key: d.toDateString(), lbl: d.toLocaleDateString('ar-MA', { weekday: 'short' }), n: 0, rev: 0 });
  }
  valid.forEach(o => {
    const f = days.find(x => x.key === new Date(o.createdAt).toDateString());
    if (f) { f.n++; f.rev += o.total; }
  });
  const mx = Math.max(1, ...days.map(d => d.n));
  $('#weekChart').innerHTML = days.map(d => `
    <div class="wc-col" title="${d.n} commandes — ${Math.round(d.rev)} DH">
      <b>${d.n}</b>
      <div class="wc-bar"><i style="height:${Math.max(3, Math.round(d.n / mx * 100))}%"></i></div>
      <span>${d.lbl}</span>
    </div>`).join('');
  $('#weekRev').textContent = money(days.reduce((s, d) => s + d.rev, 0));

  const cl = {};
  orders.forEach(o => {
    cl[o.phone] = cl[o.phone] || { name: o.name, n: 0, tot: 0 };
    cl[o.phone].n++;
    if (o.status !== 'ملغي') cl[o.phone].tot += o.total;
  });
  const best = Object.values(cl).sort((a, b) => b.n - a.n)[0];
  $('#topClient').textContent = best ? `${best.name}` : '—';
  $('#topClientSub').textContent = best ? `${best.n} commandes — ${money(best.tot)}` : '';
}

if (sessionStorage.getItem('msb_admin') === '1') showDash(); else showLogin();

$('#ipBtn').addEventListener('click', () => {
  const map = {};
  let noIp = 0;
  orders.forEach(o => {
    if (!o.meta || !o.meta.ip) { noIp++; return; }
    const k = o.meta.ip;
    if (!map[k]) map[k] = { ip: k, geo: '', dev: '', n: 0, last: o.createdAt };
    map[k].n++;
    if (o.meta.dev) map[k].dev = o.meta.dev;
    if (o.meta.geo) map[k].geo = o.meta.geo;
    if (new Date(o.createdAt) > new Date(map[k].last)) map[k].last = o.createdAt;
  });
  const arr = Object.values(map).sort((a, b) => b.n - a.n);
  let html = arr.length ? arr.map(r => `
    <div class="ip-row${r.n >= 3 ? ' bad' : ''}">
      <b>${esc(r.ip)}</b>
      <span class="ip-dev">${esc(r.dev || '')}</span>
      <span class="ip-geo">${esc(r.geo || '—')}</span>
      <span class="ip-n${r.n >= 3 ? ' bad' : ''}">${r.n} طلبات</span>
      <small class="ip-last">آخر مرة: ${fmtDT(r.last)}</small>
    </div>`).join('') : '<p class="empty-mini">📭 ما كاين حتى IP مسجل بعد — كيتسجل مع الطلبات الجديدة</p>';
  if (noIp && arr.length) html += `<p class="cl-hint" style="margin-top:10px">ℹ️ ${noIp} طلبات قدماء بلا IP (قبل التحديث)</p>`;
  $('#ipList').innerHTML = html;
  $('#ipModal').classList.add('open');
});
$('#ipClose').addEventListener('click', () => $('#ipModal').classList.remove('open'));

/* ===== 📝 النصوص ===== */
const TXT_LIST = [
  ['hero_badge','✨ الشارة فوق','صناعة مغربية أصيلة — من قلب الهرهورة'],
  ['hero_t1','العنوان — جزء 1','الخبز والحلويات'],
  ['hero_t2','العنوان — جزء 2','بحال ديال الدار'],
  ['hero_sub','الوصف تحت العنوان','مسمن، خبز بلدي، رغايف، مخمر، بغرير وكسكس... محضّرين كل صباح بمكونات نقية وريحة تفتح النفس، وكيوصلوك حتى لباب الدار'],
  ['hero_cta1','زر الطلب','اطلب دابا'],
  ['prod_title','عنوان المنتجات','المنتجات الطازجة'],
  ['prod_sub','الوصف ديال المنتجات','منين الطلب خاصو يكون طازج ومحضّر يومياً...'],
  ['f_khobz','تصنيف: الخبز والأفطائر','الخبز والأفطائر'],
  ['f_ma2kulat','تصنيف: المأكولات','المأكولات'],
  ['f_halwa','تصنيف: الحلويات','الحلويات'],
  ['avis_title','عنوان آراء الزبناء','آراء الزبناء ديالنا هم أحسن دليل'],
  ['avis_sub','الوصف ديال الآراء','نقولو شكراً لكل زبون...'],
  ['ct_title','عنوان التواصل','اتصل بنا'],
  ['ct_sub','الوصف ديال التواصل','بينا لأقرب محل...'],
['foot_rights','حقوق الفوتر','جميع الحقوق محفوظة']
];
function txtGetC() { try { return JSON.parse(localStorage.getItem('msb_texts') || 'null') || {}; } catch(e){ return {}; } }
function txtDef(k) { const r = TXT_LIST.find(t => t[0] === k); return r ? r[2] : ''; }
function paintTxt() {
  const grid = $('#txtGrid'); if (!grid) return;
  const c = txtGetC();
  const ar = c.ar || {}, fr = c.fr || {};
  grid.innerHTML = TXT_LIST.map(([k, lbl, def]) => `
    <div class="txt-item">
      <p class="txt-lbl">${esc(lbl)}</p>
      <label>🇲🇦 العربية<textarea id="ttA_${k}" rows="2" placeholder="${esc(def)}"></textarea></label>
      <label>🇫🇷 Français<textarea id="ttF_${k}" rows="2" placeholder="-"></textarea></label>
    </div>
  `).join('');
  TXT_LIST.forEach(([k]) => {
    const a = $('#ttA_' + k), f = $('#ttF_' + k);
    if (a) a.value = ar[k] || '';
    if (f) f.value = fr[k] || '';
  });
}
$('#txtSave').addEventListener('click', async () => {
  const ar = {}, fr = {};
  TXT_LIST.forEach(([k]) => {
    const va = $('#ttA_' + k).value.trim(); if (va) ar[k] = va;
    const vf = $('#ttF_' + k).value.trim(); if (vf) fr[k] = vf;
  });
  const cur = txtGetC();
  cur.ar = ar; cur.fr = fr;
  localStorage.setItem('msb_texts', JSON.stringify(cur));
  toastOk('✅ النصوص تبدلات! (عربي: ' + Object.keys(ar).length + ' / فرنسي: ' + Object.keys(fr).length + ')');
  if (CLOUD.on && window.FB && FB.db) {
    const idn = { logo: localStorage.getItem('msb_logo') || '', hero: (function(){ try{return JSON.parse(localStorage.getItem('msb_hero_imgs')||'[]');}catch(e){return [];} })() };
    idn.texts = cur;
    try { await saveSite(idn); toastOk('☁️ تبانات لجميع الزوار!'); }
    catch(err){ toastOk('⚠️ Cloud: ' + (err.code || err.message)); }
  }
});
$('#txtResetAll').addEventListener('click', () => {
  const cur = txtGetC(); cur.ar = {}; cur.fr = {};
  localStorage.setItem('msb_texts', JSON.stringify(cur));
  paintTxt();
  toastOk('↩️ رجعو النصوص الأصلية');
});
paintTxt();
