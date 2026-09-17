async function loadProducts() {
  const catalog = document.querySelector('.catalog');
  try {
    const response = await fetch('http://localhost:3001/products');
    
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    catalog.innerHTML += '<p class="error">Не удалось загрузить товары. Проверьте, запущен ли сервер (json-server)!</p>';
    console.error('Ошибка:', error);
  }
}

function renderProducts(products) {
  const catalog = document.querySelector('.catalog');
  const cartCountEl = document.getElementById('cart-count');

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} тг</p>
      <button>В корзину</button>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => {
      cartCountEl.textContent = Number(cartCountEl.textContent) + 1;
    });

    catalog.appendChild(card);
  });
}

loadProducts();