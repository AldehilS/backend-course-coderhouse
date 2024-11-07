const socket = io();
const productsList = document.getElementById('products-list');
const addProductForm = document.getElementById('product-add');
const deleteProductForm = document.getElementById('product-delete');

socket.on('products', products => {
    productsList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.textContent = product.title;
        productsList.appendChild(productElement);
    });
})

socket.on('error', error => {
    alert(error.error);
});

addProductForm.addEventListener('submit', event => {
    event.preventDefault();

    console.log('Form submitted');

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    let price = document.getElementById('price').value;
    let stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;

    try {
        price = Number(price);
        stock = Number(stock);
    } catch (error) {
        alert('Price and stock must be numbers');
        return;
    }

    const product = { title, description, code, price, stock, category };
    console.log(product);

    socket.emit('new-product', product);
});

deleteProductForm.addEventListener('submit', event => {
    event.preventDefault();

    const id = document.getElementById('delete-id').value;
    socket.emit('delete-product', Number(id));
});