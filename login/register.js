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
            
         
            if (!document.querySelector('.input-error:not(' + fieldName + ')')) {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function clearValidationErrors() {
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.input-error').forEach(input => {
                input.classList.remove('input-error');
            });
        }

        function validatePassword(password) {
    
            const hasLetter = /[a-zA-Zа-яА-ЯіІїЇєЄ]/.test(password);
            
            const hasDigit = /\d/.test(password);
            
           
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            return {
                isValid: hasLetter && hasDigit && hasSpecialChar,
                hasLetter,
                hasDigit,
                hasSpecialChar
            };
        }

        document.getElementById('register-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const usernameInput = this.username.value.trim();
            const passwordInput = this.password.value.trim();
            const confirmPasswordInput = document.getElementById('confirm-password').value.trim();
            const roleInput = this.role.value;

            clearValidationErrors();

            let isValid = true;
            let validationErrors = [];

      
            if (!usernameInput) {
                showValidationError('username', 'Логін обов\'язковий');
                validationErrors.push('Відсутній логін');
                isValid = false;
            } else if (usernameInput.length < 3) {
                showValidationError('username', 'Логін повинен містити не менше 3 символів');
                validationErrors.push('Логін занадто короткий');
                isValid = false;
            }

        
            if (!passwordInput) {
                showValidationError('password', 'Пароль обов\'язковий');
                validationErrors.push('Відсутній пароль');
                isValid = false;
            } else if (passwordInput.length < 4) {
                showValidationError('password', 'Пароль повинен містити не менше 4 символів');
                validationErrors.push('Пароль занадто короткий');
                isValid = false;
            } else {
              
                const passwordValidation = validatePassword(passwordInput);
                if (!passwordValidation.isValid) {
                    let errorMessages = [];
                    if (!passwordValidation.hasLetter) errorMessages.push('літери');
                    if (!passwordValidation.hasDigit) errorMessages.push('цифри');
                    if (!passwordValidation.hasSpecialChar) errorMessages.push('спеціальні символи (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?)');
                    
                    let errorMsg = 'Пароль повинен містити: ' + errorMessages.join(', ');
                    
                    showValidationError('password', errorMsg);
                    validationErrors.push('Пароль не відповідає вимогам безпеки');
                    isValid = false;
                    
                   
                    const passwordHint = document.getElementById('password-requirements');
                    if (passwordHint) {
                        passwordHint.classList.add('highlighted');
                        setTimeout(() => passwordHint.classList.remove('highlighted'), 3000);
                    }
                }
            }


            if (passwordInput !== confirmPasswordInput) {
                showValidationError('confirm-password', 'Паролі не співпадають. Будь ласка, введіть однакові паролі в обох полях.');
                validationErrors.push('Паролі не співпадають');
                isValid = false;
            }

            if (!isValid) {
               
                showAlert('Форма містить помилки: ' + validationErrors.join(', '), 'danger');
                return;
            }

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