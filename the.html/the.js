/*  parallax transition*/
const heroBg    = document.getElementById('hero-bg');
const heroTitle = document.getElementById('hero-title');
const content   = document.getElementById('content-section');
const mainNav   = document.getElementById('main-nav');
const items     = document.querySelectorAll('.gallery-item');
const vh        = window.innerHeight;
const scatteredOrder = [0, 5, 1, 3, 2, 4];
let imagesAnimated = false;

function triggerImages() {
  if (imagesAnimated) return;
  imagesAnimated = true;
  scatteredOrder.forEach((itemIndex, step) => {
    setTimeout(() => {
      if (items[itemIndex]) items[itemIndex].classList.add('visible');
    }, 1500 + step * 500);
  });
}

window.addEventListener('scroll', () => {
  const scrollY  = window.scrollY;
  const progress = Math.min(scrollY / vh, 1);

  if (progress <= 0.60) {
    const p = progress / 0.60;
    heroTitle.style.transform        = `translate(-50%, calc(-50% + ${-p * 80}px))`;
    heroTitle.style.opacity          = String(1 - p * 1.4);
    heroBg.style.backgroundPosition = 'center top';
  }

  if (progress > 0.60) {
    const p     = (progress - 0.60) / 0.40;
    const eased = p * p * (3 - 2 * p);
    heroTitle.style.opacity          = '0';
    heroBg.style.backgroundPosition = `center ${eased * 50}%`;
  }

  if (progress >= 0.85) {
    content.classList.add('visible');
    mainNav.classList.add('dark');
    triggerImages();
  } else {
    content.classList.remove('visible');
    mainNav.classList.remove('dark');
    imagesAnimated = false;
    items.forEach(item => item.classList.remove('visible'));
  }
});

/* ── EXHIBITIONS CAROUSEL ── */
const exhScroll   = document.getElementById('exh-scroll');
const exhWrapper  = document.getElementById('exh-panel-wrapper');
const exhTrack    = document.getElementById('exh-track');
const exhPrev     = document.getElementById('exh-prev');
const exhNext     = document.getElementById('exh-next');
const exhDotsEl   = document.getElementById('exh-dots');
const exhLabelEl  = document.getElementById('exh-label');
const exhSlides   = document.querySelectorAll('.exh-slide');
const exhInfos    = document.querySelectorAll('.exh-slide-info');
const totalExh    = exhSlides.length;
let currentExh    = 0;
let exhExpanded   = false;

exhSlides.forEach((_, i) => {
  const d = document.createElement('div');
  d.classList.add('exh-dot');
  if (i === 0) d.classList.add('active');
  d.addEventListener('click', () => goExh(i));
  exhDotsEl.appendChild(d);
});

const exhDots = document.querySelectorAll('.exh-dot');

function updateExhDots() {
  exhDots.forEach((d, i) => d.classList.toggle('active', i === currentExh));
}

function goExh(index) {
  currentExh = Math.max(0, Math.min(index, totalExh - 1));
  exhTrack.style.transition = 'transform 0.6s cubic-bezier(0.25,1,0.5,1)';
  exhTrack.style.transform  = `translateX(${-currentExh * 25}%)`;
  updateExhDots();
}

exhPrev.addEventListener('click', () => goExh(currentExh - 1));
exhNext.addEventListener('click', () => goExh(currentExh + 1));

let exhDragStart = 0, exhDragging = false;

exhTrack.addEventListener('mousedown', e => {
  exhDragging  = true;
  exhDragStart = e.clientX;
  exhTrack.style.transition = 'none';
});

window.addEventListener('mousemove', e => {
  if (!exhDragging) return;
  exhTrack.style.transform = `translateX(calc(${-currentExh * 25}% + ${e.clientX - exhDragStart}px))`;
});

window.addEventListener('mouseup', e => {
  if (!exhDragging) return;
  exhDragging = false;
  const diff = e.clientX - exhDragStart;
  if (diff < -60) goExh(currentExh + 1);
  else if (diff > 60) goExh(currentExh - 1);
  else goExh(currentExh);
});

exhTrack.addEventListener('touchstart', e => {
  exhDragStart = e.touches[0].clientX;
  exhTrack.style.transition = 'none';
});

exhTrack.addEventListener('touchmove', e => {
  exhTrack.style.transform = `translateX(calc(${-currentExh * 25}% + ${e.touches[0].clientX - exhDragStart}px))`;
});

exhTrack.addEventListener('touchend', e => {
  exhTrack.style.transition = 'transform 0.6s cubic-bezier(0.25,1,0.5,1)';
  const diff = e.changedTouches[0].clientX - exhDragStart;
  if (diff < -60) goExh(currentExh + 1);
  else if (diff > 60) goExh(currentExh - 1);
  else goExh(currentExh);
});

window.addEventListener('scroll', () => {
  const rect     = exhScroll.getBoundingClientRect();
  const total    = exhScroll.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(scrolled / total, 1));
  const eased    = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  exhWrapper.style.width     = `${50 + eased * 38}%`;
  exhWrapper.style.transform = `translateX(${30 - eased * 30}%)`;

  const expanded = progress > 0.72;
  if (expanded !== exhExpanded) {
    exhExpanded = expanded;
    exhInfos.forEach(info => info.classList.toggle('show', expanded));
    exhPrev.classList.toggle('show', expanded);
    exhNext.classList.toggle('show', expanded);
    exhDotsEl.classList.toggle('show', expanded);
    exhLabelEl.classList.toggle('hidden', expanded);
  }
});

/* ── PRINTS ── */
const printsData = [
  { title: 'Serenity_27(평온_27)',      meta: 'Limited Edition Print · €125' },
  { title: 'Serenity_11(평온_11)',      meta: 'Limited Edition of 100 · €125' },
  { title: 'Serenity_3 (평온_3)',       meta: 'Limited Edition of 100 · €125' },
  { title: 'Serenity_12',              meta: 'Limited Edition Print · £102' },
  { title: 'A Series of Tranquility',  meta: 'Limited Edition Print · Sold Out' },
];

const printsScroll = document.getElementById('prints-scroll');
const printsTrack  = document.getElementById('prints-track');
const printTitleEl = document.getElementById('print-title');
const printMetaEl  = document.getElementById('print-meta');
const printDotsEl  = document.getElementById('prints-dots');
const printBgs     = document.querySelectorAll('.prints-bg-layer');
const printCards   = document.querySelectorAll('.print-card');
const gradientEl   = document.getElementById('prints-gradient');
const totalPrints  = printsData.length;
let currentPrint   = 0;

printsData.forEach((_, i) => {
  const d = document.createElement('div');
  d.classList.add('prints-dot');
  if (i === 0) d.classList.add('active');
  d.addEventListener('click', () => goToPrint(i));
  printDotsEl.appendChild(d);
});

const printDots = document.querySelectorAll('.prints-dot');

function updatePrintDots() {
  printDots.forEach((d, i) => d.classList.toggle('active', i === currentPrint));
}

function goToPrint(index) {
  currentPrint = Math.max(0, Math.min(index, totalPrints - 1));
  const cardW  = printsTrack.children[0].offsetWidth;
  const gap    = 60;
  printsTrack.style.transform = `translateX(${-currentPrint * (cardW + gap)}px)`;
  printCards.forEach((c, i) => c.classList.toggle('active', i === currentPrint));
  printBgs.forEach((b, i)   => b.classList.toggle('active', i === currentPrint));
  printTitleEl.textContent = printsData[currentPrint].title;
  printMetaEl.textContent  = printsData[currentPrint].meta;
  updatePrintDots();
}

printTitleEl.textContent = printsData[0].title;
printMetaEl.textContent  = printsData[0].meta;

window.addEventListener('scroll', () => {
  const rect     = printsScroll.getBoundingClientRect();
  const total    = printsScroll.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(scrolled / total, 1));

  if (scrolled < 0) return;

  gradientEl.style.opacity = String(Math.max(0, 1 - progress * 8));

  const raw   = Math.max(0, (progress - 0.15) / 0.85) * (totalPrints - 1);
  const index = Math.round(raw);

  if (index !== currentPrint) goToPrint(index);
});