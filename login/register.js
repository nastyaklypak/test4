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

        document.getElementById('register-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const usernameInput = this.username.value.trim();
            const passwordInput = this.password.value.trim();
            const confirmPasswordInput = document.getElementById('confirm-password').value.trim();
            const roleInput = this.role.value;

            clearValidationErrors();

            let isValid = true;

            if (!usernameInput) {
                showValidationError('username', 'Логін обов\'язковий');
                isValid = false;
            } else if (usernameInput.length < 3) {
                showValidationError('username', 'Логін повинен містити не менше 3 символів');
                isValid = false;
            }

            if (!passwordInput) {
                showValidationError('password', 'Пароль обов\'язковий');
                isValid = false;
            } else if (passwordInput.length < 4) {
                showValidationError('password', 'Пароль повинен містити не менше 4 символів');
                isValid = false;
            }

            if (passwordInput !== confirmPasswordInput) {
                showValidationError('confirm-password', 'Паролі не співпадають');
                isValid = false;
            }

            if (!isValid) return;

            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Зачекайте...';

            const url = 'https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userRegister';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: usernameInput,
                        password: passwordInput,
                        role: roleInput
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Помилка реєстрації');
                }

                showAlert('Реєстрація успішна! Тепер ви можете увійти в систему.', 'success');

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                showAlert(error.message, 'danger');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Зареєструватися';
            }
        });

        function checkAuthStatus() {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (token && username) {
                const loginElement = document.querySelector('.log-in span');
                loginElement.innerHTML = `<a href="#" id="logout-link">${username} (Вийти)</a>`;

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