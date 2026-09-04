const SITE = {
  name: 'تعاونية المستقبل لإنتاج الخبز والحلويات',
  city: 'الهرهورة',
  whatsapp: '212673106791',
  phoneDisplay: '06 73 10 67 91',
  phoneTel: '0673106791',
  facebook: 'https://www.facebook.com/people/%D8%AA%D8%B9%D8%A7%D9%88%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%82%D8%A8%D9%84-%D9%84%D8%A7%D9%86%D8%AA%D8%A7%D8%AC-%D8%A7%D9%84%D8%AE%D8%A8%D8%B2-%D9%88%D8%A7%D9%84%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA-%D8%A8%D8%A7%D9%84%D9%87%D8%B1%D9%87%D9%88%D8%B1%D8%A9/61567747649038/',
  instagram: '',
  maps: 'https://maps.app.goo.gl/YovZojkF8mEDtAfx9',
  siteUrl: ''
};

const PRODUCTS = [
  { id:'msmen',   name:'مسمن',            cat:'khobz', price:2.5, unit:'للقطعة',    img:'img/msemen.jpg', emoji:'🫓', desc:'مسمن بلدي مقلّص باليد، مقشّر وخفيف — بحال ديال الدار' },
  { id:'khobz',   name:'خبز بلدي',        cat:'khobz', price:4,   unit:'للخبزة',    img:'img/khobz.jpg',  emoji:'🍞', desc:'خبز بلدي بالسميد، مقشر ومنين الفرن نيشان' },
  { id:'rghayef', name:'رغايف',           cat:'khobz', price:18,  unit:'للكيلو',    img:'',               emoji:'🥞', desc:'رغايف طرية مطبوخة على النار هادية، مثالية للفطور' },
  { id:'mkhamer', name:'مخمر',            cat:'khobz', price:15,  unit:'للكيلو',    img:'',               emoji:'🫓', desc:'مخمر تقليدي خفيف ومهوّي، كيدوب فالفم' },
  { id:'baghrir', name:'بغرير',           cat:'khobz', price:1.5, unit:'للقطعة',    img:'img/baghrir.jpg',emoji:'🍯', desc:'بغرير بألف ثقب، مع العسل والزيتا... لذة!' },
  { id:'cous',    name:'كسكس بلدي',       cat:'ma2kulat', img:'',               emoji:'🍲', ph:'ph-cous', desc:'كسكس بلدي بالخضرة محضّر يوم الطلب — اختار الحجم اللي بغيتي 👇', variants:[ {label:'فردي — شخص واحد', price:25}, {label:'لشخصين', price:45}, {label:'عائلي — 5-6 أشخاص', price:85} ] },
  { id:'briouat', name:'بريوات',          cat:'halwa', price:90,  unit:'للكيلو',    img:'img/briouat.jpg',emoji:'🥮', desc:'بريوات باللوز مغطية بالعسل — حلوى الأعراس' },
  { id:'halwa3ra',name:'حلوة العرة',      cat:'halwa', price:60,  unit:'للكيلو',    img:'img/halwa3ra.jpg',emoji:'🍬', desc:'حلوة العرة التقليدية، طرية وبنكهة أصيلة' },
  { id:'mochkil', name:'تشكيلة حلويات',   cat:'halwa', price:100, unit:'للكيلو',    img:'img/kers.jpg',   emoji:'🎁', desc:'تشكيلة مشكلة من أحسن الحلويات التقليدية' }
];

const ADMIN_PASSWORD = '2025';

const CAT_ALIAS = { cous: 'ma2kulat' };
const normCat = c => CAT_ALIAS[c] || c;
PRODUCTS.forEach(p => { p.cat = normCat(p.cat); });
