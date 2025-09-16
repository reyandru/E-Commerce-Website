const productList = document.getElementById('prodList');
const brandFilter = document.getElementById('brandFilter');
const sportsFilter = document.getElementById('sportsFilter');
const profile = document.getElementById('profile');
const profDD = document.getElementById('profDropDown');
const searchProd = document.getElementById('searchItems');


  const savedProducts = JSON.parse(localStorage.getItem('product')) || [];

profile.addEventListener('click', () => {
  profDD.classList.toggle('active');
});

export function renderProductList() {
  productList.innerHTML = ''; 

  const savedProducts = JSON.parse(localStorage.getItem('product')) || [];

  savedProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-cont';
    productDiv.setAttribute('data-category', `${product.sports} ${product.brand}`);

    productDiv.innerHTML = `
      <div class="prod-images">
        <img src="${product.image}" alt="${product.sports}" height="150px">
      </div>
      <div class="prod-desc">
        <h1 class="name">${product.brand}</h1>
        <h3 class="price">$${product.price}</h3>
      </div>
      <div class="prod-buttons">
        <button class="add-cart">Add to cart</button>
        <button class="buy-now">Buy</button>
      </div>
    `;

    productDiv.addEventListener('click', () => showProductModal(product));

    productList.appendChild(productDiv);
  });
}

function brandsFilters(){
  const brandFilter = document.getElementById('brandFilter');
  const savedProducts = JSON.parse(localStorage.getItem('product')) || [];

  const uniqueBrands = new Set();

  savedProducts.forEach(prod => {
    uniqueBrands.add(prod.brand);
  });

  let options = `<option value="none">All</option>`;
  uniqueBrands.forEach(brand => {
    options += `<option value="${brand.toLowerCase()}">${brand}</option>`;
  });

  brandFilter.innerHTML = options;
}

function sportsFilters(){
  const sportsFilter = document.getElementById('sportsFilter');
  const savedProducts = JSON.parse(localStorage.getItem('product')) || [];

  const uniqueSports = new Set();

  savedProducts.forEach(prod => {
    uniqueSports.add(prod.sports);
  });

  let options = `<option value="none">All</option>`;
  uniqueSports.forEach(sport => {
    options += `<option value="${sport.toLowerCase()}">${sport}</option>`;
  });

  sportsFilter.innerHTML = options;
}

sportsFilters();
brandsFilters();


function filterProducts() {
  const selectedSport = sportsFilter.value;
  const selectedBrand = brandFilter.value.toLowerCase();
  const searchProduct = searchProd.value.toLowerCase();

  const products = document.querySelectorAll('.product-cont');

  products.forEach(product => {
    const data = product.getAttribute('data-category').toLowerCase();

    const sportMatch = selectedSport === 'none' || data.includes(selectedSport);
    const brandMatch = selectedBrand === 'none' || data.includes(selectedBrand);
    const searchMatch = searchProduct === '' || data.includes(searchProduct);

    product.style.display = sportMatch && brandMatch && searchMatch ? 'flex' : 'none';
  });
}

sportsFilter.addEventListener('change', filterProducts);
brandFilter.addEventListener('change', filterProducts);
searchProd.addEventListener('input', filterProducts);


const saveCart = JSON.parse(localStorage.getItem('cart')) || [];

export function showProductModal(product) {
  if (document.getElementById('viewProd')) return;

  const modal = document.createElement('div');
  modal.className = 'view-product';
  modal.id = 'viewProd';

  modal.innerHTML = `
    <div class="prod-view-images">
      <img src="${product.image}" alt="${product.name}" height="150px">
    </div>

    <div class="prod-view-info">
      <div class="close-modal" id="closeModal"><img src="../assets/close.png" alt="Close" height="20px"/></div>
      <div class="prod-view-desc">
        <h1 class="name">${product.brand}</h1>
        <h2 class="name">${product.name}</h2>
        <h3 class="price">$${product.price}</h3>
      </div>

      <div class="quantity-cost">
        <label>
          Quantity:
          <input type="number" name="qty" id="qty" min="1" value="1">
        </label>
        <p>Cost: $<span id="cost">0.00</span></p>
      </div>

      <div class="prod-view-buttons">
        <button id="addToCart">Add to cart</button>
        <button id="buy">Buy</button>
      </div>
    </div>
  `;

  const qtyInput = modal.querySelector('#qty');
  const costDisplay = modal.querySelector('#cost');

  const updateCost = () => {
    const qty = parseInt(qtyInput.value) || 0;
    costDisplay.textContent = (qty * product.price).toFixed(2);
  };

  qtyInput.addEventListener('input', updateCost);

  modal.querySelector('#closeModal').addEventListener('click', () => {
    modal.remove();
  });

modal.querySelector('#addToCart').addEventListener('click', () => {
  const quantity = parseInt(qtyInput.value) || 1;

  const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItem = {
    id: product.id || `${product.name}-${product.brand}`,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.image,
    quantity: quantity,
    totalCost: quantity * product.price
  };

  const existingIndex = existingCart.findIndex(item =>
    item.name === cartItem.name && item.brand === cartItem.brand
  );

  if (existingIndex >= 0) {
    existingCart[existingIndex].quantity += quantity;
    existingCart[existingIndex].totalCost =
      existingCart[existingIndex].quantity * existingCart[existingIndex].price;
  } else {
    existingCart.push(cartItem);
  }

  const cartJSON = JSON.stringify(existingCart);
  if (cartJSON.length > 5120 * 1024) {
    alert('Cart too large to store. Please remove some items.');
    return;
  }

  localStorage.setItem('cart', cartJSON);

  alert('Added to cart!');
  modal.remove();
});


  modal.querySelector('#buy').addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value) || 1;

  const recieptStorage = JSON.parse(localStorage.getItem('buy')) || [];

  const cartItem = {
    id: product.id || `${product.name}-${product.brand}`,
    name: product.name,
    price: product.price,
    brand: product.brand,
    quantity: quantity,
    totalCost: quantity * product.price
  };

  const existingIndex = recieptStorage.findIndex(item =>
    item.name === cartItem.name && item.brand === cartItem.brand
  );

  if (existingIndex >= 0) {
    recieptStorage[existingIndex].quantity += quantity;
    recieptStorage[existingIndex].totalCost =
      recieptStorage[existingIndex].quantity * recieptStorage[existingIndex].price;
  } else {
    recieptStorage.push(cartItem);
  }

  const buyJSON = JSON.stringify(recieptStorage);
  if (buyJSON.length > 5120 * 1024) {
    alert('Cart too large to store. Please remove some items.');
    return;
  }

  localStorage.setItem('buy', buyJSON);

  alert('Added to reciept!');
  modal.remove();
  });

  document.body.appendChild(modal);

  updateCost();
}


if (savedProducts.length > 0) {
  renderProductList();
} else {
  productList.innerHTML = '<div class="empty-msg-card"><img src="assets/empty-storage.png" alt="empty-storage" height="300"/> <p class="empty-msg">No products available.</p></div>';
}
