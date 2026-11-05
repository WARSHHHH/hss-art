// Мобильное меню
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// Аккордеон «Часто спрашивают»
document.querySelectorAll('.acc').forEach(item => {
  const btn = item.querySelector('.acc__btn');
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

// Форма обратной связи (демо: данные никуда не отправляются), есть только на главной
if (document.getElementById('leadForm')) {
  const form = document.getElementById('leadForm');
  const msg = form.querySelector('.form__msg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name;
    const phone = form.elements.phone;
    const phoneOk = phone.value.replace(/\D/g, '').length >= 10;

    name.classList.toggle('is-error', !name.value.trim());
    phone.classList.toggle('is-error', !phoneOk);

    if (!name.value.trim() || !phoneOk) {
      msg.textContent = 'Укажите имя и телефон.';
      return;
    }

    // TODO: здесь подключите отправку на сервер, например fetch('/api/lead', { method: 'POST', body: new FormData(form) })
    msg.textContent = 'Спасибо! Мы свяжемся с вами.';
    form.reset();
  });
}

// Тень у шапки при прокрутке
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.06)' : 'none';
}, { passive: true });


// Подсветка пункта меню по текущему разделу
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...nav.querySelectorAll('a')];

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spy.observe(s));


// Если картинка не нашлась, прячем значок «битой» картинки (место под неё остаётся)
document.querySelectorAll('img').forEach(img => {
  const hide = () => { img.style.visibility = 'hidden'; };
  img.addEventListener('error', hide);
  if (img.complete && img.naturalWidth === 0) hide();
});
