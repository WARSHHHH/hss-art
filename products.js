// Каталог. Чтобы добавить товар, скопируйте любой объект ниже и поменяйте поля.
// ВАЖНО: цены и объёмы здесь временные, замените на реальные.
// cats: primer — грунты, walls — для стен, ceiling — для потолков
window.PRODUCTS = [
  {
    id: 'fast-premier',
    name: 'HSS ART FAST PREMIER',
    desc: 'Полуматовая краска-грунт для интерьера. Подходит для подготовки стен и потолков.',
    img: 'img/banka1.jpg',
    cats: ['primer', 'walls', 'ceiling'],
    sizes: [
      { label: '0,9 л', price: 890 },
      { label: '2,7 л', price: 2290 },
      { label: '9 л', price: 6990 }
    ]
  },
  {
    id: 'uno-primer',
    name: 'HSS ART UNO PRIMER',
    desc: 'Универсальный грунт для внутренних работ.',
    img: 'img/banka2.jpg',
    cats: ['primer'],
    sizes: [
      { label: '0,9 л', price: 790 },
      { label: '2,7 л', price: 1990 },
      { label: '9 л', price: 5990 }
    ]
  },
  {
    id: 'paint',
    name: 'HSS ART PAINT',
    desc: 'Дизайнерская краска для интерьера.',
    img: 'img/banka3.jpg',
    cats: ['walls'],
    sizes: [
      { label: '0,9 л', price: 1490 },
      { label: '2,7 л', price: 3790 },
      { label: '9 л', price: 11990 }
    ]
  },
  {
    id: 'total-white',
    name: 'HSS ART TOTAL WHITE',
    desc: 'Дизайнерская краска для потолков: высокоукрывистая, глубокоматовая.',
    img: 'img/banka4.jpg',
    cats: ['ceiling'],
    sizes: [
      { label: '0,9 л', price: 990 },
      { label: '2,7 л', price: 2590 },
      { label: '9 л', price: 7990 }
    ]
  },
  {
    id: 'pro-max',
    name: 'HSS ART PRO MAX',
    desc: 'Архитектурная краска для потолка.',
    img: 'img/banka5.jpg',
    cats: ['ceiling'],
    sizes: [
      { label: '0,9 л', price: 890 },
      { label: '2,7 л', price: 2390 },
      { label: '9 л', price: 7490 }
    ]
  },
  {
    id: 'pro-max-wash',
    name: 'HSS ART PRO MAX WASH',
    desc: 'Архитектурная краска для стен и потолков: экстремально стойкая, моющаяся.',
    img: 'img/banka6.jpg',
    cats: ['walls', 'ceiling'],
    sizes: [
      { label: '0,9 л', price: 1190 },
      { label: '2,7 л', price: 3090 },
      { label: '9 л', price: 9490 }
    ]
  }
];
