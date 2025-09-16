document.addEventListener('DOMContentLoaded', () => {
const modal = document.getElementById('addModal');
const closeBtn = document.getElementById('closeModal');
const openModalBtn = document.getElementById('openModal');
const confirmModal = document.getElementById('confirmModal');

const addProductBtn = document.getElementById('addProd');
const prodSport = document.getElementById('selectSports');
const prodBrand = document.getElementById('brand');
const prodName = document.getElementById('name');
const prodPrice = document.getElementById('price');
const prodQty = document.getElementById('qty');
const prodImg = document.getElementById('images');

const data = document.getElementById('addProds');

const dataContainer = document.getElementById('prodData');

let saveProducts = JSON.parse(localStorage.getItem('product')) || [];
let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

function addNewProduct(){
  const sportsPick = prodSport.value;
  const brandsPick = prodBrand.value.trim();
  const namePick = prodName.value.trim();
  const price = parseFloat(prodPrice.value);
  const qty = parseInt(prodQty.value);
  const file = prodImg.files[0];

  if(!sportsPick || !namePick|| !brandsPick || isNaN(price) || isNaN(qty) || !file){
    alert("Please fill in all fields correctly.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function () {
    const img = new Image();
    img.src = reader.result;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const imageDataTransparent = canvas.toDataURL();

      const productsAdd = {
        sports: sportsPick,
        name: namePick,
        brand: brandsPick,
        price,
        quantity: qty,
        image: imageDataTransparent
      };

      saveProducts.push(productsAdd);
      localStorage.setItem('product', JSON.stringify(saveProducts));

      alert('Product added successfully');
      modal.style.display = 'none';
      prodSport.value = '';
      prodName.value = '';
      prodBrand.value = '';
      prodPrice.value = '';
      prodQty.value = '';
      prodImg.value = '';
    };
  };

  reader.onerror = function () {
    alert("Failed to read image file.");
  };
}

addProductBtn.addEventListener('click', addNewProduct);

function addData() {
  data.innerHTML = '';

  saveProducts.forEach((allProd, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `  
      <td>${i + 1}</td>
      <td>${allProd.sports}</td>
      <td>${allProd.brand}</td>
      <td>${allProd.name}</td>
      <td>$${allProd.price}</td>
      <td>${allProd.quantity}</td>
      <td><button class="removeProd"><img src="../assets/cancel.png" height="30px"/></button></td>      
    `;

    tr.querySelector('.removeProd').addEventListener('click', () => {
      const yes = document.getElementById('yes');
      const no = document.getElementById('no');
      confirmModal.style.display = 'flex';
      yes.addEventListener('click', () => {
        saveProducts.splice(i, 1);
        cartProducts.splice(i, 1);
        localStorage.setItem('product', JSON.stringify(saveProducts));
        addData();
        confirmModal.style.display = 'none';
      });
      no.addEventListener('click', () => {
        confirmModal.style.display = 'none';
      });
      
    });

    data.appendChild(tr);
  });
  modal.style.display = 'none';
}


function openModal() {
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

function closeModalHandler() {
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (saveProducts.length === 0) {
    dataContainer.innerHTML = '<div class="empty-msg-card"><img src="../assets/empty.png" alt="empty-storage" height="350"/> <p class="empty-msg">No products data available.</p></div>';
  }
  addData();
  openModal();
  closeModalHandler();
});

});