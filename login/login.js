 function updateCartCount() {
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            document.getElementById('cart-count').textContent = cartItems.length;
        }

        window.addEventListener('load', updateCartCount);

        function showAlert(message, type) {
            const alertContainer = document.getElementById('alert-container');
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            alertContainer.innerHTML = '';
            alertContainer.appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }

        function showValidationError(fieldName, message) {
            const input = document.querySelector(`input[name="${fieldName}"]`);
            if (!input) return;
            
            input.classList.add('input-error');
            
            let errorElem = input.parentNode.querySelector('.error-message');
            if (!errorElem) {
                errorElem = document.createElement('div');
                errorElem.className = 'error-message';
                input.parentNode.appendChild(errorElem);
            }
            
            errorElem.textContent = message;
        }

        function clearValidationErrors() {
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.input-error').forEach(input => {
                input.classList.remove('input-error');
            });
        }

        document.getElementById('login-form').addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const loginInput = this.login.value.trim();
            const passwordInput = this.password.value.trim();
            
            clearValidationErrors();
            
            let isValid = true;
            if (!loginInput) {
                showValidationError('login', 'Логін обов\'язковий');
                isValid = false;
            }
            if (!passwordInput) {
                showValidationError('password', 'Пароль обов\'язковий');
                isValid = false;
            }
            if (!isValid) return;

            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Зачекайте...';

            const url = 'https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userLogin';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: loginInput, password: passwordInput }),
                });

                if (!response.ok) {
                    throw new Error('Невірний логін або пароль');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('username', loginInput);

                showAlert('Вхід успішний!', 'success');

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
                
            } catch (error) {
                showAlert(error.message, 'danger');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Увійти';
            }
        });

        function checkAuthStatus() {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');
            
            if (token && username) {
                const loginElement = document.querySelector('.log-in span');
                loginElement.innerHTML = `<a href="#" id="logout-link">${username} (Вийти)</a>`;

                if (role === 'admin') {
                    const addProductLink = document.querySelector('.add-product');
                    if (addProductLink) {
                        addProductLink.style.display = 'inline-block';
                    }
                }

                document.getElementById('logout-link').addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('username');
                    window.location.reload();
                });
            }
        }

        window.addEventListener('load', checkAuthStatus);