/* EKO SMART - script.js (versi Tailwind)
   Navbar responsif, sidebar, accordion, modal, aktivitas, kuis + skor, hasil, video. */
const MENU = [
  ['index.html', 'Beranda', 'home'],
  ['materi1.html', 'Materi', 'materi'],
  ['aktivitas.html', 'Aktivitas', 'aktivitas'],
  ['kuis1.html', 'Kuis', 'kuis'],
  ['tentang.html', 'Tentang', 'tentang']
];
const MATERI = [
  ['materi1.html', 'img/7 1.png', 'Pengertian Ekosistem'],
  ['materi2.html', 'img/8 1.png', 'Komponen Biotik & Abiotik'],
  ['materi3.html', 'img/9 1.png', 'Rantai Makanan'],
  ['materi4.html', 'img/10 1.png', 'Interaksi Makhluk Hidup']
];
const VIDEO = {
  1: 'https://youtu.be/E0jbWRmGOvg?si=_UHeng2XeMre5Fq7',
  2: 'https://youtu.be/msXml9wII8A?si=ZHuFE5MXB1Mgpgq4'
};
const $ = id => document.getElementById(id);

/* ---------- Penyimpanan skor ---------- */
const SKOR_KEY = 'ekosmart_skor';
const getSkor = () => {
  try { return JSON.parse(localStorage.getItem(SKOR_KEY)) || { benar: 0, salah: 0 }; }
  catch (e) { return { benar: 0, salah: 0 }; }
};
const saveSkor = s => { try { localStorage.setItem(SKOR_KEY, JSON.stringify(s)); } catch (e) {} };

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  initNavbar(page);
  initSidebar();
  initSideAct();
  initAccordion();
  initModal();
  if (page === 'aktivitas') initAktivitas();
  if (page === 'kuis') initKuis();
  if (page === 'hasil') initHasil();
  if (page === 'materi') initVideo();
});

/* ===== 1. NAVBAR RESPONSIF: hamburger di HP, menu horizontal di md ke atas ===== */
function initNavbar(page) {
  const nav = $('navbar');
  if (!nav) return;
  const aktif = m => m[2] === page || (page === 'hasil' && m[2] === 'kuis');
  nav.className = 'relative mb-6 rounded-3xl border border-slate-800 bg-white/60 backdrop-blur';
  nav.innerHTML = `
    <div class="flex items-center justify-between px-5 py-2">
      <a href="index.html"><img src="img/ekosmart logo.png" alt="EKO SMART" class="h-12 w-auto md:h-14"></a>
      <button id="menu-btn" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="menu"
              class="rounded-lg p-2 hover:bg-mint-100 md:hidden">
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <ul id="menu" class="absolute inset-x-0 top-full z-30 hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-lg md:static md:flex md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        ${MENU.map(m => `<li><a href="${m[0]}" class="block rounded-lg px-4 py-3 text-lg font-medium md:px-2 md:text-xl ${aktif(m) ? 'text-eko' : 'text-slate-600 hover:text-eko'}">${m[1]}</a></li>`).join('')}
      </ul>
    </div>`;
  const btn = $('menu-btn'), menu = $('menu');
  btn.addEventListener('click', () => {
    const buka = menu.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', buka);
  });
}

/* ---------- Sidebar materi ---------- */
function initSidebar() {
  const side = $('sidebar');
  if (!side) return;
  const cur = +document.body.dataset.m;
  side.innerHTML =
    `<a href="index.html" class="mb-4 flex items-center gap-3 text-lg font-medium text-slate-800"><span>←</span> Kembali ke Materi</a>` +
    MATERI.map((m, i) => {
      const icon = (i === 0 && cur === 1) ? 'img/daun aktivitas hijau.png' : m[1];
      const on = i + 1 === cur;
      return `<a href="${m[0]}" class="mb-2 flex items-center gap-3 rounded-lg px-2 py-2 font-semibold ${on ? 'bg-emerald-100 text-eko' : 'text-slate-600 hover:bg-mint-100'}"><img src="${icon}" alt="" class="h-8 w-8 shrink-0 object-contain">${i + 1}. ${m[2]}</a>`;
    }).join('');
}

/* ---------- Sidebar aktivitas ---------- */
function initSideAct() {
  document.querySelectorAll('.side-act').forEach(el => {
    el.innerHTML =
      (el.dataset.back ? `<button type="button" data-go="intro" class="mb-4 h-9 rounded-full bg-mint-200 px-6 text-sm font-medium text-eko-dark">Kembali</button>` : '') +
      `<h2 class="text-2xl font-bold text-eko">Aktivitas</h2>` +
      `<p class="mb-5 mt-1 text-sm font-semibold text-slate-400">Kerjakan aktivitas berikut untuk menguji pemahamanmu!</p>` +
      `<span class="flex items-center gap-3 rounded-lg bg-emerald-100 px-3 py-2 font-semibold text-eko"><img src="img/daun aktivitas hijau.png" alt="" class="h-7 w-7">1. Mencocokkan Komponen</span>`;
  });
}

/* ===== 2. ACCORDION FAQ: satu item terbuka pada satu waktu ===== */
function setAcc(btn, buka) {
  btn.setAttribute('aria-expanded', buka);
  $(btn.getAttribute('aria-controls')).classList.toggle('hidden', !buka);
  btn.querySelector('svg').classList.toggle('rotate-180', buka);
}
function initAccordion() {
  document.querySelectorAll('[data-accordion]').forEach(acc => {
    const btns = [...acc.querySelectorAll('[data-acc-btn]')];
    btns.forEach(btn => btn.addEventListener('click', () => {
      const sudahBuka = btn.getAttribute('aria-expanded') === 'true';
      btns.forEach(b => setAcc(b, false));
      if (!sudahBuka) setAcc(btn, true);
    }));
  });
}

/* ===== 3. MODAL (elemen <dialog>): buka, tutup, klik latar, tombol Esc ===== */
function initModal() {
  document.querySelectorAll('[data-modal-open]').forEach(b =>
    b.addEventListener('click', () => $(b.dataset.modalOpen).showModal()));
  document.querySelectorAll('dialog[data-modal]').forEach(d =>
    d.addEventListener('click', e => {
      if (e.target === d || e.target.closest('[data-modal-close]')) d.close();
    }));
}

/* ---------- Aktivitas ---------- */
function initAktivitas() {
  const views = ['intro', 'match', 'benar', 'salah'];
  const show = id => views.forEach(v => $('v-' + v).classList.toggle('hidden', v !== id));
  const rows = [...document.querySelectorAll('.row')];

  const reset = () => rows.forEach(r => {
    r.dataset.pick = '';
    r.querySelectorAll('.opt').forEach(b => b.dataset.sel = '');
  });

  rows.forEach(r => r.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
    r.querySelectorAll('.opt').forEach(x => x.dataset.sel = '');
    b.dataset.sel = 'true';
    r.dataset.pick = b.dataset.v;
    if (rows.every(x => x.dataset.pick)) {
      const benar = rows.every(x => x.dataset.pick === x.dataset.answer);
      setTimeout(() => show(benar ? 'benar' : 'salah'), 400);
    }
  })));

  $('to-match').onclick = () => { reset(); show('match'); };
  document.querySelectorAll('.ulangi').forEach(b => b.onclick = () => { reset(); show('match'); });
  document.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) show(go.dataset.go);
  });
  show('intro');
}

/* ---------- Kuis + skor ---------- */
function initKuis() {
  const { correct, next, start } = document.body.dataset;
  const quiz = $('quiz'), wrong = $('wrong'), bar = $('kembali-bar');
  const hide = (...els) => els.forEach(e => e && e.classList.add('hidden'));
  let terkunci = false;

  if (start) saveSkor({ benar: 0, salah: 0 });

  const tampil = () => {
    const s = getSkor();
    $('skor-benar').textContent = s.benar;
    $('skor-salah').textContent = s.salah;
  };
  tampil();

  document.querySelectorAll('.ans').forEach(btn => btn.addEventListener('click', () => {
    if (terkunci) return;
    terkunci = true;
    const s = getSkor();
    const benar = btn.dataset.k === correct;
    benar ? s.benar++ : s.salah++;
    saveSkor(s); tampil();
    btn.dataset.state = benar ? 'ok' : 'no';
    if (benar) setTimeout(() => { location.href = next; }, 600);
    else setTimeout(() => { hide(quiz, bar); wrong.classList.remove('hidden'); }, 500);
  }));

  $('kembali-wrong').onclick = () => {
    document.querySelectorAll('.ans').forEach(b => b.dataset.state = '');
    hide(wrong);
    quiz.classList.remove('hidden');
    bar.classList.remove('hidden');
    terkunci = false;
  };
}

/* ---------- Halaman hasil ---------- */
function initHasil() {
  const { benar, salah } = getSkor();
  const total = benar + salah;
  const nilai = total ? Math.round(benar / total * 100) : 0;

  $('h-benar').textContent = benar;
  $('h-salah').textContent = salah;
  $('h-nilai').textContent = nilai;
  $('h-bar').style.width = nilai + '%';
  $('h-pesan').textContent =
    nilai >= 80 ? 'Hebat! Kamu menguasai materi ekosistem.' :
    nilai >= 60 ? 'Bagus! Sedikit lagi sempurna.' :
                  'Tetap semangat, pelajari materinya lagi ya!';

  if (nilai === 100 && salah === 0 && benar > 0) {
    $('award').classList.remove('hidden');
    $('h-pesan').textContent = 'Luar biasa! Nilai sempurna!';
    const warna = ['#16a05f', '#f5b301', '#5b9ff5', '#ff7a7a', '#7be8a6'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = warna[i % warna.length];
      c.style.animationDelay = Math.random() * 2 + 's';
      c.style.animationDuration = 3 + Math.random() * 2 + 's';
      document.body.appendChild(c);
    }
  }
}

/* ---------- Video materi (modal) ---------- */
function initVideo() {
  const btn = $('btn-video'), modal = $('video-modal');
  if (!btn || !modal) return;
  const url = (VIDEO[document.body.dataset.m] || '').trim();

  const isi = () => {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    const fill = 'absolute inset-0 h-full w-full border-0';
    let player;
    if (!url) player = '<p class="absolute inset-0 flex items-center justify-center p-5 text-center text-lg font-semibold text-white">Video untuk materi ini belum tersedia.</p>';
    else if (yt) player = `<iframe class="${fill}" src="https://www.youtube.com/embed/${yt[1]}?rel=0" title="Video materi" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) player = `<video class="${fill}" controls preload="metadata" src="${url}"></video>`;
    else player = `<iframe class="${fill}" src="${url}" title="Video materi" allowfullscreen></iframe>`;
    modal.innerHTML =
      `<div class="relative aspect-video overflow-hidden rounded-xl bg-black">${player}</div>` +
      `<div class="mt-4 flex items-center justify-between gap-3">${url ? `<a class="btn-light" href="${url}" target="_blank" rel="noopener">Buka di tab baru</a>` : '<span></span>'}` +
      `<button class="btn" type="button" id="tutup-video">Tutup</button></div>`;
    $('tutup-video').onclick = () => modal.close();
  };

  btn.onclick = () => { isi(); modal.showModal(); };
  modal.addEventListener('close', () => { modal.innerHTML = ''; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
}
