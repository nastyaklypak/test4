
document.addEventListener('DOMContentLoaded', function() {
   
    function checkAdminAuth() {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        
      
        if (!token || role !== 'admin') {
            alert('Доступ заборонено. Ця сторінка лише для адміністраторів.');
            window.location.href = '../login/login.html';
            return false;
        }
        
      
        const isSpecialAdmin = (username === 'test_user');
        
 
        updateUIForAdmin(isSpecialAdmin);
        return true;
    }
    

    function updateUIForAdmin(isSpecialAdmin) {
        const username = localStorage.getItem('username');
        const loginElement = document.querySelector('.log-in span');
        
        if (loginElement) {
            loginElement.innerHTML = `<a href="#" id="logout-link">${username} (Вийти)</a>`;
        }
        
        const addProductLink = document.querySelector('.add-product');
        if (addProductLink) {
            addProductLink.style.display = 'inline-block';
        }
        

        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                window.location.href = '../login/login.html';
            });
        }
        
      
        if (!isSpecialAdmin) {
            const form = document.getElementById('addProductForm');
            if (form) {
                const inputs = form.querySelectorAll('input, textarea, select, button');
                inputs.forEach(input => {
                    input.disabled = true;
                });
                
              
                const formMessage = document.createElement('div');
                formMessage.className = 'form-message';
                formMessage.textContent = 'Лише адміністратор test_user може додавати товари.';
                formMessage.style.color = '#c00';
                formMessage.style.marginTop = '15px';
                formMessage.style.fontWeight = 'bold';
                
                form.appendChild(formMessage);
            }
        }
    }
    

    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartItems.length;
        }
    }
    

    if (!checkAdminAuth()) {
        return;
    }
    

    updateCartCount();
    
   
    const addProductForm = document.getElementById('addProductForm');
    const successMessage = document.getElementById('successMessage');
    
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            

            if (!token || username !== 'test_user') {
                successMessage.textContent = 'Помилка: Лише test_user може додавати товари';
                successMessage.style.color = 'red';
                return;
            }
            
            const name = document.getElementById('name').value;
            const img = document.getElementById('img').value;
            const price = document.getElementById('price').value;
            const category = document.getElementById('category').value;
            const description = document.getElementById('description').value;
            const stock = parseInt(document.getElementById('stock').value);
            const newId = Math.floor(Math.random() * 10000) + 100;
            
            const newProduct = {
                id: newId,
                name,
                img,
                price,
                category,
                description,
                stock
            };
            
            console.log("Додається товар:", newProduct);
            alert(`Product "${name}" submitted! Check console for details.`);
            
            sendProductToServer(newProduct, token);
            addProductForm.reset();
        });
    }
    
    function sendProductToServer(product, token) {
        const apiUrl = 'https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userCreateItem';
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Товар успішно додано:', data);
            successMessage.textContent = 'Товар успішно додано!';
            successMessage.style.color = 'green';
            setTimeout(() => {
                successMessage.textContent = '';
            }, 3000);
        })
        .catch(error => {
            console.error('Помилка при додаванні товару:', error);
            successMessage.textContent = `Помилка: ${error.message}`;
            successMessage.style.color = 'red';
        });
    }
});