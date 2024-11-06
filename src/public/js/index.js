const socket = io();
const productsList = document.getElementById('products-list');

socket.on('products', products => {
    productsList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.textContent = product.title;
        productsList.appendChild(productElement);
    });
})