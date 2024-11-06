const socket = io();
const productsList = document.getElementById('products-list');
const addProductForm = document.getElementById('product-add');

socket.on('products', products => {
    productsList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.textContent = product.title;
        productsList.appendChild(productElement);
    });
})

addProductForm.addEventListener('submit', event => {
    event.preventDefault();

    console.log('Form submitted');

    const title = document.getElementById('title').value;
    const description = document.getElementById('price').value;

    const product = { title, description };

    socket.emit('new-product', product);
});