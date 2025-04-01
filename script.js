// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count badge
    updateCartCount();
    
    // Add event listeners for add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add event listeners for size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', changeSize);
    });
    
    // Add event listener for cart icon
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCartPopup);
    }
    
    // Add event listener for close cart button
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartPopup);
    }
    
    // Add event listener for clear cart button in popup
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Add event listener for clear cart button on cart page
    const clearCartPageBtn = document.getElementById('clear-cart-page');
    if (clearCartPageBtn) {
        clearCartPageBtn.addEventListener('click', clearCart);
    }
    
    // Add event listeners for filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', filterProducts);
    });
    
    // Initialize cart popup
    updateCartPopup();
    
    // Initialize cart page if we're on it
    if (document.querySelector('.cart-items-container')) {
        updateCartPage();
    }
    
    // Initialize checkout page if we're on it
    if (document.getElementById('checkout-items')) {
        updateCheckoutPage();
    }
    
    // Add event listener for checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', placeOrder);
    }
});

// Function to add product to cart
function addToCart(event) {
    // Get product data from button attributes
    const button = event.target;
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const size = button.getAttribute('data-size');
    const image = button.getAttribute('data-image');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === id && item.size === size
    );
    
    if (existingItemIndex !== -1) {
        // If product exists, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If product doesn't exist, add it to cart
        cart.push({
            id,
            name,
            price,
            size,
            image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count badge
    updateCartCount();
    
    // Update cart popup
    updateCartPopup();
    
    // Show success message
    showNotification(`${name} (${size}) added to cart!`);
    
    // If cart popup is not visible, show it
    const cartPopup = document.querySelector('.cart-popup');
    if (cartPopup && !cartPopup.classList.contains('active')) {
        toggleCartPopup();
    }
}

// Function to change product size
function changeSize(event) {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const priceElement = productCard.querySelector('.product-price');
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    
    // Remove active class from all size buttons in this product card
    const sizeButtons = productCard.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Update price display
    const price = button.getAttribute('data-price');
    priceElement.textContent = `Rs${price}`;
    
    // Update add to cart button data attributes
    const size = button.getAttribute('data-size');
    addToCartBtn.setAttribute('data-size', size);
    addToCartBtn.setAttribute('data-price', price);
}

// Function to toggle cart popup
function toggleCartPopup() {
    const cartPopup = document.querySelector('.cart-popup');
    cartPopup.classList.toggle('active');
    
    // Prevent scrolling when cart popup is open
    if (cartPopup.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Function to update cart count badge
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Function to update cart popup
function updateCartPopup() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // If cart is empty, show message
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalPrice.textContent = 'Rs 0.00';
    } else {
        // If cart has items, show them
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-size">${item.size}</div>
                    </div>
                    <div class="cart-item-price">Rs${(itemTotal).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}" data-size="${item.size}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}" data-size="${item.size}">+</button>
                    </div>
                    <div class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
        });
        
        cartTotalPrice.textContent = `Rs${total.toFixed(2)}`;
    }
    
    // Add event listeners for quantity buttons and remove buttons
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
}

// Function to update cart page
function updateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-page');
    const cartSummary = document.getElementById('cart-summary');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // If cart is empty, show message and hide summary
        emptyCartMessage.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        // If cart has items, show them and hide empty message
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartItemsContainer.innerHTML += `
                <div class="cart-item-page" data-id="${item.id}" data-size="${item.size}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details-page">
                        <div class="cart-item-name-page">${item.name}</div>
                        <div class="cart-item-size-page">Size: ${item.size}</div>
                        <div class="cart-item-price-page">Rs${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity-page">
                        <button class="quantity-btn-page decrease-quantity-page" data-id="${item.id}" data-size="${item.size}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn-page increase-quantity-page" data-id="${item.id}" data-size="${item.size}">+</button>
                    </div>
                    <div class="cart-item-remove-page" data-id="${item.id}" data-size="${item.size}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
        });
        
        // Calculate shipping and total
        const shipping = subtotal > 0 ? 5.00 : 0.00;
        const total = subtotal + shipping;
        
        // Update summary
        cartSubtotal.textContent = `Rs${subtotal.toFixed(2)}`;
        cartShipping.textContent = `Rs${shipping.toFixed(2)}`;
        cartTotal.textContent = `Rs${total.toFixed(2)}`;
    }
    
    // Add event listeners for quantity buttons and remove buttons
    const decreaseButtons = document.querySelectorAll('.decrease-quantity-page');
    const increaseButtons = document.querySelectorAll('.increase-quantity-page');
    const removeButtons = document.querySelectorAll('.cart-item-remove-page');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
}

// Function to update checkout page
function updateCheckoutPage() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Clear checkout items container
    checkoutItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // If cart is empty, redirect to cart page
        window.location.href = 'cart.html';
    } else {
        // If cart has items, show them
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            checkoutItemsContainer.innerHTML += `
                <div class="checkout-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="checkout-item-details">
                        <div class="checkout-item-name">${item.name}</div>
                        <div class="checkout-item-size">Size: ${item.size}</div>
                        <div>Quantity: ${item.quantity}</div>
                    </div>
                    <div class="checkout-item-price">Rs${(itemTotal).toFixed(2)}</div>
                </div>
            `;
        });
        
        // Calculate shipping and total
        const shipping = subtotal > 0 ? 5.00 : 0.00;
        const total = subtotal + shipping;
        
        // Update summary
        checkoutSubtotal.textContent = `Rs${subtotal.toFixed(2)}`;
        checkoutShipping.textContent = `Rs${shipping.toFixed(2)}`;
        checkoutTotal.textContent = `Rs${total.toFixed(2)}`;
    }
}

// Function to decrease item quantity
function decreaseQuantity(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const size = button.getAttribute('data-size');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find item in cart
    const itemIndex = cart.findIndex(item => 
        item.id === id && item.size === size
    );
    
    if (itemIndex !== -1) {
        // If quantity is 1, remove item
        if (cart[itemIndex].quantity === 1) {
            cart.splice(itemIndex, 1);
        } else {
            // Otherwise, decrease quantity
            cart[itemIndex].quantity -= 1;
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        updateCartCount();
        updateCartPopup();
        
        // Update cart page if we're on it
        if (document.querySelector('.cart-items-container')) {
            updateCartPage();
        }
    }
}

// Function to increase item quantity
function increaseQuantity(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const size = button.getAttribute('data-size');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find item in cart
    const itemIndex = cart.findIndex(item => 
        item.id === id && item.size === size
    );
    
    if (itemIndex !== -1) {
        // Increase quantity
        cart[itemIndex].quantity += 1;
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        updateCartCount();
        updateCartPopup();
        
        // Update cart page if we're on it
        if (document.querySelector('.cart-items-container')) {
            updateCartPage();
        }
    }
}

// Function to remove item from cart
function removeCartItem(event) {
    const button = event.target.closest('.cart-item-remove') || event.target.closest('.cart-item-remove-page');
    const id = button.getAttribute('data-id');
    const size = button.getAttribute('data-size');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the item to remove
    cart = cart.filter(item => !(item.id === id && item.size === size));
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartCount();
    updateCartPopup();
    
    // Update cart page if we're on it
    if (document.querySelector('.cart-items-container')) {
        updateCartPage();
    }
}

// Function to clear cart
function clearCart() {
    // Clear cart in localStorage
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Update cart display
    updateCartCount();
    updateCartPopup();
    
    // Update cart page if we're on it
    if (document.querySelector('.cart-items-container')) {
        updateCartPage();
    }
    
    // Close cart popup if it's open
    const cartPopup = document.querySelector('.cart-popup');
    if (cartPopup && cartPopup.classList.contains('active')) {
        toggleCartPopup();
    }
}

// Function to filter products
function filterProducts(event) {
    const button = event.target;
    const filter = button.getAttribute('data-filter');
    
    // Remove active class from all filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Show/hide product cards based on filter
    productCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const category = card.getAttribute('data-category');
            if (category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Function to place order
function placeOrder(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // If cart is empty, show error and return
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Create order object
    const order = {
        customer: {
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            country: formData.get('country')
        },
        payment: {
            cardName: formData.get('card_name'),
            cardNumber: formData.get('card_number'),
            expiry: formData.get('expiry'),
            cvv: formData.get('cvv')
        },
        items: cart,
        total: calculateTotal(cart)
    };
    
    // Send order to server
    fetch('process_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear cart
            clearCart();
            
            // Show success message
            showNotification('Order placed successfully!');
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = 'order_confirmation.html';
            }, 2000);
        } else {
            // Show error message
            showNotification(data.message || 'Error placing order!', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error placing order!', 'error');
    });
}

// Function to calculate total
function calculateTotal(cart) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0.00;
    return subtotal + shipping;
}

// Function to show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification Rs{type}`;
    notification.textContent = message;
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s, transform 0.3s;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.success {
        background-color: #4CAF50;
    }
    
    .notification.error {
        background-color: #F44336;
    }
`;
document.head.appendChild(style);