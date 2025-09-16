const dateTime = document.getElementById('dateTime');
const data = document.getElementById('buyProds');
const checkout = document.getElementById('checkout');
const totalCost = document.getElementById('totalCost');
const confirmModal = document.getElementById('confirmModal');
const reciept = document.getElementById('recieptCost');

function dateNow() {
  const date = new Date();
  const time = new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).format(date);

  const dates = date.toDateString();
  dateTime.innerHTML = `
    <p>Date: ${dates}</p>
    <p>Time: ${time}</p>
  `;
}

const buyProducts = JSON.parse(localStorage.getItem('buy')) || [];

function addToBuy() {
  data.innerHTML = '';
  let total = 0;

  buyProducts.forEach((allProd, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${allProd.name}</td>
      <td>${allProd.quantity}</td>
      <td class="prices">$${allProd.totalCost}</td>
      <td><button class="removeProd"><img src="../assets/cancel.png" height="30px"/></button></td>      
    `;

    tr.querySelector('.removeProd').addEventListener('click', () => {

      const yes = document.getElementById('yes');
      const no = document.getElementById('no');
      confirmModal.style.display = 'flex';
      yes.addEventListener('click', () => {
        buyProducts.splice(i, 1);
        localStorage.setItem('buy', JSON.stringify(buyProducts));
        addToBuy();
        confirmModal.style.display = 'none';
      });
      no.addEventListener('click', () => {
        confirmModal.style.display = 'none';
      });
      
    
    });

    data.appendChild(tr);
    total += parseFloat(allProd.price) * (parseInt(allProd.quantity) || 1);
  });

  totalCost.innerText = "$" + total.toFixed(2);
}

function checkoutProduct() {
  if (buyProducts.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let products = JSON.parse(localStorage.getItem('product')) || [];

  buyProducts.forEach(buyItem => {
    const productIndex = products.findIndex(prod =>
      prod.name === buyItem.name && prod.brand === buyItem.brand
    );

    if (productIndex !== -1) {
      products[productIndex].quantity -= buyItem.quantity;

      if (products[productIndex].quantity < 0) {
        products[productIndex].quantity = 0;
      }
    }
  });

  localStorage.setItem('product', JSON.stringify(products));

  localStorage.removeItem('buy');
  data.innerHTML = '';
  totalCost.innerText = "$0.00";
  alert("Checkout successful!");
}


checkout.addEventListener('click', checkoutProduct);

setInterval(dateNow, 1000);
dateNow();

if (buyProducts.length > 0) {
  addToBuy(); 
} else {
  reciept.innerHTML = '<div class="empty-msg-card"><img src="../assets/empty-reciept.png" alt="empty-storage" height="150"/> <p class="empty-msg">No product have been purchased.</p></div>';
}
