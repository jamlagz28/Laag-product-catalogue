const apiUrl = 'data.json';
const cartItems = []; // Initialize an empty array to store cart items

// Function to render the cart table
function renderCartTable() {
    const cartTable = document.getElementById('cart-table');
    const tbody = cartTable.querySelector('tbody');
    tbody.innerHTML = '';

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td>`;
        tbody.appendChild(row);
    });
}

// Function to fetch and display products
async function fetchAndDisplayProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        displayProducts(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display products
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card');

        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.alt = product.name; // Set alt attribute for accessibility

        if (product['image URL']) {
            // Set the image source if the URL is provided
            img.src = product['image URL'];
        } else {
            // Use a default placeholder image if no URL is provided
            img.src = 'placeholder.jpg';
        }

        // Handle image load errors
        img.onerror = function () {
            // Replace with placeholder image if the original image fails to load
            this.src = 'placeholder.jpg';
        };

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = product.name;

        const price = document.createElement('p');
        price.classList.add('card-text');
        price.textContent = `Price: ₱${product.price}`;

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.textContent = product.description;

        const lastUpdated = document.createElement('small');
        lastUpdated.classList.add('text-muted');
        lastUpdated.textContent = `Added on: ${product['date added']}`;

        // Add "Add to Cart" button
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.classList.add('btn', 'btn-primary', 'mt-3'); // Adding a margin-top for spacing

        // Counter for the button
        let counter = 0;
        const counterDisplay = document.createElement('span');
        counterDisplay.textContent = counter;
        addToCartButton.appendChild(counterDisplay);

        addToCartButton.addEventListener('click', () => {
            // Increase the counter when the button is clicked
            counter++;
            counterDisplay.textContent = counter;
            console.log(`Product ${product.name} added to cart. Total: ${counter}`);

            // Add item to cartItems array
            const itemIndex = cartItems.findIndex(item => item.id === product.id);
            if (itemIndex !== -1) {
                // If item already exists in cart, update its quantity
                cartItems[itemIndex].quantity++;
            } else {
                // If item is not in cart, add it
                cartItems.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }

            // Update cart table
            renderCartTable();
        });

        cardBody.appendChild(title);
        cardBody.appendChild(price);
        cardBody.appendChild(description);
        cardBody.appendChild(lastUpdated);
        cardBody.appendChild(addToCartButton); // Appending the button after the lastUpdated element

        productCard.appendChild(img);
        productCard.appendChild(cardBody);

        productList.appendChild(productCard);
    });
}

// Call function to fetch and display products
fetchAndDisplayProducts();
