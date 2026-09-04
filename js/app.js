const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let LANG = localStorage.getItem('msb_lang') || 'ar';
const I18N = {
  ar: {
    nav_home:'الرئيسية', nav_products:'المنتجات', nav_steps:'كيفاش تطلب؟', nav_about:'علينا', nav_avis:'آراء الزبناء', nav_contact:'اتصل بنا',
    brand_b:'تعاونية المستقبل', brand_s:'لإنتاج الخبز والحلويات — الهرهورة',
    hero_badge:'✨ صناعة مغربية أصيلة — من قلب الهرهورة',
    hero_t1:'الخبز والحلويات', hero_t2:'بحال ديال الدار',
    hero_sub:'مسمن، خبز بلدي، رغايف، مخمر، بغرير وكسكس... محضّرين كل صباح بمكونات نقية وريحة تفتح النفس، وكيوصلوك حتى لباب الدار 🏠',
    hero_cta1:'🛍️ اطلب دابا', hero_cta2:'📍 فين كاينين؟',
    stat1:'طلب وصل لمكانو', stat2:'% طازج ومحضّر يومياً', stat3:'منتجات تقليدية أصيلة',
    why1_t:'طازج كل صباح', why1_p:'كنخبزو وكنحضرو كل نهار من السادسة صباحاً',
    why2_t:'مكونات طبيعية 100%', why2_p:'دقيق، سميد، زيت الزيتون... بلا مواد كيماوية',
    why3_t:'توصيل سريع', why3_p:'طلباتك توصلك فراس الوقت اللي اخترتي',
    why4_t:'ثمن التعاونية', why4_p:'جودة عالية بثمن مناسب لكل العائلات',
    prod_title:'المنتجات ديالنا', prod_sub:'اختر، زيد للسلة، وحدد الوقت اللي بغيتي فيه الطلب',
    search_ph:'🔍 قلب على produit...',
    f_all:'الكل', f_khobz:'🫓 الخبز والأفطائر', f_ma2kulat:'🍲 المأكولات', f_halwa:'🍬 الحلويات',
    qn_prods:'المنتجات', qn_bot:'البوت',
    bot_title:'مساعد المستقبل', bot_ph:'كتب سؤالك...',
    add_btn:'➕ زيد للسلة',
    steps_title:'كيفاش تطلب؟', steps_sub:'3 خطوات بسيطة وطلبك يكون عندك',
    st1_t:'اختار المنتجات', st1_p:'زيد اللي بغيتي للسلة — مسمن، خبز، كسكس...',
    st2_t:'حدد المعلومات', st2_p:'سميتك، التيليفون، العنوان والوقت اللي مناسب ليك',
    st3_t:'أكد عبر WhatsApp', st3_p:'الطلب كيتسجل عندنا وكيتأكد فالهاتف 💬',
    about_t:'شكون حنا؟', about_s:'قصة تعاونية من قلب الهرهورة',
    about_p1:'«تعاونية المستقبل» تعاونية محلية كتخدم فقلب الهرهورة، جمعنا فيها الخبرة ديال أيادي ماهرة مع المكونات النقية ديال بلادنا — باش كل صباح يوصل لكم خبز ومسمن وحلويات بحال ديال الدار بالضبط.',
    about_p2:'كنعتمدو على الفلاحين ديال المنطقة فالدقيق والسميد والبيض وزيت الزيتون، وكل حاجة كتتحضر بيدينا بالنمرة والصبر — بلا مواد حافظة وبلا اختصارات.',
    about_li1:'✅ صناعة 100% يدوية تقليدية',
    about_li2:'✅ مكونات محلية من فلاحي المنطقة',
    about_li3:'✅ نظافة وجودة فكل مرحلة',
    about_li4:'✅ ثمن التعاونية — بلا وسطاء',
    about_n1:'سنوات ديال الخبرة فالطياب التقليدي',
    about_n2:'محضّر بيدينا كل نهار',
    about_n3:'تعاونية ديال نساء ورجال المنطقة',
    avis_title:'شنو كيقولو علينا؟', avis_sub:'آراء الزبناء ديالنا هم أحسن دليل',
    av1:'"المسمن والبغرير ديالهم بحال ديال الجدة بالضبط! ولدي كيقول لي دابا نشري من فيهم كل نهار."',
    av2:'"طلبت كسكس عائلي لنهار الجمعة، وصل سخون وفي وقتو بالضبط. تعامل راقي وناس مزيانين."',
    av3:'"حلويات ديال الأعراس عندهم مستوى آخر! الضياف كاملين سولاني منين شريتهم 😍"',
    ct_title:'اتصل بنا', ct_sub:'حنيين نستناوك — عيّط، راسل ولا زورنا',
    ct_phone_t:'التيليفون', ct_call:'عيّط علينا دابا ↗',
    ct_wa_txt:'طلبات وأسئلة مباشرة', ct_wa_link:'راسلنا دابا ↗',
    ct_map_t:'العنوان', ct_map_txt:'الهرهورة — شوف موقعنا فـ Google Maps', ct_map_link:'افتح الخريطة ↗',
    ct_hours_t:'أوقات العمل', ct_hours_txt:'كل يوم<br>من 06:00 إلى 20:00',
    qr_title:'📱 امسح الكود وزور السايت',
    foot_rights:'جميع الحقوق محفوظة',
 legal:'⚖️ تنبيه: كل طلب كيتسجل فيه عنوان IP والموقع التقريبي — الطلبات الزائفة كتعرض صاحبها للمتابعة حسب القانون المغربي',
    cart_title:'السلة ديالك', cart_total:'المجموع', cart_checkout:'كمّل الطلب ✅',
    cart_empty:'<b>🛒</b>السلة خاوية دابا<br>زيد شي حاجة بنينة!',
    co_title:'معلومات الطلب 🚚',
    co_name:'الاسم الكامل *', co_phone:'رقم الهاتف *', co_addr:'العنوان *',
    co_del:'🛵 توصيل للدار', co_pick:'🏪 استلام من المحل',
    co_date:'نهار الطلب *', co_time:'الوقت *',
    slot_choose:'اختر الوقت...', slot_asap:'في أقرب وقت ممكن',
    co_note:'ملاحظة (اختياري)', co_note_ph:'مثلا: الخبز بلا ملح...',
    ph_name:'محمد العلوي', ph_addr:'الحي، الزنقة، الرقم...',
    co_submit:'أكّد الطلب عبر WhatsApp 💬',
    co_note2:'الطلب غادي يتسجل عندنا ويوصلك تأكيد فالهاتف',
    ok_title:'شكراً بزاف! 🎉', ok_txt:'الطلب ديالك تسجل عندنا، غادي نعيّطو عليك قريباً للتأكيد.',
    ok_close:'مسا الخير 😊', ok_id:'رقم الطلب ديالك: ',
    addr_lbl:'العنوان *', addr_lbl_opt:'العنوان (ما كاينش ضروري)',
    err_name:'⚠️ عافاك كتب سميتك كاملة',
    err_phone:'⚠️ رقم الهاتف ماشي صحيح (مثال: 0673106791)',
    err_addr:'⚠️ عافاك كتب العنوان بالتفصيل',
    err_date:'⚠️ اختار نهار الطلب',
    err_slot:'⚠️ اختار الوقت اللي مناسب ليك',
    added:'تزاد', from:'من', no_res:'ما كاين حتى produit بهاد الاسم 🤷'
  },
  fr: {
    nav_home:'Accueil', nav_products:'Produits', nav_steps:'Comment commander ?', nav_about:'À propos', nav_avis:'Avis clients', nav_contact:'Contact',
    brand_b:'Coopérative Al Mostakbal', brand_s:'Pain & Pâtisseries — El Herrhoura',
    hero_badge:'✨ Artisanat marocain authentique — de El Herrhoura',
    hero_t1:'Le Pain & les Douceurs', hero_t2:'comme à la maison',
    hero_sub:"Msemen, pain berbère, rghaif, mkhamer, baghrir et couscous... préparés chaque matin avec des ingrédients purs, livrés jusqu'à votre porte 🏠",
    hero_cta1:'🛍️ Commander', hero_cta2:'📍 Nous trouver',
    stat1:'commandes livrées', stat2:'% frais du jour', stat3:'produits traditionnels',
    why1_t:'Frais chaque matin', why1_p:'Nous cuisons et préparons chaque jour dès 6h du matin',
    why2_t:'Ingrédients 100% naturels', why2_p:"Farine, semoule, huile d'olive... sans additifs",
    why3_t:'Livraison rapide', why3_p:'Vos commandes livrées à l\'heure que vous choisissez',
    why4_t:'Prix coopérative', why4_p:'Qualité au prix juste pour toutes les familles',
    prod_title:'Nos Produits', prod_sub:'Choisissez, ajoutez au panier et sélectionnez l\'heure de votre commande',
    search_ph:'🔍 Rechercher un produit...',
    f_all:'Tout', f_khobz:'🫓 Pains & Feuilletés', f_ma2kulat:'🍲 Plats', f_halwa:'🍬 Pâtisseries',
    qn_prods:'Produits', qn_bot:'Bot',
    bot_title:'Assistant Al Mostakbal', bot_ph:'Écrivez votre question...',
    add_btn:'➕ Ajouter',
    steps_title:'Comment commander ?', steps_sub:'3 étapes simples et c\'est chez vous',
    st1_t:'Choisissez vos produits', st1_p:'Ajoutez au panier — msemen, pain, couscous...',
    st2_t:'Remplissez vos infos', st2_p:'Nom, téléphone, adresse et heure souhaitée',
    st3_t:'Confirmez via WhatsApp', st3_p:'La commande est enregistrée et confirmée par téléphone 💬',
    about_t:'Qui sommes-nous ?', about_s:"L'histoire d'une coopérative de El Herrhoura",
    about_p1:'« Coopérative Al Mostakbal » est une coopérative locale au cœur de El Herrhoura : nous avons réuni le savoir-faire de mains expertes avec des ingrédients purs de notre région — pour que chaque matin vous receviez pain, msemen et douceurs exactement comme à la maison.',
    about_p2:"Nous nous appuyons sur les agriculteurs de la région pour la farine, la semoule, les œufs et l'huile d'olive, et tout est préparé à la main avec patience — sans conservateurs ni raccourcis.",
    about_li1:'✅ Fabrication 100% artisanale traditionnelle',
    about_li2:"✅ Ingrédients locaux des fermes de la région",
    about_li3:'✅ Propreté et qualité à chaque étape',
    about_li4:'✅ Prix coopérative — sans intermédiaires',
    about_n1:"années d'expérience en cuisine traditionnelle",
    about_n2:'préparé à la main chaque jour',
    about_n3:'Une coopérative de femmes et hommes de la région',
    avis_title:'Ils en disent quoi ?', avis_sub:'Nos clients sont notre meilleure preuve',
    av1:'« Le msemen et le baghrir sont exactement comme ceux de grand-mère ! Mon fils me demande d\'en acheter chaque jour. »',
    av2:'« J\'ai commandé un couscous familial pour vendredi, arrivé chaud et à l\'heure exacte. Accueil très sympa. »',
    av3:'« Leurs pâtisseries de mariage sont d\'un autre niveau ! Tous les invités m\'ont demandé où je les avais achetées 😍 »',
    ct_title:'Contactez-nous', ct_sub:'Nous sommes là pour vous — appelez, écrivez ou passez nous voir',
    ct_phone_t:'Téléphone', ct_call:'Appelez-nous ↗',
    ct_wa_txt:'Commandes et questions directes', ct_wa_link:'Écrivez-nous ↗',
    ct_map_t:'Adresse', ct_map_txt:'El Herrhoura — voir sur Google Maps', ct_map_link:'Ouvrir la carte ↗',
    ct_hours_t:'Horaires', ct_hours_txt:'Tous les jours<br>de 06h00 à 20h00',
    qr_title:'📱 Scannez le code et visitez le site',
    foot_rights:'Tous droits réservés',
 legal:'⚖️ Avertissement : chaque commande enregistre l\'IP et la zone approximative — les fausses commandes sont passibles de poursuites selon la loi marocaine',
    cart_title:'Votre panier', cart_total:'Total', cart_checkout:'Finaliser ✅',
    cart_empty:'<b>🛒</b>Panier vide<br>Ajoutez quelque chose de bon !',
    co_title:'Infos de livraison 🚚',
    co_name:'Nom complet *', co_phone:'Téléphone *', co_addr:'Adresse *',
    co_del:'🛵 Livraison', co_pick:'🏪 À emporter',
    co_date:'Jour *', co_time:'Heure *',
    slot_choose:'Choisir l\'heure...', slot_asap:'Dès que possible',
    co_note:'Remarque (facultatif)', co_note_ph:'Ex : pain sans sel...',
    ph_name:'Nom Prénom', ph_addr:'Quartier, rue, n°...',
    co_submit:'Confirmer via WhatsApp 💬',
    co_note2:'Votre commande sera confirmée par téléphone',
    ok_title:'Merci beaucoup ! 🎉', ok_txt:'Votre commande est enregistrée, nous vous appellerons bientôt pour confirmer.',
    ok_close:'Bonne journée 😊', ok_id:'N° de commande : ',
    addr_lbl:'Adresse *', addr_lbl_opt:'Adresse (facultatif)',
    err_name:'⚠️ Écrivez votre nom complet',
    err_phone:'⚠️ Numéro invalide (ex : 0673106791)',
    err_addr:'⚠️ Écrivez votre adresse en détail',
    err_date:'⚠️ Choisissez le jour',
    err_slot:'⚠️ Choisissez l\'heure',
    added:'ajouté', from:'dès', no_res:'Aucun produit trouvé 🤷'
  }
};
const tr = k => (I18N[LANG] && I18N[LANG][k] !== undefined) ? I18N[LANG][k] : (I18N.ar[k] !== undefined ? I18N.ar[k] : k);
const money = n => (n % 1 ? n.toFixed(2) : n) + (LANG === 'fr' ? ' DH' : ' د.م.');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

let cart = [];
try { cart = JSON.parse(localStorage.getItem('msb_cart') || '[]'); } catch(e) { cart = []; }
const saveCart = () => localStorage.setItem('msb_cart', JSON.stringify(cart));

(function applyOverrides() {
  let ovr = {};
  try { ovr = JSON.parse(localStorage.getItem('msb_prod_overrides') || '{}'); } catch(e) {}
  PRODUCTS.forEach(p => {
    const o = ovr[p.id];
    if (!o) return;
    if (o.deleted) p.hidden = true;
    Object.assign(p, o);
    if (o.deleted) p.hidden = true;
  });
  let cust = [];
  try { cust = JSON.parse(localStorage.getItem('msb_prod_custom') || '[]'); } catch(e) {}
  cust.forEach(c => {
    if (ovr[c.id] && ovr[c.id].deleted) return;
    PRODUCTS.push(Object.assign({}, c, ovr[c.id] || {}));
  });
})();

function prodOf(fid) {
  const parts = String(fid).split('::');
  const p = PRODUCTS.find(x => x.id === parts[0]);
  if (!p) return { name: '?', emoji: '❓', price: 0, unit: '', img: '' };
  if (parts.length > 1 && p.variants) {
    const v = p.variants[+parts[1]] || p.variants[0];
    return { name: `${p.name} (${v.label})`, emoji: p.emoji, img: p.img, price: v.price, unit: v.label };
  }
  return p;
}

const themeBtn = $('#themeBtn');
function applyTheme(t) {
  document.body.classList.toggle('light', t === 'light');
  localStorage.setItem('msb_theme', t);
  themeBtn.textContent = t === 'light' ? '🌙' : '☀️';
}
themeBtn.addEventListener('click', () => applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
(function initTheme() {
  const saved = localStorage.getItem('msb_theme');
  if (saved) return applyTheme(saved);
  const h = new Date().getHours();
  applyTheme((h >= 20 || h < 6) ? 'light' : 'dark');
})();

function applyLang(l) {
  LANG = l;
  localStorage.setItem('msb_lang', l);
  const fr = l === 'fr';
  document.documentElement.lang = fr ? 'fr' : 'ar';
  document.documentElement.dir = fr ? 'ltr' : 'rtl';
  document.body.classList.toggle('lang-fr', fr);
  $$('[data-i18n]').forEach(el => { const v = I18N[l][el.dataset.i18n]; if (v !== undefined) el.textContent = v; });
  $$('[data-i18n-html]').forEach(el => { const v = I18N[l][el.dataset.i18nHtml]; if (v !== undefined) el.innerHTML = v; });
  $$('[data-i18n-ph]').forEach(el => { const v = I18N[l][el.dataset.i18nPh]; if (v !== undefined) el.placeholder = v; });
  applyTexts(l);
  $('#langBtn').textContent = fr ? 'ع' : 'FR';
  renderProducts(currentCat, ($('#prodSearch') || {}).value || '');
  renderCart();
}
function applyTexts(l) {
  let t = {};
  try { t = JSON.parse(localStorage.getItem('msb_texts') || 'null') || {}; } catch(e) {}
  if (!Object.keys(t).length || !t.ar) return;
  const src = (l === 'fr' && t.fr) ? t.fr : t.ar;
  Object.keys(src).forEach(k => {
    const el = document.querySelector('[data-i18n="' + k + '"]');
    if (el) { const v = src[k]; if (v) el.textContent = v; }
  });
}
$('#langBtn').addEventListener('click', () => applyLang(LANG === 'ar' ? 'fr' : 'ar'));

window.addEventListener('load', () => {
  applyTexts(LANG || 'ar');
  setTimeout(() => {
    $('#preloader').classList.add('done');
    setTimeout(() => $('#preloader').remove(), 700);
  }, 500);
});

const header = $('#header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 40);
  $('#topBtn').classList.toggle('show', scrollY > 600);
});
$('#topBtn').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

$('#burger').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
$$('#navLinks a').forEach(a => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));

(function heroSlider() {
  window.rebuildSlider = function() {
    const wrap = $('#hsSlides'), dots = $('#hsDots'), box = document.querySelector('.hero-slider');
    if (!wrap || !box) return;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('msb_hero_imgs') || 'null'); } catch(e) {}
    const caps = ['🫓 مسمن طازج من الفرن', '🍞 خبز بلدي تقليدي', '🍬 حلوة العرة'];    const list = (Array.isArray(saved) ? saved : [])
      .map((im, i) => im ? { img: im, cap: caps[i] } : null)
      .filter(Boolean);
    if (!list.length) { box.style.display = 'none'; wrap.innerHTML = ''; dots.innerHTML = ''; return; }
    box.style.display = '';
    wrap.innerHTML = list.map((h, i) => `<div class="hs-slide${i === 0 ? ' active' : ''}"><img src="${h.img}" alt="" loading="lazy"><span class="hs-cap">${h.cap}</span></div>`).join('');
    dots.innerHTML = list.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
  };
  window.rebuildSlider();
  const slides = () => $$('.hs-slide'), dots = () => $$('#hsDots i');
  let hi = 0, timer;
  function go(n) {
    const s = slides(), d = dots();
    if (!s.length) return;
    if (hi >= s.length) hi = 0;
    s[hi].classList.remove('active'); d[hi].classList.remove('on');
    hi = (n + s.length) % s.length;
    s[hi].classList.add('active'); d[hi].classList.add('on');
  }
  function auto() { clearInterval(timer); timer = setInterval(() => go(hi + 1), 4000); }
  $('#hsDots').addEventListener('click', e => {
    const i = [...$('#hsDots').children].indexOf(e.target);
    if (i > -1) { go(i); auto(); }
  });
  auto();
})();

window.applyLogo = function() {
  const url = localStorage.getItem('msb_logo');
  const slot = document.querySelector('.brand-ico');
  if (!slot) return;
  if (!url) return;
  let im;
  if (slot.tagName === 'IMG') { im = slot; }
  else {
    im = document.createElement('img');
    im.className = slot.className + ' brand-logo';
    im.alt = 'logo';
    slot.replaceWith(im);
  }
  im.src = url;
  const fav = document.querySelector('link[rel="icon"]');
  if (fav) fav.href = url;
  const pre = $('#preloaderIco');
  if (pre) pre.innerHTML = `<img src="${url}" alt="" loading="eager">`;
};
applyLogo();

function fillSite() {
  $('#telCard').href = 'tel:' + SITE.phoneTel;
  $('#phoneTxt').textContent = SITE.phoneDisplay;
  const waU = 'https://wa.me/' + SITE.whatsapp;
  $('#waCard').href = waU; $('#waLink').href = waU; $('#waFloat').href = waU; $('#footWa').href = waU;
  $('#mapCard').href = SITE.maps;
  $('#fbLink').href = SITE.facebook; $('#footFb').href = SITE.facebook;
  if (SITE.instagram) { $('#igLink').href = SITE.instagram; $('#footIg').href = SITE.instagram; }
  else { $('#igLink').style.display = 'none'; $('#footIg').style.display = 'none'; }
  $('#year').textContent = new Date().getFullYear();
}
fillSite();

let currentCat = 'all';
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } });
}, { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

const cio = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    cio.unobserve(en.target);
    const el = en.target, target = +el.dataset.count, t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString('ar-MA') + (p === 1 && target >= 1000 ? '+' : '');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: .5 });
$$('[data-count]').forEach(el => cio.observe(el));

function renderProducts(cat = 'all', q = '') {
  const grid = $('#prodGrid');
  let list = cat === 'all' ? PRODUCTS.slice() : PRODUCTS.filter(p => p.cat === cat);
  if (q && q.trim()) {
    const s = q.trim().toLowerCase();
    list = list.filter(p => ((p.name || '') + ' ' + (p.desc || '') + ' ' + (p.unit || '')).toLowerCase().includes(s));
  }
  list = list.filter(p => !p.hidden);
  grid.innerHTML = list.length ? list.map((p, i) => `
    <article class="p-card" style="animation:fadeUp .5s ease both ${i * 70}ms">
      <div class="p-media">
        ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy">` : `<div class="p-ph ${p.ph || ''}">${p.emoji}</div>`}
        <span class="p-price">${p.variants ? tr('from') + ' ' + money(Math.min(...p.variants.map(v => v.price))) : money(p.price)}</span>
      </div>
      <div class="p-body">
        <h3>${p.emoji} ${esc(p.name)}</h3>
        <div class="p-unit">${esc(p.unit)}</div>
        <p class="p-desc">${esc(p.desc)}</p>
        ${p.variants ? `<select class="var-sel" data-var="${p.id}">${p.variants.map((v, i) => `<option value="${i}">${v.label} — ${money(v.price)}</option>`).join('')}</select>` : ''}
        <button class="add-btn" data-id="${p.id}" ${p.variants ? 'data-hasvar="1"' : ''}>${tr('add_btn')}</button>
      </div>
    </article>`).join('') : `<p class="no-res">${tr('no_res')}</p>`;
}
renderProducts();

$$('.f-btn').forEach(b => b.addEventListener('click', () => {
  $$('.f-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  currentCat = b.dataset.cat;
  renderProducts(currentCat, $('#prodSearch').value);
}));

$('#prodSearch').addEventListener('input', () => renderProducts(currentCat, $('#prodSearch').value));

document.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;
  let fid = btn.dataset.id;
  if (btn.dataset.hasvar) {
    const sel = btn.closest('.p-body').querySelector('.var-sel');
    if (sel) fid += '::' + sel.value;
  }
  addToCart(fid, btn);
});

document.addEventListener('change', e => {
  const sel = e.target.closest('.var-sel');
  if (!sel) return;
  const p = PRODUCTS.find(x => x.id === sel.dataset.var);
  if (p && p.variants) sel.closest('.p-card').querySelector('.p-price').textContent = money(p.variants[+sel.value].price);
});

function fly(fromEl) {
  const f = fromEl.getBoundingClientRect(), t = $('#cartBtn').getBoundingClientRect();
  const dot = document.createElement('span');
  dot.className = 'fly-dot';
  dot.style.top = f.top + f.height / 2 + 'px';
  dot.style.left = f.left + f.width / 2 + 'px';
  document.body.appendChild(dot);
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${t.left + t.width / 2 - (f.left + f.width / 2)}px,${t.top + t.height / 2 - (f.top + f.height / 2)}px) scale(.25)`;
    dot.style.opacity = '0';
  });
  setTimeout(() => dot.remove(), 800);
}

function addToCart(id, btn) {
  const it = cart.find(c => c.id === id);
  if (it) it.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateBadge(true);
  renderCart();
  fly(btn);
  const p = prodOf(id);
  toast(`${p.emoji} ${tr('added')} "${p.name}"`);
}

function updateBadge(bump) {
  const n = cart.reduce((s, c) => s + c.qty, 0);
  const b = $('#cartCount');
  b.textContent = n;
  if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
}

function renderCart() {
  const box = $('#cartItems');
  if (!cart.length) {
    box.innerHTML = `<div class="cart-empty">${tr('cart_empty')}</div>`;
    $('#checkoutBtn').disabled = true;
    $('#checkoutBtn').style.opacity = .5;
  } else {
    box.innerHTML = cart.map(c => {
      const p = prodOf(c.id);
      return `<div class="ci">
        ${p.img ? `<img class="ci-img" src="${p.img}" alt="">` : `<div class="ci-ph">${p.emoji}</div>`}
        <div>
          <div class="ci-name">${esc(p.name)}</div>
          <div class="ci-sub">${money(p.price)} / ${esc(p.unit)}</div>
          <div class="stepper">
            <button data-act="minus" data-id="${c.id}">−</button><b>${c.qty}</b><button data-act="plus" data-id="${c.id}">+</button>
          </div>
        </div>
        <div class="ci-side">
          <span class="ci-total">${money(p.price * c.qty)}</span>
          <button class="ci-del" data-act="del" data-id="${c.id}">🗑️</button>
        </div>
      </div>`;
    }).join('');
    $('#checkoutBtn').disabled = false;
    $('#checkoutBtn').style.opacity = 1;
  }
  $('#cartTotal').textContent = money(cart.reduce((s, c) => s + prodOf(c.id).price * c.qty, 0));
}

$('#cartItems').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const it = cart.find(c => c.id === b.dataset.id);
  if (!it) return;
  if (b.dataset.act === 'plus') it.qty++;
  if (b.dataset.act === 'minus') { it.qty--; if (it.qty < 1) cart = cart.filter(c => c.id !== it.id); }
  if (b.dataset.act === 'del') cart = cart.filter(c => c.id !== it.id);
  saveCart(); updateBadge(); renderCart();
});

const overlay = $('#overlay'), drawer = $('#drawer'), checkoutModal = $('#checkoutModal'), successModal = $('#successModal');

function openDrawer() { drawer.classList.add('open'); overlay.classList.add('open'); }
function closeAll() {
  drawer.classList.remove('open');
  checkoutModal.classList.remove('open');
  successModal.classList.remove('open');
  overlay.classList.remove('open');
}
$('#cartBtn').addEventListener('click', () => { renderCart(); openDrawer(); });
$('#closeCart').addEventListener('click', closeAll);
$('#closeCheckout').addEventListener('click', closeAll);
$('#closeSuccess').addEventListener('click', closeAll);
overlay.addEventListener('click', closeAll);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

$('#checkoutBtn').addEventListener('click', () => {
  if (!cart.length) return;
  drawer.classList.remove('open');
  buildSummary();
  checkoutModal.classList.add('open');
  overlay.classList.add('open');
});

const form = $('#orderForm');
form.date.min = (() => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); })();

function deliveryType() { return form.dtype.value; }

$$('input[name=dtype]').forEach(r => r.addEventListener('change', () => {
  const del = deliveryType() === 'delivery';
  form.address.required = del;
  form.address.disabled = !del;
  $('#addrLabel').querySelector('span').innerHTML = del ? tr('addr_lbl') : tr('addr_lbl_opt');
  if (!del) { form.address.value = ''; }
}));

function buildSummary() {
  $('#coSummary').innerHTML =
    cart.map(c => { const p = prodOf(c.id); return `<div class="cs-row"><span>${p.emoji} ${esc(p.name)} × ${c.qty}</span><span>${money(p.price * c.qty)}</span></div>`; }).join('') +
    `<div class="cs-row cs-tot"><span>${tr('cart_total')}</span><span>${money(cart.reduce((s, c) => s + prodOf(c.id).price * c.qty, 0))}</span></div>`;
}

async function grabMeta() {
  const dev = /Mobi|Android/i.test(navigator.userAgent)
    ? '📱 ' + (/iPhone|iPad/i.test(navigator.userAgent) ? 'iPhone' : 'Android')
    : '💻 ' + (/Chrome/i.test(navigator.userAgent) && !/Edg/i.test(navigator.userAgent) ? 'Chrome' : /Firefox/i.test(navigator.userAgent) ? 'Firefox' : /Edg/i.test(navigator.userAgent) ? 'Edge' : /Safari/i.test(navigator.userAgent) ? 'Safari' : 'Navigateur');
  const apis = [
    {
      u: 'https://ipapi.co/json/',
      p: j => ({ ip: j.ip || '', geo: [j.city, j.region, j.country_name].filter(Boolean).join(' - ') })
    },
    {
      u: 'https://ipwho.is/',
      p: j => ({ ip: j.ip || '', geo: [j.city, j.region, j.country].filter(Boolean).join(' - ') })
    }
  ];
  for (const a of apis) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 3500);
      const r = await fetch(a.u, { signal: ctl.signal });
      clearTimeout(t);
      const j = await r.json();
      const d = a.p(j);
      if (d.ip) return { ...d, dev };
    } catch (e) {}
  }
  return { ip: '', geo: '', dev };
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const err = $('#formErr');
  err.textContent = '';
  const name = form.name.value.trim();
  const phone = form.phone.value.replace(/[\s-]/g, '');
  const addr = form.address.value.trim();
  const date = form.date.value;
  const slot = form.slot.value;
  if (name.length < 3) return err.textContent = tr('err_name');
  if (!/^(?:\+212|0)([67])\d{8}$/.test(phone)) return err.textContent = tr('err_phone');
  if (deliveryType() === 'delivery' && addr.length < 5) return err.textContent = tr('err_addr');
  if (!date) return err.textContent = tr('err_date');
  if (!slot) return err.textContent = tr('err_slot');

  const now = Date.now();
  const stamps = JSON.parse(localStorage.getItem('msb_rate') || '[]').filter(t => now - t < 3600000);
  if (stamps.length >= 3) return err.textContent = '⏳ وصلتي للحد ديال الطلبات فهاد الساعة، عاود من بعد شوية';
  stamps.push(now);
  localStorage.setItem('msb_rate', JSON.stringify(stamps));

  const order = {
    id: 'MSB-' + Date.now().toString(36).toUpperCase().slice(-6),
    createdAt: new Date().toISOString(),
    name, phone,
    address: deliveryType() === 'delivery' ? addr : 'استلام من المحل',
    dtype: deliveryType(),
    date, slot,
    note: form.note.value.trim(),
    items: cart.map(c => { const p = prodOf(c.id); return { name: p.name, emoji: p.emoji, unit: p.unit, qty: c.qty, price: p.price }; }),
    total: cart.reduce((s, c) => s + prodOf(c.id).price * c.qty, 0),
    status: 'جديد'
  };

  const orders = JSON.parse(localStorage.getItem('msb_orders') || '[]');
  orders.push(order);
  localStorage.setItem('msb_orders', JSON.stringify(orders));

  if (window.FB && FB.db) {
    try { FB.db.collection('orders').doc(order.id).set(JSON.parse(JSON.stringify(order))); } catch(e) {}
  }

  const msg =
`🌟 طلب جديد — ${SITE.name}
🧾 رقم الطلب: ${order.id}

👤 الاسم: ${order.name}
📞 الهاتف: ${order.phone}
📍 ${order.dtype === 'delivery' ? 'العنوان' : 'نوع الطلب'}: ${order.address}
📅 النهار: ${order.date}
⏰ الوقت: ${order.slot}` +
(order.note ? `\n📝 ملاحظة: ${order.note}` : '') +
`

🛒 الطلب:
${order.items.map(i => `• ${i.emoji} ${i.name} × ${i.qty} = ${money(i.price * i.qty)}`).join('\n')}

💰 المجموع: ${money(order.total)}

الموقع: ${SITE.maps}`;

  window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');

  checkoutModal.classList.remove('open');
  $('#orderIdLbl').textContent = tr('ok_id') + order.id;
  successModal.classList.add('open');
  confetti();
  cart = [];
  saveCart();
  updateBadge();
  renderCart();
  form.reset();
});

function confetti() {
  const box = $('#confetti');
  const colors = ['#f2b95c', '#e8963d', '#25d366', '#e0653a', '#f7ecd9'];
  for (let i = 0; i < 42; i++) {
    const p = document.createElement('i');
    p.style.right = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * .5 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
  }
  setTimeout(() => box.innerHTML = '', 4200);
}

(function qr() {
  const url = SITE.siteUrl || ((location.protocol === 'http:' || location.protocol === 'https:') ? location.href : '');
  if (url && window.QRCode) {
    new QRCode($('#qrBox'), { text: url, width: 150, height: 150, colorDark: '#2a1c0e', colorLight: '#fff7ea', correctLevel: QRCode.CorrectLevel.M });
    $('#qrUrl').textContent = url;
  } else {
    $('#qrBox').innerHTML = '<p class="qr-hint">📱 منين تنشر السايت فأنترنيت، الكود غادي يتولد هنا أوتوماتيكياً.<br>بغيتي تبدل الرابط؟ بدّل <b>siteUrl</b> فملف js/data.js</p>';
  }
})();

cart = cart.filter(c => prodOf(c.id).price > 0);
updateBadge();
renderCart();
applyLang(LANG);

(function bot() {
  const QA = [
    { k: ['ثمن','الثمن','بشحال','شحال','prix','taman'], q: '💰 شحال الأثمنة؟', a: 'الأثمنة كاينة تحت كل منتج فقسم «المنتجات ديالنا» 👇<br>مثلا: المسمن 2.5 د.م. • خبز بلدي 4 د.م. • كسكس فردي 25 د.م.' },
    { k: ['توصيل','توصل','دليفري','لدار','livraison'], q: '🛵 كتوصلو للدار؟', a: 'إيه! كنوصلو حتى لباب الدار 🏠 دير commande و اختار الوقت اللي بغيتي.' },
    { k: ['وقت','ساعة','تحلوا','مفتوح','horaire','ساعات'], q: '🕒 شحال الوقت ديالكم؟', a: 'كل يوم من 06:00 صباحاً حتى 20:00 ليلاً ⏰' },
    { k: ['فين','موقع','عندكم','كاينين','بلاد','adresse','map'], q: '📍 فين كاينين؟', a: `كانوا فالهرهورة 📍 <a href="${SITE.maps}" target="_blank" rel="noopener">شوف الخريطة هنا ↗</a>` },
    { k: ['كيفاش','نطلب','اطلب','commande','order'], q: '🛒 كيفاش نطلب؟', a: 'سهلة! 1️⃣ زيد اللي بغيتي للسلة 🛒<br>2️⃣ عمّر سميتك، التيليفون والعنوان<br>3️⃣ اختار الوقت اللي مناسب ليك<br>4️⃣ أكّد عبر WhatsApp 💬 و طلبك كيوصل حتى لباب الدار!' },
    { k: ['شكون','حنا','علينا','عليكم','تعاونية','qui'], q: '📖 شكون حنا؟', a: '«تعاونية المستقبل» تعاونية محلية من قلب الهرهورة 🫓<br>✅ صناعة 100% يدوية تقليدية<br>✅ مكونات محلية نقية بلا مواد حافظة<br>✅ ثمن التعاونية — بلا وسطاء' },
    { k: ['كسكس','couscous','كسكصو'], q: '🍲 الكسكس كيفاش كيتبيع؟', a: 'كسكس بلدي بـ3 أحجام:<br>فردي 25 د.م. • لشخصين 45 د.م. • عائلي 85 د.م. 😍' },
    { k: ['سلام','مرحبا','اهلا','salam','ahlan','صباح'], q: '👋 سلام!', a: 'وعليكم السلام و مرحبا بيك فتعاونية المستقبل 🫓 كيفاش نقدر نعاونك؟' }
  ];
  const FALLBACK = 'ما فهمتش مزيان 😅 سولني على: <b>الثمن</b> • <b>التوصيل</b> • <b>الوقت</b> • <b>المكان</b> • <b>كيفاش نطلب</b><br>ولا راسلنا نيشان 👇';
  const panel = $('#botPanel'), body = $('#botBody'), chips = $('#botChips');

  function bubble(html, me) {
    const b = document.createElement('div');
    b.className = 'bub' + (me ? ' me' : '');
    b.innerHTML = html;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }
  function answer(txt) {
    const s = txt.toLowerCase();
    const hit = QA.find(item => item.k.some(k => s.includes(k)));
    setTimeout(() => bubble(hit ? hit.a : FALLBACK + `<br><a class="bot-wa" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">💬 WhatsApp</a>`), 450);
  }
  function ask(txt) { if (!txt.trim()) return; bubble(esc(txt), true); answer(txt); }

  chips.innerHTML = QA.map((x, i) => `<button data-bq="${i}">${x.q}</button>`).join('');
  $('#botFab').addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && !body.children.length) {
      bubble(`أهلا! 🫓 أنا مساعد <b>تعاونية المستقبل</b>.<br>سولني على الأثمنة، التوصيل، الوقت، المكان...`);
      setTimeout(() => bubble(QA[0].a), 600);
    }
  });
  $('#botClose').addEventListener('click', () => panel.classList.remove('open'));
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-bq]');
    if (!b) return;
    ask(QA[+b.dataset.bq].q.replace(/^\S+\s/, '') + '؟');
  });
$('#botForm').addEventListener('submit', e => {
    e.preventDefault();
    const t = $('#botText').value;
    if (/^\s*admin\s*$/i.test(t.trim())) { location.href = 'admin.html'; return; }
    ask(t);
    $('#botText').value = '';
  });
})();

(function cloudSync() {
  if (!(window.FB && FB.db)) return;
  const applySite = v => {
    try {
      if (v.logo) localStorage.setItem('msb_logo', v.logo);
      if (Array.isArray(v.hero)) localStorage.setItem('msb_hero_imgs', JSON.stringify(v.hero));
      if (v.texts) localStorage.setItem('msb_texts', JSON.stringify(v.texts));
      if (v.ver && v.ver !== (localStorage.getItem('msb_ver') || '')) {
        localStorage.setItem('msb_ver', String(v.ver));
        const old = localStorage.getItem('msb_landed');
        if (old !== String(v.ver)) { localStorage.setItem('msb_landed', String(v.ver)); location.reload(); return; }
      }
      if (v.logo) applyLogo();
      if (Array.isArray(v.hero) && window.rebuildSlider) rebuildSlider();
      if (v.texts) applyTexts(LANG || 'ar');
    } catch(e) {}
  };
  FB.db.collection('products').doc('__site__').get()
    .then(d => { if (d.exists) applySite(d.data()); })
    .catch(() => {});
  try {
    FB.db.collection('products').onSnapshot(snap => {
      const list = [];
      snap.forEach(d => {
        if (d.id === '__site__') {
          applySite(d.data());
          return;
        }
        list.push(Object.assign({}, d.data(), { id: d.id }));
      });
      if (!list.length) return;
      list.sort((a, b) => (a.order || 999) - (b.order || 999));
      PRODUCTS.length = 0;
      Array.prototype.push.apply(PRODUCTS, list);
      cart = cart.filter(c => prodOf(c.id).price > 0);
      saveCart();
      renderProducts(currentCat);
      updateBadge();
      renderCart();
    }, err => console.warn('products sync:', err.code));
  } catch(e) {}
})();
