// Корзина: хранится в localStorage, общая для index.html и product.html
(() => {
  const KEY = 'hss-cart';
  const products = window.PRODUCTS || [];
  const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const find = id => products.find(p => p.id === id);

  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { items = []; }
  items = items.filter(i => find(i.id));

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* хранилище недоступно */ }
  };
  const priceOf = i => (find(i.id).sizes.find(s => s.label === i.size) || find(i.id).sizes[0]).price;
  const count = () => items.reduce((sum, i) => sum + i.qty, 0);
  const total = () => items.reduce((sum, i) => sum + priceOf(i) * i.qty, 0);

  // Кнопка в шапке
  const headerIn = document.querySelector('.header__in');
  const btn = document.createElement('button');
  btn.className = 'cart-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Открыть корзину');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg><span class="cart-btn__count" hidden>0</span>';
  headerIn.appendChild(btn);
  const badge = btn.querySelector('.cart-btn__count');

  // Панель корзины
  const cart = document.createElement('div');
  cart.className = 'cart';
  cart.innerHTML = `
    <div class="cart__overlay" data-close></div>
    <aside class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <div class="cart__head">
        <h2 id="cartTitle">Корзина</h2>
        <button class="cart__close" type="button" aria-label="Закрыть" data-close>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <ul class="cart__list"></ul>
      <p class="cart__empty">Пока пусто. Добавьте краску из каталога.</p>
      <div class="cart__foot">
        <div class="cart__total"><span>Итого</span><strong></strong></div>
        <button class="btn btn--dark cart__order" type="button">Оформить заказ</button>
      </div>
    </aside>`;
  document.body.appendChild(cart);

  const list = cart.querySelector('.cart__list');
  const empty = cart.querySelector('.cart__empty');
  const foot = cart.querySelector('.cart__foot');
  const totalEl = cart.querySelector('.cart__total strong');
  const closeBtn = cart.querySelector('.cart__close');

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer;
  const showToast = text => {
    toast.textContent = text;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
  };

  const render = () => {
    const n = count();
    badge.textContent = n;
    badge.hidden = n === 0;
    empty.hidden = n > 0;
    foot.hidden = n === 0;
    totalEl.textContent = money(total());
    list.innerHTML = items.map((i, idx) => {
      const p = find(i.id);
      return `
        <li class="cart-item">
          <div class="cart-item__img"><img src="${p.img}" alt=""></div>
          <div class="cart-item__info">
            <h3>${p.name}</h3>
            <p>${i.size} · ${money(priceOf(i))}</p>
            <div class="qty">
              <button type="button" data-act="minus" data-i="${idx}" aria-label="Меньше">−</button>
              <span>${i.qty}</span>
              <button type="button" data-act="plus" data-i="${idx}" aria-label="Больше">+</button>
            </div>
          </div>
          <button class="cart-item__del" type="button" data-act="del" data-i="${idx}" aria-label="Удалить ${p.name}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </li>`;
    }).join('');
    save();
  };

  let lastFocus;
  const open = () => {
    lastFocus = document.activeElement;
    cart.classList.add('is-open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  };
  const close = () => {
    cart.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  };

  const add = (id, size) => {
    const p = find(id);
    if (!p) return;
    size = size || p.sizes[0].label;
    const row = items.find(i => i.id === id && i.size === size);
    if (row) row.qty += 1; else items.push({ id, size, qty: 1 });
    render();
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
    showToast(p.name + ' добавлена в корзину');
  };

  btn.addEventListener('click', open);
  cart.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return close();
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const i = items[+b.dataset.i];
    if (!i) return;
    if (b.dataset.act === 'plus') i.qty += 1;
    if (b.dataset.act === 'minus') i.qty -= 1;
    if (b.dataset.act === 'del' || i.qty <= 0) items.splice(+b.dataset.i, 1);
    render();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cart.classList.contains('is-open')) close();
  });

  // Кнопки «В корзину» на любой странице
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const sel = b.closest('.card') && b.closest('.card').querySelector('select');
    add(b.dataset.add, sel ? sel.value : null);
  });

  // Цена «от …» на карточках главной
  document.querySelectorAll('[data-price-from]').forEach(el => {
    const p = find(el.dataset.priceFrom);
    if (p) el.textContent = 'от ' + money(Math.min(...p.sizes.map(s => s.price)));
  });

  // Окно оформления заказа
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal__overlay" data-mclose></div>
    <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="orderTitle">
      <button class="modal__close" type="button" aria-label="Закрыть" data-mclose>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <form class="order" novalidate>
        <p class="eyebrow">Оформление заказа</p>
        <h2 id="orderTitle">Ваши данные</h2>
        <p class="order__sum"></p>
        <div class="field">
          <label for="o-name">Имя *</label>
          <input id="o-name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="o-phone">Телефон *</label>
          <input id="o-phone" name="phone" type="tel" autocomplete="tel" placeholder="+7 ___ ___-__-__" required>
        </div>
        <div class="field">
          <label for="o-email">Email</label>
          <input id="o-email" name="email" type="email" autocomplete="email">
        </div>
        <fieldset class="order__switch">
          <legend class="sr">Способ получения</legend>
          <label><input type="radio" name="delivery" value="delivery" checked><span>Доставка</span></label>
          <label><input type="radio" name="delivery" value="pickup"><span>Самовывоз</span></label>
        </fieldset>
        <div class="field" data-address>
          <label for="o-address">Адрес доставки *</label>
          <input id="o-address" name="address" type="text" autocomplete="street-address">
        </div>
        <div class="field">
          <label for="o-comment">Комментарий</label>
          <textarea id="o-comment" name="comment" rows="3" placeholder="Оттенок, удобное время звонка…"></textarea>
        </div>
        <label class="check"><input type="checkbox" name="agree"><span>Согласен на обработку персональных данных</span></label>
        <p class="order__err" role="alert"></p>
        <button class="btn btn--dark order__submit" type="submit">Отправить заказ</button>
      </form>
      <div class="order-done" hidden>
        <h2>Спасибо!</h2>
        <p>Заказ принят. Мы свяжемся с вами, чтобы подтвердить состав и детали.</p>
        <button class="btn btn--outline" type="button" data-mclose>Закрыть</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const form = modal.querySelector('.order');
  const done = modal.querySelector('.order-done');
  const err = modal.querySelector('.order__err');
  const addrField = modal.querySelector('[data-address]');
  const addrInput = form.elements.address;

  const setDelivery = () => {
    const pickup = form.elements.delivery.value === 'pickup';
    addrField.hidden = pickup;
    addrInput.required = !pickup;
  };

  const openModal = () => {
    if (!items.length) return;
    close();
    form.hidden = false;
    done.hidden = true;
    err.textContent = '';
    modal.querySelector('.order__sum').textContent =
      `Товаров: ${count()} · к оплате ${money(total())}`;
    setDelivery();
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    form.elements.name.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  cart.querySelector('.cart__order').addEventListener('click', openModal);
  modal.addEventListener('click', e => { if (e.target.closest('[data-mclose]')) closeModal(); });
  form.addEventListener('change', e => { if (e.target.name === 'delivery') setDelivery(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements;
    const phoneOk = f.phone.value.replace(/\D/g, '').length >= 10;
    const emailOk = !f.email.value.trim() || /^\S+@\S+\.\S+$/.test(f.email.value.trim());
    const needAddr = f.delivery.value === 'delivery';

    const bad = [];
    const mark = (el, isBad) => { el.classList.toggle('is-error', isBad); if (isBad) bad.push(el); };
    mark(f.name, !f.name.value.trim());
    mark(f.phone, !phoneOk);
    mark(f.email, !emailOk);
    mark(f.address, needAddr && !f.address.value.trim());

    if (bad.length) {
      err.textContent = 'Проверьте выделенные поля.';
      return bad[0].focus();
    }
    if (!f.agree.checked) {
      err.textContent = 'Нужно согласие на обработку персональных данных.';
      return f.agree.focus();
    }

    const order = {
      customer: {
        name: f.name.value.trim(),
        phone: f.phone.value.trim(),
        email: f.email.value.trim(),
        delivery: f.delivery.value,
        address: needAddr ? f.address.value.trim() : '',
        comment: f.comment.value.trim()
      },
      items: items.map(i => ({ id: i.id, name: find(i.id).name, size: i.size, qty: i.qty, price: priceOf(i) })),
      total: total()
    };
    // TODO: отправьте заказ на сервер или в почту, например:
    // fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
    console.log('Новый заказ:', order);

    items = [];
    render();
    form.reset();
    err.textContent = '';
    form.hidden = true;
    done.hidden = false;
  });

  // Синхронизация между вкладками
  window.addEventListener('storage', e => {
    if (e.key !== KEY) return;
    try { items = JSON.parse(e.newValue) || []; } catch (err) { items = []; }
    render();
  });

  render();
  window.HSSCart = { add, open, close };
})();
