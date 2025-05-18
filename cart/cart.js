const ShoppingCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const save = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const normalizeCart = () => {
        cart = cart
            .filter(item => typeof item.id !== 'undefined') 
            .map(item => ({
                id: item.id,
                quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1
            }));
        save();
    };

    normalizeCart(); 

    const addItemToCart = (productId) => {
        if (!productId) {
            console.error("Переданий ID є undefined або null");
            return;
        }

        const product = CATALOG.find(p => p.id === productId);
        if (!product) {
            console.error('Товар не знайдений в каталозі:', productId);
            return;
        }

        const item = cart.find(i => i.id === productId);

        if (item) {
            item.quantity = Number(item.quantity) || 0;
            if (item.quantity < product.stock) {
                item.quantity++;
            } else {
                showAlert("Немає більше в наявності", "warning");
            }
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        save();
        updateCartCount();
    };

    const removeItemFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        save();
        updateCartCount();
    };

    const increaseQuantity = (productId) => {
        const product = CATALOG.find(p => p.id === productId);
        const item = cart.find(i => i.id === productId);

        if (item) {
            item.quantity = Number(item.quantity) || 0;
            if (item.quantity < product.stock) {
                item.quantity++;
                save();
                updateCartCount();
            } else {
                showAlert("Немає більше в наявності", "warning");
            }
        }
    };

    const decreaseQuantity = (productId) => {
        const item = cart.find(i => i.id === productId);

        if (item) {
            item.quantity = Number(item.quantity) || 1;
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== productId);
            }
            save();
            updateCartCount();
        }
    };

    const getCartItems = () => {
        cart = cart.filter(({ id, quantity }) => {
            const exists = CATALOG.some(p => p.id === id);
            if (!exists) console.error(`Товар не знайдений в каталозі: ${id}`);
            return exists && typeof quantity === 'number' && quantity > 0;
        });
        save();
        return cart;
    };

    return {
        addItemToCart,
        removeItemFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartItems
    };
};

function calculateTotal(cartItems) {
    return cartItems.reduce((total, { id, quantity }) => {
        const product = CATALOG.find(p => p.id === id);
        if (!product) return total;
        const price = parseFloat(product.price.replace('$', ''));
        return total + price * quantity;
    }, 0);
}

function removeItem(productId) {
    const cart = ShoppingCart();
    cart.removeItemFromCart(productId);
    renderCart();
}

function changeQuantity(productId, delta) {
    const cart = ShoppingCart();
    if (delta > 0) {
        cart.increaseQuantity(productId);
    } else {
        cart.decreaseQuantity(productId);
    }
    renderCart();
}

function addToCart(productId) {
    const cart = ShoppingCart();
    cart.addItemToCart(productId);
    renderCart();
}


function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        
        const newAlertContainer = document.createElement('div');
        newAlertContainer.id = 'alert-container';
        document.body.insertBefore(newAlertContainer, document.body.firstChild);
        alertContainer = newAlertContainer;
    }
    
  
    alertContainer.innerHTML = '';
    
   
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = message;
    
    alertContainer.appendChild(alertDiv);
    
  
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}


function updateCartCount() {
    const cart = ShoppingCart().getCartItems();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        
        if (totalItems > 0) {
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

let chart;

function renderChart() {
    const ctx = document.getElementById('chart-container');
    if (!ctx || !ctx.getContext) {
        console.error('Контейнер для графіка не знайдено');
        return;
    }

    const chartContext = ctx.getContext('2d');
    const chartTypeSelect = document.getElementById('chart-type');
    const chartType = chartTypeSelect ? chartTypeSelect.value : 'pie';

    const cart = ShoppingCart();
    const cartItems = cart.getCartItems();

    if (cartItems.length === 0) {
        if (chart) {
            chart.destroy();
            chart = null;
        }
        return;
    }

    const labels = cartItems.map(item => {
        const product = CATALOG.find(p => p.id === item.id);
        return product ? product.name : 'Невідомо';
    });

    const data = cartItems.map(item => {
        const product = CATALOG.find(p => p.id === item.id);
        return product ? parseFloat(product.price.replace('$', '')) * item.quantity : 0;
    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(chartContext, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Сума покупок',
                data: data,
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#ffce56', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'
                ],
                borderColor: '#fff',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: chartType === 'pie',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `$${context.parsed.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: chartType !== 'pie' ? {
                y: {
                    beginAtZero: true
                }
            } : {}
        }
    });
}

function renderCart() {
    const shoppingDiv = document.getElementById('shopping-cart');
    if (!shoppingDiv) {
        console.error('Контейнер для кошика не знайдено');
        return;
    }
    
    const cartManager = ShoppingCart(); 
    let cartItems = cartManager.getCartItems();
    
    const sortElement = document.getElementById('sort');
    const sortValue = sortElement ? sortElement.value : 'name-asc';
    
    const minPriceElement = document.getElementById('min-price');
    const maxPriceElement = document.getElementById('max-price');
    
    const minPrice = minPriceElement && !isNaN(parseFloat(minPriceElement.value)) 
        ? parseFloat(minPriceElement.value) 
        : 0;
        
    const maxPrice = maxPriceElement && !isNaN(parseFloat(maxPriceElement.value)) 
        ? parseFloat(maxPriceElement.value) 
        : Infinity;

  
    cartItems = cartItems.filter(({ id }) => {
        const product = CATALOG.find(p => p.id === id);
        if (!product) return false;
        const price = parseFloat(product.price.replace('$', ''));
        return price >= minPrice && (maxPrice === Infinity || price <= maxPrice);
    });

  
    cartItems.sort((a, b) => {
        const prodA = CATALOG.find(p => p.id === a.id);
        const prodB = CATALOG.find(p => p.id === b.id);
        if (!prodA || !prodB) return 0;

        if (sortValue === 'name-asc') {
            return prodA.name.localeCompare(prodB.name);
        } else if (sortValue === 'price-asc') {
            return parseFloat(prodA.price.replace('$', '')) - parseFloat(prodB.price.replace('$', ''));
        } else if (sortValue === 'price-desc') {
            return parseFloat(prodB.price.replace('$', '')) - parseFloat(prodA.price.replace('$', ''));
        }
        return 0;
    });

    if (cartItems.length === 0) {
        shoppingDiv.innerHTML = '<p>Ваш кошик порожній</p>';
        return;
    }

    const htmlItems = cartItems.map(({ id, quantity }) => {
        const product = CATALOG.find(p => p.id === id);
        if (!product) return '';

        return `
            <li class="cart-item">
                <div class="cart-item__details">
                    <img class="cart-item__img" src="${product.img}" alt="${product.name}" />
                    <div class="cart-item__info">
                        <span class="cart-item__name">${product.name}</span>
                        <span class="cart-item__price">${product.price}</span>
                    </div>
                </div>
                <div class="cart-item__controls">
                    <div class="cart-item__quantity">
                        <button class="change-quantity" data-id="${id}" data-action="decrease">−</button>
                        <span>${quantity}</span>
                        <button class="change-quantity" data-id="${id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item" data-id="${id}">Видалити</button>
                </div>
            </li>`;
    }).join('');

    
    const total = calculateTotal(cartItems).toFixed(2);
    
    shoppingDiv.innerHTML = `
        <ul class="cart-list">${htmlItems}</ul>
        <p class="cart-total">Загальна сума: $${total}</p>
        <div class="checkout-section">
            <button id="checkout-button" class="checkout-button">Оформити замовлення</button>
        </div>
    `;

    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeItem(productId);
        });
    });

    document.querySelectorAll('.change-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const action = e.target.getAttribute('data-action');
            changeQuantity(productId, action === 'increase' ? 1 : -1);
        });
    });

   
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', processCheckout);
    }

    renderChart();
}


function processCheckout() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        showAuthRequiredAlert();
    } else {
       
        submitOrder();
    }
}

function showAuthRequiredAlert() {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        
        const newAlertContainer = document.createElement('div');
        newAlertContainer.id = 'alert-container';
        document.body.insertBefore(newAlertContainer, document.body.firstChild);
        return showAuthRequiredAlert(); 
    }
    
  
    alertContainer.innerHTML = '';
    

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning';
    alertDiv.innerHTML = `
        <p>Для оформлення замовлення необхідно авторизуватися.</p>
        <div class="auth-links">
            <a href="../login/login.html" class="btn btn-primary">Увійти</a>
            <a href="../login/register.html" class="btn btn-secondary">Зареєструватися</a>
        </div>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Прокручуємо до повідомлення
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Автоматично приховуємо повідомлення через 10 секунд
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}


function submitOrder() {
    const cartManager = ShoppingCart();
    const cartItems = cartManager.getCartItems();
    
    if (cartItems.length === 0) {
        showAlert('Кошик порожній. Додайте товари для оформлення замовлення.', 'warning');
        return;
    }
    
   
    
    const token = localStorage.getItem('token');
    const orderData = {
        items: cartItems.map(item => {
            const product = CATALOG.find(p => p.id === item.id);
            return {
                id: item.id,
                name: product ? product.name : 'Невідомий товар',
                price: product ? parseFloat(product.price.replace('$', '')) : 0,
                quantity: item.quantity
            };
        }),
        totalAmount: calculateTotal(cartItems),
        date: new Date().toISOString()
    };
    
  
    showAlert('Замовлення успішно оформлено! Дякуємо за покупку.', 'success');
    
  
    localStorage.setItem('cart', JSON.stringify([]));
    
    renderCart();
    updateCartCount();
}

function initializeFilters() {
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', () => {
            renderCart();
        });
    }

    const applyChartTypeButton = document.getElementById('apply-chart-type');
    if (applyChartTypeButton) {
        applyChartTypeButton.addEventListener('click', () => {
            renderChart();
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    renderCart();
    initializeFilters();  
    updateCartCount();  

    const chartTypeSelect = document.getElementById('chart-type');
    if (chartTypeSelect) {
        chartTypeSelect.addEventListener('change', () => {
            renderChart();
        });
    }
});