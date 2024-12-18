// Review Button Logic
let turn = document.querySelector('.switch');
let btn = document.querySelector('.review button');
let angle = document.querySelector('.angleup i');

btn.addEventListener('click', (e) => {
        if (e.target.contains(btn)) {
                turn.classList.toggle('toggle');
                if (angle.classList.contains("fa-angle-up")) {
                        angle.classList.remove("fa-angle-up");
                        angle.classList.add("fa-angle-down");
                }
                else {
                        angle.classList.remove("fa-angle-down");
                        angle.classList.add("fa-angle-up");
                }
        }
});
// End

// Cart functionality start
class Cart {
        constructor() {
                this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                this.initCart();
        }

        initCart() {
                let cart = document.querySelector('.cart button');
                cart.addEventListener('click', () => {
                        let cartContent = document.querySelector('.cartContent');
                        cartContent.style.display = 'block';
                        cartContent.innerHTML = `
                        <h2>Your Cart  <i class="fa-solid fa-xmark"></i></h2> 
                        <span></span>
                        <ul class="cartItems"></ul>
                        <button>CheckOut<button>
                `;

                        // Close cart when clicking outside
                        document.addEventListener('click', (e) => {
                                if (!cartContent.contains(e.target) && !cart.contains(e.target)) {
                                        cartContent.style.display = 'none';
                                }
                        });

                        // Prevent closing when clicking inside the cart
                        cartContent.addEventListener('click', (e) => {
                                e.stopPropagation();
                        });

                        let xmark = document.querySelector('.cartContent h2 i');
                        xmark.addEventListener('click', () => {
                                cartContent.style.display = 'none';
                        });

                        this.renderCartItems();
                });
        }

        // Create a function so items gets added into the cart
        addToCart(product) {
                const existingItem = this.cartItems.find(item => item.id === product.id);
                if (!existingItem) {
                        this.cartItems.push(product);
                        this.updateLocalStorage();
                        console.log(`${product} added to the cart!`, this.cartItems);
                        this.showNotification(`${product.name} added to the cart!!!`);
                } else {
                        this.showNotification(`${product.name} is already in the cart!!!`, true);
                }
        }

        // For Rendering the cart Items
        renderCartItems() {
                const cartList = document.querySelector('.cartContent ul');
                const span = document.querySelector('.cartContent span');
                cartList.innerHTML = '';

                if (this.cartItems.length === 0) {
                        span.textContent = 'Your cart is empty.';
                        let checkOut = document.querySelector('.cartContent button');
                        checkOut.style.display = 'none';
                }
                else {
                        span.textContent = '';
                        let checkOut = document.querySelector('.cartContent button');
                        checkOut.style.display = 'block';

                        this.cartItems.forEach(item => {
                                const li = document.createElement('li');
                                li.innerHTML = `
                                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                                    ${item.name} - ${item.price}Rs
                                    <button data-id="${item.id}" class="remove-btn"><i class="fa-solid fa-xmark"></i></button>
                                `;
                                cartList.appendChild(li);
                        })
                        // Add event listeners to the remove buttons
                        const removeButtons = cartList.querySelectorAll('.remove-btn');
                        removeButtons.forEach(button => {
                                button.addEventListener('click', (e) => {
                                        const productId = Number(e.target.closest('button').dataset.id);
                                        this.removeFromCart(productId);
                                });
                        });
                }
        }

        // Update localStorage whenever the cart items change
        updateLocalStorage() {
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }

        // Create a function so that product don't duplicate in the cart

        showNotification(message, isWarning = false) {
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: ${isWarning ? 'rgb(252, 90, 90)' : '#4CAF50'};
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    animation: fadeOut 2s forwards;
                `;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
        }

        removeFromCart(productId) {
                // Filter out the product with the given ID
                this.cartItems = this.cartItems.filter(item => item.id !== productId);

                // Update localStorage and re-render the cart
                this.updateLocalStorage();
                this.renderCartItems();

                // Show a notification
                this.showNotification(`Product removed from the cart!`, true);
        }

}
// End

// Invoking the cart instance
const selectedCart = new Cart();
// End

// Product Handling
fetch("p.json")
        .then((response) => {
                if (!response.ok) {
                        throw new Error('Network response is not ok');
                }
                return response.json();
        })
        .then((data) => {
                console.log(data);
                let productContainer = document.querySelector('.product');
                if (!productContainer) {
                        console.error('Product container is not found in the dom');
                        return;
                }
                // For displaying the product
                data.forEach((product) => {
                        let html = '';
                        html += `
                        <div class="p1">
                                <img src="${product.image}" alt="bean-product-1">
                                <div class="n1">
                                        Name : ${product.name}
                                        <div class="pr1">
                                                 Price : ${product.price}Rs
                                         </div>
                                </div>
                                <div>
                                        <button class="shop-btn" data-id="${product.id}">AddToCart</button>
                                </div>
                        </div>
                `;
                        productContainer.insertAdjacentHTML('beforeend', html);
                });

                // Add event listeners to buttons
                const buttons = document.querySelectorAll('.shop-btn');
                buttons.forEach((button) => {
                        button.addEventListener('click', (e) => {
                                const productId = Number(e.target.dataset.id);
                                const selectedProduct = data.find((product) => product.id === productId);

                                if (selectedProduct) {
                                        selectedCart.addToCart(selectedProduct);
                                } else {
                                        console.error('Product not found for ID:', productId);
                                }
                        });
                });
        })
        .catch((error) => {
                console.error('error fetching product : ', error);
                selectedCart.showNotification(`Failed to load products. Plz try again`, true);
        })
// End




