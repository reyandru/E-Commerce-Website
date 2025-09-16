const profDD = document.getElementById('profDropDown');
const sportsFilt = document.getElementById('sportsFilter');
const brandsFilt = document.getElementById('brandFilter');
const prodCart = document.getElementById('prodCartList');
const confirmModal = document.getElementById('confirmModal');

document.getElementById('profile').addEventListener('click', () => {
  profDD.classList.toggle('active');
});

const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

function renderProductList() {
  prodCart.innerHTML = '';
  const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

  cartProducts.forEach((product, index) => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-cont';
    productDiv.setAttribute('data-category', `${product.sports} ${product.brand}`);
    productDiv.setAttribute('data-index', index);

    productDiv.innerHTML = `
      <div class="prod-images">
        <img src="${product.image}" alt="${product.name}" height="150px">
      </div>
      <div class="prod-info">
        <button class="remove-toCart">Remove</button>
        <div class="prod-desc">
          <h1 class="name">${product.name}</h1>
          <h3 class="price">$${product.price}</h3>
        </div>
        <div class="quantity-cost">
          <label>
            Quantity:
            <input type="number" class="qty-input" min="1" value="${product.quantity}">
          </label>
          <p>Cost: $<span class="cost-output">${product.totalCost.toFixed(2)}</span></p>
        </div>
        <div class="prod-buttons">
          <button class="buy-now">Buy</button>
        </div>
      </div>
    `;

    const qtyInput = productDiv.querySelector('.qty-input');
    const costOutput = productDiv.querySelector('.cost-output');

    qtyInput.addEventListener('input', () => {
      const qty = parseInt(qtyInput.value) || 1;
      const newTotal = qty * product.price;
      costOutput.textContent = newTotal.toFixed(2);
      cartProducts[index].quantity = qty;
      cartProducts[index].totalCost = newTotal;
      localStorage.setItem('cart', JSON.stringify(cartProducts));
    });

    const removeBtn = productDiv.querySelector('.remove-toCart');
    removeBtn.addEventListener('click', () => {
      const yes = document.getElementById('yes');
      const no = document.getElementById('no');
      confirmModal.style.display = 'flex';
      yes.addEventListener('click', () => {
        cartProducts.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartProducts));
        renderProductList();
        confirmModal.style.display = 'none';
      });
      no.addEventListener('click', () => {
        confirmModal.style.display = 'none';
      });
     
    });

    prodCart.appendChild(productDiv);
  });
}

function buyProduct(index) {
  const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
  const product = cartProducts[index];
  const recieptStorage = JSON.parse(localStorage.getItem('buy')) || [];

  const cartItem = {
    id: product.id || `${product.name}-${product.brand}`,
    name: product.name,
    brand: product.brand,
    price: product.price,
    quantity: product.quantity,
    totalCost: product.totalCost
  };

  const existingIndex = recieptStorage.findIndex(item =>
    item.name === cartItem.name && item.brand === cartItem.brand
  );

  if (existingIndex >= 0) {
    recieptStorage[existingIndex].quantity += cartItem.quantity;
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
  cartProducts.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cartProducts));
  renderProductList();
  alert('Added to receipt!');
}

function filterProducts() {
  const selectedSport = sportsFilt.value.toLowerCase();
  const selectedBrand = brandsFilt.value.toLowerCase();
  const products = document.querySelectorAll('.product-cont');

  products.forEach(product => {
    const data = product.getAttribute('data-category').toLowerCase();
    const sportMatch = selectedSport === 'none' || data.includes(selectedSport);
    const brandMatch = selectedBrand === 'none' || data.includes(selectedBrand);
    product.style.display = sportMatch && brandMatch ? 'flex' : 'none';
  });
}

prodCart.addEventListener('click', function (e) {
  if (e.target.classList.contains('buy-now')) {
    const parent = e.target.closest('.product-cont');
    const index = parseInt(parent.getAttribute('data-index'));
    buyProduct(index);
  }
});

sportsFilt.addEventListener('change', filterProducts);
brandsFilt.addEventListener('change', filterProducts);



if (cartProducts.length > 0) {
  renderProductList();
} else {
  prodCart.innerHTML = '<div class="empty-msg-card"><img src="../assets/empty-cart.png" alt="empty-storage" height="350"/> <p class="empty-msg">No products have been added to the cart.</p></div>';
}