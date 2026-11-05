// Страница «Все продукты»: карточки из products.js + фильтр
(() => {
  const grid = document.getElementById('productGrid');
  const chips = document.querySelectorAll('.chip');
  const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

  const card = p => `
    <article class="card" data-cats="${p.cats.join(' ')}">
      <div class="card__img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="card__buy">
        <label class="sr" for="size-${p.id}">Объём ${p.name}</label>
        <select id="size-${p.id}" class="card__size" data-price-for="${p.id}">
          ${p.sizes.map(s => `<option value="${s.label}">${s.label}</option>`).join('')}
        </select>
        <span class="card__price" id="price-${p.id}">${money(p.sizes[0].price)}</span>
        <button class="btn btn--dark" type="button" data-add="${p.id}">В корзину</button>
      </div>
    </article>`;

  grid.innerHTML = window.PRODUCTS.map(card).join('');

  grid.addEventListener('change', e => {
    const sel = e.target.closest('select');
    if (!sel) return;
    const p = window.PRODUCTS.find(x => x.id === sel.dataset.priceFor);
    const size = p.sizes.find(s => s.label === sel.value);
    document.getElementById('price-' + p.id).textContent = money(size.price);
  });

  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-pressed', String(c === chip));
    });
    const cat = chip.dataset.filter;
    grid.querySelectorAll('.card').forEach(c => {
      c.hidden = cat !== 'all' && !c.dataset.cats.split(' ').includes(cat);
    });
  }));
})();
