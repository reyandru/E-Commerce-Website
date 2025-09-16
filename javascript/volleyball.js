const productList = document.getElementById('prodList');
const selectedSport = 'Volleyball';

const savedProducts = JSON.parse(localStorage.getItem('product')) || [];

const filteredProducts = savedProducts.filter(
  p => p.sports?.toLowerCase() === selectedSport.toLowerCase() || 
       p.sport?.toLowerCase() === selectedSport.toLowerCase()
);

function renderProductsBySport() {
  productList.innerHTML = '';

  filteredProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-cont';
    productDiv.setAttribute('data-category', `${product.sport || product.sports} ${product.brand}`);

    productDiv.innerHTML = `
      <div class="prod-images">
        <img src="${product.image}" alt="${product.name}" height="150px">
      </div>
      <div class="prod-desc">
        <h1 class="name">${product.name}</h1>
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

if (filteredProducts.length > 0) {
  renderProductsBySport();
} else {
 productList.innerHTML = '<div class="empty-msg-card"><img src="../assets/empty-storage.png" alt="empty-storage" height="350"/> <p class="empty-msg">No products available for this sport.</p></div>';
}
